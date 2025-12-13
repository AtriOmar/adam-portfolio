import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaService } from '../../../services/media.service';
import { CreateMediaDto } from '../../../models/media.model';

@Component({
  selector: 'app-media-upload-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './media-upload-modal.component.html',
})
export class MediaUploadModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() mediaUploaded = new EventEmitter<void>();

  uploadForm: FormGroup;
  isLoading = false;
  error = '';
  isVisible = false;

  constructor(private fb: FormBuilder, private mediaService: MediaService) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      thumbnail: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      category: [''],
      featured: [false],
    });

    // Trigger fade in animation after component initialization
    setTimeout(() => {
      this.isVisible = true;
    }, 10);
  }

  onSubmit() {
    if (this.uploadForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.error = '';

      const formValue = this.uploadForm.value;
      const mediaData: CreateMediaDto = {
        title: formValue.title,
        description: formValue.description,
        type: formValue.type,
        url: formValue.url,
        thumbnail: formValue.thumbnail || undefined,
        category: formValue.category || undefined,
        featured: formValue.featured,
      };

      this.mediaService.createMedia(mediaData).subscribe({
        next: () => {
          this.isLoading = false;
          this.mediaUploaded.emit();
          this.close();
        },
        error: (error) => {
          this.isLoading = false;
          this.error =
            error.error?.errors?.[0]?.detail || 'Failed to upload media. Please try again.';
        },
      });
    }
  }

  close() {
    this.isVisible = false;
    // Wait for animation to complete before emitting close event
    setTimeout(() => {
      this.closeModal.emit();
    }, 300);
  }
}
