import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Books } from '../books.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="bookInner() as book">
      <div class="flex flex-col gap-2 h-full rounded-md bg-gray-100 shadow-lg">
        <img
          class="rounded-t-md aspect-[3/4]"
          [src]="book.volumeInfo.imageLinks?.thumbnail"
          [alt]="book.volumeInfo.title"
        />
        <div class="flex flex-col p-2">
          <h3
            class="block text-lg font-semibold truncate"
            [title]="book.volumeInfo.title"
          >
            {{ book.volumeInfo.title }}
          </h3>
          <div class="block">{{ book.volumeInfo.publishedDate }}</div>
          <div class="block">{{ book.volumeInfo.authors }}</div>
          <div class="block">{{ book.volumeInfo.publisher }}</div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [],
})
export class BookCardComponent {
  bookInner = signal<Books['items'][number] | undefined>(undefined);

  @Input({
    required: true,
  })
  set book(book: Books['items'][number]) {
    this.bookInner.set(book);
  }
}
