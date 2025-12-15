import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isAvailable: boolean;
  isPast: boolean;
}

interface Reservation {
  _id: string;
  serviceType: string;
  eventDate: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  message?: string;
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateFormatPipe],
  templateUrl: './reservation.component.html',
})
export class ReservationComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  calendarDays: CalendarDay[] = [];
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Modal state
  isModalOpen = false;
  selectedDate: Date | null = null;
  reservationForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;

  private readonly API_URL = environment.apiUrl;

  // Reservations and loading state
  reservations: Reservation[] = [];
  isLoading = false;
  unavailableDates: Date[] = [];

  constructor() {
    this.reservationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]{10,}$/)]],
      serviceType: ['', Validators.required],
      message: ['', Validators.maxLength(500)],
    });
  }

  ngOnInit() {
    this.fetchReservations();
  }

  fetchReservations() {
    this.isLoading = true;
    this.http
      .get<{ data: Reservation[] }>(`${this.API_URL}/api/reservations`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching reservations:', error);
          return of({ data: [] });
        })
      )
      .subscribe((response) => {
        this.reservations = response.data || [];
        this.updateUnavailableDates();
        this.generateCalendar();
        this.isLoading = false;
      });
  }

  updateUnavailableDates() {
    this.unavailableDates = this.reservations
      .filter((reservation) => reservation.status !== 'cancelled')
      .map((reservation) => new Date(reservation.eventDate))
      .filter((date) => !isNaN(date.getTime())); // Filter out invalid dates
  }

  generateCalendar() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    this.calendarDays = [];

    // Add previous month's trailing days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth, -i);
      this.calendarDays.push({
        date,
        day: date.getDate(),
        isCurrentMonth: false,
        isAvailable: false,
        isPast: true,
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      const isUnavailable = this.unavailableDates.some((unavailable) => {
        const unavailableDate = new Date(unavailable);
        return (
          unavailableDate.getFullYear() === date.getFullYear() &&
          unavailableDate.getMonth() === date.getMonth() &&
          unavailableDate.getDate() === date.getDate()
        );
      });

      this.calendarDays.push({
        date,
        day,
        isCurrentMonth: true,
        isAvailable: !isPast && !isUnavailable,
        isPast,
      });
    }

    // Add next month's leading days to fill the grid
    const remainingCells = 42 - this.calendarDays.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, day);
      this.calendarDays.push({
        date,
        day,
        isCurrentMonth: false,
        isAvailable: false,
        isPast: false,
      });
    }
  }

  previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  onDayClick(calendarDay: CalendarDay) {
    if (calendarDay.isAvailable && calendarDay.isCurrentMonth) {
      this.selectedDate = calendarDay.date;
      this.isModalOpen = true;
      this.reservationForm.reset();
      this.submitMessage = '';
      this.submitSuccess = false;
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedDate = null;
  }

  onSubmit() {
    if (this.reservationForm.valid && this.selectedDate) {
      this.isSubmitting = true;
      this.submitMessage = '';

      const formValue = this.reservationForm.value;
      const reservationData = {
        serviceType: formValue.serviceType,
        eventDate: this.selectedDate.toISOString(),
        contactInfo: {
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          email: formValue.email,
          phone: formValue.phone,
        },
        message: formValue.message || '',
        status: 'pending',
      };

      this.http
        .post<{ data: Reservation }>(`${this.API_URL}/api/reservations`, reservationData)
        .pipe(
          catchError((error) => {
            console.error('Error creating reservation:', error);
            this.isSubmitting = false;
            this.submitSuccess = false;
            this.submitMessage = 'Failed to submit reservation. Please try again.';
            return of(null);
          })
        )
        .subscribe((response) => {
          this.isSubmitting = false;
          if (response) {
            this.submitSuccess = true;
            this.submitMessage =
              "Your reservation request has been sent! I'll contact you within 24 hours to confirm.";

            // Refresh reservations to update calendar
            this.fetchReservations();

            // Close modal after 3 seconds
            setTimeout(() => {
              this.closeModal();
            }, 3000);
          }
        });
    } else {
      this.reservationForm.markAllAsTouched();
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.reservationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        const displayName =
          fieldName === 'firstName'
            ? 'First name'
            : fieldName === 'lastName'
            ? 'Last name'
            : fieldName === 'serviceType'
            ? 'Service type'
            : fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        return `${displayName} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        const displayName =
          fieldName === 'firstName'
            ? 'First name'
            : fieldName === 'lastName'
            ? 'Last name'
            : fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        return `${displayName} must be at least ${requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `Message cannot exceed ${maxLength} characters`;
      }
    }
    return '';
  }
}
