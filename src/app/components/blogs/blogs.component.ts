import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

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

  private readonly BACKEND_URL = 'http://localhost:3000'; // Change this to your backend URL

  private readonly fakeData: Blog[] = [
    {
      _id: '1',
      title: 'Essential Portrait Photography Tips for Beginners',
      content: '<p>Portrait photography is one of the most rewarding genres of photography...</p>',
      excerpt:
        'Learn the fundamental techniques that will transform your portrait photography from amateur to professional level.',
      author: 'Khlif Adam',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1554048612-b6ebae92138d?auto=format&fit=crop&w=800&q=80',
        alt: 'Portrait photography setup',
      },
      category: 'photography-tips',
      tags: ['portraits', 'lighting', 'beginner'],
      published: true,
      publishedAt: new Date('2024-12-01'),
      slug: 'essential-portrait-photography-tips',
      views: 245,
      readTime: 8,
      metaDescription: 'Master portrait photography with these essential tips for beginners',
      featured: true,
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      _id: '2',
      title: 'Behind the Scenes: Urban Fashion Shoot',
      content:
        '<p>Take a look behind the scenes of our latest urban fashion photography session...</p>',
      excerpt:
        'Go behind the scenes of an urban fashion shoot and discover the creative process from concept to final image.',
      author: 'Khlif Adam',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
        alt: 'Behind the scenes fashion shoot',
      },
      category: 'behind-the-scenes',
      tags: ['fashion', 'urban', 'bts'],
      published: true,
      publishedAt: new Date('2024-11-28'),
      slug: 'behind-scenes-urban-fashion-shoot',
      views: 189,
      readTime: 6,
      metaDescription: 'Behind the scenes look at an urban fashion photography shoot',
      featured: false,
      createdAt: new Date('2024-11-28'),
      updatedAt: new Date('2024-11-28'),
    },
    {
      _id: '3',
      title: 'Camera Equipment Review: Best Lenses for 2024',
      content: '<p>In this comprehensive review, we test the latest camera lenses...</p>',
      excerpt:
        'Our comprehensive review of the best camera lenses for portrait and fashion photography in 2024.',
      author: 'Khlif Adam',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=800&q=80',
        alt: 'Camera lenses review',
      },
      category: 'equipment-reviews',
      tags: ['equipment', 'lenses', 'review'],
      published: true,
      publishedAt: new Date('2024-11-25'),
      slug: 'best-camera-lenses-2024-review',
      views: 156,
      readTime: 12,
      metaDescription: 'Complete review of the best camera lenses for photography in 2024',
      featured: false,
      createdAt: new Date('2024-11-25'),
      updatedAt: new Date('2024-11-25'),
    },
    {
      _id: '4',
      title: 'Creative Lighting Techniques for Indoor Photography',
      content:
        '<p>Master these creative lighting techniques to elevate your indoor photography...</p>',
      excerpt:
        'Discover professional lighting techniques that will transform your indoor photography and create stunning results.',
      author: 'Khlif Adam',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80',
        alt: 'Studio lighting setup',
      },
      category: 'tutorials',
      tags: ['lighting', 'indoor', 'tutorial'],
      published: true,
      publishedAt: new Date('2024-11-20'),
      slug: 'creative-lighting-techniques-indoor-photography',
      views: 298,
      readTime: 10,
      metaDescription: 'Learn creative lighting techniques for professional indoor photography',
      featured: true,
      createdAt: new Date('2024-11-20'),
      updatedAt: new Date('2024-11-20'),
    },
    {
      _id: '5',
      title: "Client Story: Sarah's Branding Session",
      content:
        '<p>Working with Sarah on her personal branding photography was an incredible experience...</p>',
      excerpt:
        "Follow the journey of Sarah's personal branding session from initial consultation to final delivery.",
      author: 'Khlif Adam',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        alt: 'Personal branding session',
      },
      category: 'client-stories',
      tags: ['branding', 'business', 'client'],
      published: true,
      publishedAt: new Date('2024-11-15'),
      slug: 'client-story-sarah-branding-session',
      views: 134,
      readTime: 7,
      metaDescription: 'Personal branding photography session case study with client Sarah',
      featured: false,
      createdAt: new Date('2024-11-15'),
      updatedAt: new Date('2024-11-15'),
    },
    {
      _id: '6',
      title: 'The Future of Photography: Industry Trends 2025',
      content: '<p>As we look ahead to 2025, the photography industry continues to evolve...</p>',
      excerpt:
        'Explore the emerging trends and technologies that will shape the photography industry in 2025 and beyond.',
      author: 'Khlif Adam',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
        alt: 'Future of photography',
      },
      category: 'industry-news',
      tags: ['trends', 'future', 'industry'],
      published: true,
      publishedAt: new Date('2024-11-10'),
      slug: 'future-photography-industry-trends-2025',
      views: 87,
      readTime: 9,
      metaDescription: 'Discover the latest photography industry trends and predictions for 2025',
      featured: false,
      createdAt: new Date('2024-11-10'),
      updatedAt: new Date('2024-11-10'),
    },
  ];

  ngOnInit() {
    this.loadBlogs();
  }

  private loadBlogs() {
    this.http
      .get<Blog[]>(`${this.BACKEND_URL}/api/blogs`)
      .pipe(
        catchError((error) => {
          console.log('Failed to fetch blogs from backend, using fake data:', error);
          return of(this.fakeData);
        })
      )
      .subscribe((data) => {
        this.blogs =
          data && data.length > 0 ? data.filter((blog) => blog.published) : this.fakeData;
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
