import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-section.component.html',
})
export class ServicesSectionComponent {
  services = [
    {
      title: 'Portrait Photography',
      description:
        'Capture your unique essence with professional portrait sessions that reveal your authentic self.',
      icon: 'portrait',
    },
    {
      title: 'Fashion Photography',
      description:
        'Dynamic fashion shoots that bring style and creativity together for stunning visual narratives.',
      icon: 'fashion',
    },
    {
      title: 'Event Photography',
      description:
        'Document your special moments with candid and artistic event photography that tells your story.',
      icon: 'event',
    },
    {
      title: 'Commercial Projects',
      description:
        'Professional commercial photography for brands looking to make a lasting visual impact.',
      icon: 'commercial',
    },
  ];
}
