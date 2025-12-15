import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="mt-1 text-sm text-gray-600">Manage your portfolio and application settings</p>
      </div>

      <div class="space-y-6">
        <!-- Site Settings -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Site Settings</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Site Title</label>
                <input
                  type="text"
                  value="K.A Photography"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Site Description</label>
                <textarea
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Professional photography services..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="contact@photography.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Social Media</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Instagram</label>
                <input
                  type="url"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Facebook</label>
                <input
                  type="url"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="https://facebook.com/username"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end">
          <button
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AdminSettingsComponent {}
