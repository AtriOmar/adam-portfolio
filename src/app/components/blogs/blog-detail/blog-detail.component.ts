import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  featuredImage: {
    url: string;
    alt: string;
  };
  category:
    | 'photography-tips'
    | 'videography-tips'
    | 'behind-the-scenes'
    | 'client-stories'
    | 'tutorials'
    | 'equipment-reviews'
    | 'industry-news'
    | 'other';
  tags: string[];
  published: boolean;
  publishedAt: Date;
  slug: string;
  views: number;
  readTime: number;
  metaDescription: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.component.html',
})
export class BlogDetailComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  blog: Blog | null = null;
  isLoading = true;
  notFound = false;

  private readonly API_URL = environment.apiUrl;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const blogId = params['id'];
      if (blogId) {
        this.loadBlog(blogId);
      }
    });
  }

  private loadBlog(id: string) {
    this.isLoading = true;
    this.notFound = false;

    this.http
      .get<{ data: Blog }>(`${this.API_URL}/api/blogs/${id}`)
      .pipe(
        catchError((error) => {
          console.log('Failed to fetch blog:', error);
          this.notFound = true;
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response && response.data) {
          this.blog = response.data;
        } else {
          this.notFound = true;
        }
        this.isLoading = false;
      });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getCategoryDisplayName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'photography-tips': 'Photography Tips',
      'videography-tips': 'Videography Tips',
      'behind-the-scenes': 'Behind the Scenes',
      'client-stories': 'Client Stories',
      tutorials: 'Tutorials',
      'equipment-reviews': 'Equipment Reviews',
      'industry-news': 'Industry News',
      other: 'Other',
    };
    return categoryMap[category] || category;
  }

  goBack() {
    this.router.navigate(['/blogs']);
  }
}
