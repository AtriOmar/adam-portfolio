import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Blog, BlogResponse, BlogStats } from '../../../models/blog.model';
import { RelativeDatePipe } from '../../../pipes/relative-date-pipe';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-blogs.component.html',
})
export class AdminBlogsComponent implements OnInit {
  blogs: Blog[] = [];
  stats: BlogStats = { published: 0, drafts: 0, totalViews: 0 };
  loading = false;
  error: string | null = null;
  Math = Math;
  date = new Date(new Date().getTime() - 100 * 1000);

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;

  // Filters
  selectedStatus = 'all';
  searchQuery = '';

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit() {
    this.loadBlogs();
    this.loadStats();
  }

  loadBlogs() {
    this.loading = true;
    this.error = null;

    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };

    if (this.selectedStatus === 'published') {
      params.published = true;
    } else if (this.selectedStatus === 'draft') {
      params.published = false;
    }

    this.blogService.getBlogs(params).subscribe({
      next: (response: BlogResponse) => {
        this.blogs = response.data;
        this.currentPage = response.meta.currentPage;
        this.totalPages = response.meta.totalPages;
        this.totalItems = response.meta.totalItems;
        this.itemsPerPage = response.meta.itemsPerPage;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load blogs';
        this.loading = false;
        console.error('Error loading blogs:', error);
      },
    });
  }

  loadStats() {
    // Calculate stats from all blogs
    this.blogService.getBlogs({ limit: 1000 }).subscribe({
      next: (response: BlogResponse) => {
        const allBlogs = response.data;
        this.stats.published = allBlogs.filter((blog) => blog.published).length;
        this.stats.drafts = allBlogs.filter((blog) => !blog.published).length;
        this.stats.totalViews = allBlogs.reduce((total, blog) => total + blog.views, 0);
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      },
    });
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadBlogs();
  }

  onSearchChange() {
    // Implement search functionality
    this.currentPage = 1;
    this.loadBlogs();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadBlogs();
  }

  deleteBlog(blogId: string) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deleteBlog(blogId).subscribe({
        next: () => {
          this.loadBlogs();
          this.loadStats();
        },
        error: (error) => {
          console.error('Error deleting blog:', error);
          alert('Failed to delete blog post');
        },
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusBadgeClass(published: boolean): string {
    return published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  }

  getStatusText(published: boolean): string {
    return published ? 'Published' : 'Draft';
  }

  getCategoryBadgeClass(category: string): string {
    const colors: { [key: string]: string } = {
      'photography-tips': 'bg-blue-100 text-blue-800',
      'videography-tips': 'bg-purple-100 text-purple-800',
      'behind-the-scenes': 'bg-green-100 text-green-800',
      'client-stories': 'bg-gray-100 text-pink-800',
      tutorials: 'bg-orange-100 text-orange-800',
      'equipment-reviews': 'bg-red-100 text-red-800',
      'industry-news': 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  }

  createNewBlog() {
    this.router.navigate(['/admin/blogs/new']);
  }

  editBlog(blogId: string) {
    this.router.navigate(['/admin/blogs/edit', blogId]);
  }
}
