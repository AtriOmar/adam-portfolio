import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blogs.component.html',
})
export class BlogsComponent implements OnInit {
  private http = inject(HttpClient);

  blogs: Blog[] = [];
  isLoading = true;

  private readonly API_URL = environment.apiUrl;

  ngOnInit() {
    this.loadBlogs();
  }

  private loadBlogs() {
    this.http
      .get<{ data: Blog[] }>(`${this.API_URL}/api/blogs`)
      .pipe(
        catchError((error) => {
          console.log('Failed to fetch blogs from backend, using fake data:', error);
          return of(null);
        })
      )
      .subscribe((data) => {
        console.log('-------------------- data?.data --------------------');
        console.log(data?.data);
        this.blogs = data && data.data?.length > 0 ? data?.data : [];
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

  get hasFeaturedBlogs(): boolean {
    return this.blogs.some((blog) => blog.featured);
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
}
