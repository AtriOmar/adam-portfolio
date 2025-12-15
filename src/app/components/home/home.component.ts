import { Component } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { ServicesSectionComponent } from './services-section/services-section.component';
import { FeaturedMediaComponent } from './featured-media/featured-media.component';
import { StatsSectionComponent } from './stats-section/stats-section.component';
import { CtaSectionComponent } from './cta-section/cta-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    ServicesSectionComponent,
    FeaturedMediaComponent,
    StatsSectionComponent,
    CtaSectionComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
