import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../services/contact.service';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

interface ContactStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
}

@Component({
  selector: 'app-user-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-messages.component.html',
})
export class UserMessagesComponent implements OnInit {
  messages: Contact[] = [];
  stats: ContactStats = { total: 0, unread: 0, read: 0, replied: 0 };
  loading = true;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  // Filters
  selectedStatus = 'all';
  dateFrom = '';
  searchQuery = '';

  // Modal
  showModal = false;
  selectedMessage: Contact | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadMessages();
  }

  loadStats(): void {
    this.contactService.getUserStats().subscribe({
      next: (response) => {
        this.stats = response.data;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      },
    });
  }

  loadMessages(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      status: this.selectedStatus !== 'all' ? this.selectedStatus : undefined,
      search: this.searchQuery || undefined,
      dateFrom: this.dateFrom || undefined,
    };

    this.contactService.getUserMessages(filters).subscribe({
      next: (response) => {
        this.messages = response.data;
        this.totalPages = response.meta.pagination.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.error = 'Failed to load messages. Please try again.';
        this.loading = false;
      },
    });
  }

  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.loadMessages();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadMessages();
  }

  onDateFilterChange(): void {
    this.currentPage = 1;
    this.loadMessages();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadMessages();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMessages();
    }
  }

  openMessageModal(message: Contact): void {
    this.selectedMessage = message;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedMessage = null;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'unread':
        return 'bg-red-100 text-red-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
