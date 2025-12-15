import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

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
  selector: 'app-reservation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateFormatPipe],
  templateUrl: './reservation-modal.component.html',
})
export class ReservationModalComponent {
  @Input() selectedDate: Date | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() reservationCreated = new EventEmitter<void>();

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  reservationForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;
  isVisible = false;

  private readonly API_URL = environment.apiUrl;

  constructor() {
    this.reservationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]{10,}$/)]],
      serviceType: ['', Validators.required],
      message: ['', Validators.maxLength(500)],
    });

    // Trigger fade in animation after component initialization
    setTimeout(() => {
      this.isVisible = true;
    }, 10);
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
          if (response?.data) {
            this.submitSuccess = true;
            this.submitMessage =
              'Reservation submitted successfully! I will contact you within 24 hours to confirm your booking.';
            this.reservationCreated.emit();
            // Auto close after success
            setTimeout(() => {
              this.close();
            }, 3000);
          }
        });
    } else {
      this.reservationForm.markAllAsTouched();
    }
  }

  close() {
    this.isVisible = false;
    // Wait for animation to complete before emitting close event
    setTimeout(() => {
      this.closeModal.emit();
    }, 300);
  }

  resetForm() {
    this.reservationForm.reset();
    this.submitMessage = '';
    this.submitSuccess = false;
    this.isSubmitting = false;
  }

  getFieldError(fieldName: string): string {
    const field = this.reservationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `Message cannot exceed 500 characters`;
      }
    }
    return '';
  }
}
