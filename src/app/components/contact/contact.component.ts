import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, Subscription } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  contactForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess: boolean | null = null;
  user: User | null = null;
  private authSubscription!: Subscription;

  private readonly API_URL = environment.apiUrl;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authState$.subscribe((state) => {
      this.user = state.user;
      if (this.user) {
        this.contactForm.patchValue({
          name: this.user.username,
          email: this.user.email,
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';
    this.submitSuccess = null;

    const contactData = { ...this.contactForm.value };
    if (this.user) {
      contactData.user = this.user._id;
    }

    this.http
      .post<{ message?: string }>(`${this.API_URL}/api/contact`, contactData)
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
