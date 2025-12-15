import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Media, MediaFilters } from '../../../models/media.model';
import { MediaService } from '../../../services/media.service';
import { MediaUploadModalComponent } from './media-upload-modal.component';

@Component({
  selector: 'app-admin-media',
  standalone: true,
  imports: [CommonModule, FormsModule, MediaUploadModalComponent],
  templateUrl: './admin-media.component.html',
})
export class AdminMediaComponent implements OnInit {
  media: Media[] = [];
  filteredMedia: Media[] = [];
  isLoading = false;
  error = '';
  showUploadModal = false;
  Math = Math;

  // Filter and search properties
  filters: MediaFilters = {
    page: 1,
    limit: 12,
  };
  searchTerm = '';
  selectedType = '';
  selectedCategory = '';

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 12;

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.loadMedia();
  }

  loadMedia() {
    this.isLoading = true;
    this.error = '';

    const filters: MediaFilters = {
      ...this.filters,
      type: this.selectedType || undefined,
      category: this.selectedCategory || undefined,
    };

    this.mediaService.getAllMedia(filters).subscribe({
      next: (response) => {
        this.media = response.data;
        this.applySearch();
        this.currentPage = response.meta.currentPage;
        this.totalPages = response.meta.totalPages;
        this.totalItems = response.meta.totalItems;
        this.itemsPerPage = response.meta.itemsPerPage;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load media. Please try again.';
        this.isLoading = false;
        console.error('Error loading media:', error);
      },
    });
  }

  applySearch() {
    if (this.searchTerm.trim()) {
      this.filteredMedia = this.media.filter(
        (item) =>
          item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredMedia = [...this.media];
    }
  }

  onTypeFilterChange() {
    this.filters.page = 1;
    this.loadMedia();
  }

  onCategoryFilterChange() {
    this.filters.page = 1;
    this.loadMedia();
  }

  onSearchChange() {
    this.applySearch();
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
  }

  onMediaUploaded() {
    this.loadMedia();
  }

  deleteMedia(mediaId: string) {
    if (confirm('Are you sure you want to delete this media?')) {
      this.mediaService.deleteMedia(mediaId).subscribe({
        next: () => {
          this.loadMedia();
        },
        error: (error) => {
          console.error('Error deleting media:', error);
          alert('Failed to delete media. Please try again.');
        },
      });
    }
  }

  toggleFeatured(media: Media) {
    this.mediaService.updateMedia(media._id, { featured: !media.featured }).subscribe({
      next: () => {
        this.loadMedia();
      },
      error: (error) => {
        console.error('Error updating media:', error);
        alert('Failed to update media. Please try again.');
      },
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.filters.page = page;
      this.loadMedia();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
