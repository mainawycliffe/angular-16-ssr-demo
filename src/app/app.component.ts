import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './components/search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, SearchComponent],
  template: `
    <div class="h-screen w-screen flex flex-col overflow-auto">
      <div class="flex flex-col w-full bg-blue-600 shadow-sm">
        <nav
          class="container mx-auto flex gap-4 flex-col text-center sm:flex-row sm:text-left sm:justify-between py-8 px-6 sm:items-baseline"
        >
          <div class="mb-2 sm:mb-0">
            <a
              [routerLink]="['/']"
              class="text-2xl no-underline text-grey-darkest hover:text-blue-dark"
              >Google Books API</a
            >
          </div>
          <div class="justify-end">
            <app-search></app-search>
          </div>
        </nav>
      </div>
      <div class="container mx-auto flex flex-col flex-1">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppComponent {}
