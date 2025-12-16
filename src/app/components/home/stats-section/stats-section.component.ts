import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUp } from 'countup.js';
import { CountUpOnViewDirective } from '../../../directives/count-up-on-view-directive';

@Component({
  selector: 'app-stats-section',
  standalone: true,
  imports: [CommonModule, CountUpOnViewDirective],
  templateUrl: './stats-section.component.html',
})
export class StatsSectionComponent {
  @ViewChildren('countElement') countElements!: QueryList<ElementRef>;
  stats = [
    {
      number: 250,
      suffix: '+',
      label: 'Happy Clients',
      description: 'Satisfied customers who trust my vision',
    },
    {
      number: 500,
      suffix: '+',
      label: 'Photo Sessions',
      description: 'Professional shoots completed',
    },
    {
      number: 150,
      suffix: '+',
      label: 'Events Covered',
      description: 'Memorable moments captured',
    },
    {
      number: 8,
      suffix: '',
      label: 'Years Experience',
      description: 'Dedicated to the craft of photography',
    },
  ];

  countUpOptions = {
    duration: 2.5,
    useEasing: true,
    useGrouping: true,
    separator: ',',
  };

  // ngOnInit() {}

  // ngAfterViewInit() {
  //   // Initialize count up animations after view is ready
  //   setTimeout(() => {
  //     this.initializeCounters();
  //   }, 100);
  // }

  // private initializeCounters() {
  //   this.countElements.forEach((element, index) => {
  //     if (element?.nativeElement) {
  //       const countUp = new CountUp(
  //         element.nativeElement,
  //         this.stats[index].number,
  //         this.countUpOptions
  //       );

  //       if (!countUp.error) {
  //         countUp.start();
  //       } else {
  //         console.error(countUp.error);
  //         // Fallback: just show the number
  //         element.nativeElement.textContent = this.stats[index].number.toString();
  //       }
  //     }
  //   });
  // }
}
