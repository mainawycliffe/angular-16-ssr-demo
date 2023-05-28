import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { z } from 'zod';

export const booksSchema = z.object({
  kind: z.literal('books#volumes'),
  totalItems: z.number(),
  items: z.array(
    z.object({
      id: z.string(),
      kind: z.literal('books#volume'),
      etag: z.string(),
      selfLink: z.string(),
      volumeInfo: z.object({
        title: z.string(),
        authors: z.array(z.string()).optional().nullable(),
        publisher: z.string().optional().nullable(),
        publishedDate: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        industryIdentifiers: z
          .array(
            z.object({
              type: z.string(),
              identifier: z.string(),
            })
          )
          .optional(),
        pageCount: z.number().optional().nullable(),
        dimensions: z
          .object({
            height: z.string(),
            width: z.string(),
            thickness: z.string(),
          })
          .optional()
          .nullable(),
        printType: z.string().optional().nullable(),
        mainCategory: z.string().optional().nullable(),
        categories: z.array(z.string()).optional().nullable(),
        averageRating: z.number().optional().nullable(),
        ratingsCount: z.number().optional().nullable(),
        contentVersion: z.string().optional().nullable(),
        imageLinks: z
          .object({
            smallThumbnail: z.string().optional().nullable(),
            thumbnail: z.string().optional().nullable(),
            small: z.string().optional().nullable(),
            medium: z.string().optional().nullable(),
            large: z.string().optional().nullable(),
            extraLarge: z.string().optional().nullable(),
          })
          .optional()
          .nullable(),
        language: z.string(),
        infoLink: z.string(),
        canonicalVolumeLink: z.string(),
      }),
    })
  ),
});

export type Books = z.infer<typeof booksSchema>;

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  http = inject(HttpClient);

  searchBooks(q: string) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=40`;
    return this.http.get(url).pipe(map((res) => booksSchema.parse(res)));
  }
}
