import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { CountUp } from 'countup.js';

@Directive({
  selector: '[countUpOnView]',
})
export class CountUpOnViewDirective implements AfterViewInit {
  @Input() endValue!: number;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const counter = new CountUp(this.el.nativeElement, this.endValue);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          counter.start();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(this.el.nativeElement);
  }
}
