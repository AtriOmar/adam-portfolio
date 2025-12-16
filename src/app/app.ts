import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('adam-portfolio');

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      once: true, // animate only once
    });
  }
}
