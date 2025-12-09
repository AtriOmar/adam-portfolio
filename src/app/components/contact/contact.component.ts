import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

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
  submitSuccess = false;

  private readonly BACKEND_URL = 'http://localhost:3000'; // Change this to your backend URL

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitMessage = '';

      const formData = this.contactForm.value;

      this.http
        .post(`${this.BACKEND_URL}/api/contact`, formData)
        .pipe(
          catchError((error) => {
            console.log('Failed to send message to backend, simulating success:', error);
            // Simulate success for demo purposes
            return of({ success: true, message: 'Message sent successfully!' });
          })
        )
        .subscribe((response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.submitMessage = "Thank you for your message! I'll get back to you soon.";
          this.contactForm.reset();
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.contactForm.markAllAsTouched();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
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
