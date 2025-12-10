import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-media',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Media Management</h1>
          <p class="mt-1 text-sm text-gray-600">
            Manage your photography portfolio images and videos
          </p>
        </div>
        <button
          class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Upload Media
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-6 bg-white shadow rounded-lg p-4">
        <div class="flex flex-wrap gap-4 items-center">
          <select class="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>All Types</option>
            <option>Images</option>
            <option>Videos</option>
          </select>
          <select class="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>All Categories</option>
            <option>Portrait</option>
            <option>Wedding</option>
            <option>Event</option>
            <option>Commercial</option>
          </select>
          <div class="flex-1"></div>
          <div class="relative">
            <input
              type="text"
              placeholder="Search media..."
              class="border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm w-64"
            />
            <svg
              class="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Media Grid -->
      <div class="bg-white shadow rounded-lg">
        <div class="p-6">
          <div class="text-center py-12">
            <svg
              class="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No media files found</h3>
            <p class="text-gray-500 mb-4">Get started by uploading your first image or video.</p>
            <button
              class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Upload Media
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminMediaComponent {}
