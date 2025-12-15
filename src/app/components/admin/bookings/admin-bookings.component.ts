import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HighlightDirective } from '../../../directives/highlight.directive';
import { DateFormatPipe } from '../../../pipes/date-format.pipe';
import { DateTimeFormatPipe } from '../../../pipes/date-time-format.pipe';

interface Reservation {
  _id: string;
  serviceType: 'wedding' | 'portrait' | 'event' | 'other';
  eventDate: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

interface Stats {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HighlightDirective,
    DateFormatPipe,
    DateTimeFormatPipe,
  ],
  templateUrl: './admin-bookings.component.html',
})
export class AdminBookingsComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  private readonly API_URL = environment.apiUrl;

  // State management
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  isLoading = false;
  stats: Stats = {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  };

  // Filter form
  filterForm: FormGroup;
  searchTerm = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor() {
    this.filterForm = this.fb.group({
      status: [''],
      serviceType: [''],
      eventDate: [''],
    });
  }

  ngOnInit() {
    this.fetchReservations();
    this.setupFilterSubscriptions();
  }

  private setupFilterSubscriptions() {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  fetchReservations() {
    this.isLoading = true;
    const params = new URLSearchParams({
      page: this.currentPage.toString(),
      limit: this.itemsPerPage.toString(),
    });

    this.http
      .get<{ data: Reservation[]; meta: any }>(`${this.API_URL}/api/reservations?${params}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching reservations:', error);
          return of({ data: [], meta: { totalItems: 0 } });
        })
      )
      .subscribe((response) => {
        this.reservations = response.data || [];
        this.totalItems = response.meta?.totalItems || 0;
        this.calculateStats();
        this.applyFilters();
        this.isLoading = false;
      });
  }

  calculateStats() {
    this.stats = {
      pending: this.reservations.filter((r) => r.status === 'pending').length,
      confirmed: this.reservations.filter((r) => r.status === 'confirmed').length,
      completed: this.reservations.filter((r) => r.status === 'completed').length,
      cancelled: this.reservations.filter((r) => r.status === 'cancelled').length,
    };
  }

  applyFilters() {
    let filtered = [...this.reservations];
    const filters = this.filterForm.value;

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    // Service type filter
    if (filters.serviceType) {
      filtered = filtered.filter((r) => r.serviceType === filters.serviceType);
    }

    // Date filter
    if (filters.eventDate) {
      const filterDate = new Date(filters.eventDate).toDateString();
      filtered = filtered.filter((r) => {
        const eventDate = new Date(r.eventDate).toDateString();
        return eventDate === filterDate;
      });
    }

    // Search term filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.contactInfo.firstName.toLowerCase().includes(term) ||
          r.contactInfo.lastName.toLowerCase().includes(term) ||
          r.contactInfo.email.toLowerCase().includes(term) ||
          r.serviceType.toLowerCase().includes(term)
      );
    }

    this.filteredReservations = filtered;
  }

  updateStatus(reservationId: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as 'pending' | 'confirmed' | 'cancelled' | 'completed';
    const updateData = { status: newStatus };

    this.http
      .put<{ data: Reservation }>(`${this.API_URL}/api/reservations/${reservationId}`, updateData)
      .pipe(
        catchError((error) => {
          console.error('Error updating reservation:', error);
          alert('Failed to update reservation status');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          // Update local data
          const index = this.reservations.findIndex((r) => r._id === reservationId);
          if (index !== -1) {
            this.reservations[index].status = newStatus;
            this.calculateStats();
            this.applyFilters();
          }
        }
      });
  }

  deleteReservation(reservationId: string) {
    const reservation = this.reservations.find((r) => r._id === reservationId);
    const clientName = reservation
      ? `${reservation.contactInfo.firstName} ${reservation.contactInfo.lastName}`
      : 'this reservation';

    if (
      !confirm(
        `Are you sure you want to delete ${clientName}'s reservation? This action cannot be undone.`
      )
    ) {
      return;
    }

    this.http
      .delete(`${this.API_URL}/api/reservations/${reservationId}`)
      .pipe(
        catchError((error) => {
          console.error('Error deleting reservation:', error);
          alert('Failed to delete reservation');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response !== null) {
          // Remove from local data
          this.reservations = this.reservations.filter((r) => r._id !== reservationId);
          this.calculateStats();
          this.applyFilters();
        }
      });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  }

  clearFilters() {
    this.filterForm.reset();
    this.searchTerm = '';
    this.applyFilters();
  }
}
