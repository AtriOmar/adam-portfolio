import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface ErrorResponse {
  errors: Array<{
    status: string;
    title: string;
    detail: string;
    source?: { pointer: string };
  }>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  otpForm: FormGroup;
  showOtpForm = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  verificationToken = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.registerForm.value;

      this.authService.createUser({ email, password }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.verificationToken = response.data.attributes.token;
          this.showOtpForm = true;
          this.successMessage = 'Verification code sent to your email. Please check your inbox.';
        },
        error: (error) => {
          this.isLoading = false;
          const errorResponse = error.error as ErrorResponse;
          this.errorMessage =
            errorResponse?.errors?.[0]?.detail || 'Registration failed. Please try again.';
        },
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  onVerifyOtp() {
    if (this.otpForm.valid && this.verificationToken) {
      this.isLoading = true;
      this.errorMessage = '';

      const { otp } = this.otpForm.value;

      this.authService
        .verifyUser({
          token: this.verificationToken,
          otp: otp,
        })
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = 'Account created successfully! Welcome aboard!';

            // Refresh auth state since the user is now created and logged in
            this.authService.refreshUser();

            // Redirect to home or login page after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000);
          },
          error: (error) => {
            this.isLoading = false;
            const errorResponse = error.error as ErrorResponse;
            this.errorMessage =
              errorResponse?.errors?.[0]?.detail || 'Verification failed. Please try again.';
          },
        });
    } else {
      this.markFormGroupTouched(this.otpForm);
    }
  }

  resendCode() {
    if (this.registerForm.valid) {
      this.onRegister();
    }
  }

  goBack() {
    this.showOtpForm = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.otpForm.reset();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  getFieldError(fieldName: string, formGroup: FormGroup): string {
    const control = formGroup.get(fieldName);

    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['minlength'])
        return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['pattern']) return 'Please enter a valid 6-digit code';
    }

    // Check for password mismatch at form level
    if (fieldName === 'confirmPassword' && control?.touched) {
      if (formGroup.errors?.['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }

    return '';
  }
}
