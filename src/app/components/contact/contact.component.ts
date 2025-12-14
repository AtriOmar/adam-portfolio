import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  contactForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess: boolean | null = null; // null = nothing, true = success, false = error

  private readonly API_URL = environment.apiUrl;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';
    this.submitSuccess = null;

    this.http
      .post<{ message?: string }>(`${this.API_URL}/api/contact`, this.contactForm.value)
      .pipe(
        catchError((error) => {
          console.error('Contact form submission failed:', error);

          this.isSubmitting = false;
          this.submitSuccess = false;
          this.submitMessage = 'Failed to send message. Please try again later.';

          return throwError(() => error);
        })
      )
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.submitMessage = 'Thank you! Your message has been sent.';
          this.contactForm.reset();
        },
      });
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }
}
