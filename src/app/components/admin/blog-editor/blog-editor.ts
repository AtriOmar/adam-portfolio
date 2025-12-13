import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { BlogService } from '../../../services/blog.service';
import { Blog } from '../../../models/blog.model';

@Component({
  selector: 'app-blog-editor',
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './blog-editor.html',
  styles: ``,
})
export class BlogEditor implements OnInit {
  blogForm: FormGroup;
  isEditing = false;
  blogId: string | null = null;
  loading = false;
  saving = false;
  error: string | null = null;

  categories = [
    { value: 'photography-tips', label: 'Photography Tips' },
    { value: 'videography-tips', label: 'Videography Tips' },
    { value: 'behind-the-scenes', label: 'Behind the Scenes' },
    { value: 'client-stories', label: 'Client Stories' },
    { value: 'tutorials', label: 'Tutorials' },
    { value: 'equipment-reviews', label: 'Equipment Reviews' },
    { value: 'industry-news', label: 'Industry News' },
    { value: 'other', label: 'Other' },
  ];

  quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.blogForm = this.createForm();
  }

  ngOnInit() {
    this.blogId = this.route.snapshot.params['id'];
    this.isEditing = !!this.blogId;

    if (this.isEditing) {
      this.loadBlog();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      excerpt: ['', [Validators.maxLength(300)]],
      author: ['Admin User'], // Simple author name string
      category: ['other'],
      tags: [''],
      published: [false],
      featuredImage: this.fb.group({
        url: [''],
        alt: [''],
      }),
      metaDescription: ['', [Validators.maxLength(160)]],
      featured: [false],
    });
  }

  loadBlog() {
    if (!this.blogId) return;

    this.loading = true;
    this.error = null;

    this.blogService.getBlog(this.blogId).subscribe({
      next: (response) => {
        const blog = response.data;
        this.populateForm(blog);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load blog post';
        this.loading = false;
        console.error('Error loading blog:', error);
      },
    });
  }

  populateForm(blog: Blog) {
    this.blogForm.patchValue({
      title: blog.attributes.title,
      content: blog.attributes.content,
      excerpt: blog.attributes.excerpt || '',
      author: blog.attributes.author,
      category: blog.attributes.category,
      tags: blog.attributes.tags.join(', '),
      published: blog.attributes.published,
      featuredImage: {
        url: blog.attributes.featuredImage?.url || '',
        alt: blog.attributes.featuredImage?.alt || '',
      },
      metaDescription: blog.attributes.metaDescription || '',
      featured: blog.attributes.featured,
    });
  }

  onSubmit() {
    if (this.blogForm.invalid) {
      this.markFormGroupTouched();
      this.error = 'Please fill in all required fields correctly.';
      return;
    }

    this.saving = true;
    this.error = null;

    const formData = this.prepareBlogData();

    const operation = this.isEditing
      ? this.blogService.updateBlog(this.blogId!, formData)
      : this.blogService.createBlog(formData);

    operation.subscribe({
      next: (response) => {
        this.saving = false;
        // Show success message or toast here
        this.router.navigate(['/admin/blogs']);
      },
      error: (error) => {
        let errorMessage = this.isEditing
          ? 'Failed to update blog post'
          : 'Failed to create blog post';

        // Try to extract specific error message from response
        if (error?.error?.errors?.[0]?.detail) {
          errorMessage += ': ' + error.error.errors[0].detail;
        } else if (error?.message) {
          errorMessage += ': ' + error.message;
        }

        this.error = errorMessage;
        this.saving = false;
        console.error('Error saving blog:', error);
      },
    });
  }

  prepareBlogData() {
    const formValue = this.blogForm.value;

    return {
      ...formValue,
      tags: formValue.tags
        ? formValue.tags
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag)
        : [],
      featuredImage: formValue.featuredImage.url
        ? {
            url: formValue.featuredImage.url,
            alt: formValue.featuredImage.alt || '',
          }
        : null,
      readTime: this.calculateReadTime(formValue.content),
      publishedAt: formValue.published ? new Date() : null,
      slug: this.generateSlug(formValue.title),
    };
  }

  calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  markFormGroupTouched() {
    Object.keys(this.blogForm.controls).forEach((key) => {
      const control = this.blogForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((nestedKey) => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/admin/blogs']);
  }

  getFieldError(fieldName: string): string {
    const field = this.blogForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
    }
    return '';
  }
}
