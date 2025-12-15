import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, Contact, ContactStats } from '../../../services/contact.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-messages.component.html',
})
export class AdminMessagesComponent implements OnInit {
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
  selectedType = 'all';
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
    this.contactService.getStats().subscribe({
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

    this.contactService.getMessages(filters).subscribe({
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

    // Mark as read if unread
    if (message.status === 'unread') {
      this.updateMessageStatus(message._id, 'read');
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedMessage = null;
  }

  updateMessageStatus(id: string, status: 'read' | 'unread' | 'replied'): void {
    this.contactService.updateStatus(id, status).subscribe({
      next: (response) => {
        // Update the message in the local array
        const messageIndex = this.messages.findIndex((m) => m._id === id);
        if (messageIndex !== -1) {
          this.messages[messageIndex] = response.data;
        }

        // Update selected message if it's the same one
        if (this.selectedMessage && this.selectedMessage._id === id) {
          this.selectedMessage = response.data;
        }

        // Refresh stats
        this.loadStats();
      },
      error: (error) => {
        console.error('Error updating message status:', error);
      },
    });
  }

  markAsReplied(message: Contact): void {
    this.updateMessageStatus(message._id, 'replied');
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
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
