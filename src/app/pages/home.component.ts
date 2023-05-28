import { Component, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RxState } from '@rx-angular/state';
import { Books, BooksService } from '../books.service';
import {
  Observable,
  catchError,
  endWith,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { LetDirective } from '@rx-angular/template/let';
import { BookCardComponent } from '../components/book-card.component';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type HomeState = {
  isLoading?: boolean;
  books?: Books;
  error?: Error;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LetDirective, BookCardComponent, FontAwesomeModule],
  providers: [RxState],
  template: `<div class="flex flex-col flex-1 p-4">
    <ng-container *rxLet="isLoading$; let isLoading">
      <div
        *ngIf="isLoading"
        class="flex flex-col flex-1 justify-center items-center"
      >
        <div class="flex flex-row gap-4 text-2xl font-bold items-center">
          <fa-icon [icon]="spinnerIcon" [spin]="true" size="2x"></fa-icon>
          <span> Loading...</span>
        </div>
      </div>
    </ng-container>
    <ng-container *rxLet="error$; let error">
      <div
        *ngIf="error"
        class="flex flex-col flex-1 justify-center items-center"
      >
        <div class="text-2xl font-bold">Error</div>
        <div class="text-lg text-red-500">{{ error.message }}</div>
        <div *ngIf="error.cause" class="text-red-500">{{ error.cause }}</div>
        <div *ngIf="error.stack" class="text-red-500">{{ error.stack }}</div>
      </div>
    </ng-container>
    <div *rxLet="books$; let books" class="flex flex-col gap-4">
      <ng-container *ngIf="books">
        <div
          class="flex flex-row gap-2 text-lg uppercase shadow-sm bg-gray-100 rounded-md px-4 py-2"
        >
          <div class="font-semibold w-auto">Books Found:</div>
          <div class="w-auto">{{ books?.totalItems }}</div>
        </div>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 flex-1"
        >
          <app-book-card
            *ngFor="let book of books?.items"
            [book]="book"
          ></app-book-card>
        </div>
      </ng-container>
    </div>
  </div>`,
  styles: [
    `
      :host {
        @apply flex flex-col flex-1;
      }
    `,
  ],
})
export class HomeComponent extends RxState<HomeState> {
  bookService = inject(BooksService);
  isLoading$ = this.select('isLoading');
  books$ = this.select('books');
  error$ = this.select('error');
  route = inject(ActivatedRoute);
  fetchAngularBooks: Observable<HomeState> = this.route.queryParams.pipe(
    map((params) => params['q'] || 'angular'),
    switchMap((q) => this.bookService.searchBooks(q)),
    map((books) => ({ books, isLoading: false })),
    catchError((error) => of({ error, isLoading: false })),
    startWith({ isLoading: true }),
    endWith({ isLoading: false })
  );
  spinnerIcon = faSpinner;

  constructor() {
    super();
    this.connect(this.fetchAngularBooks);
  }
}
