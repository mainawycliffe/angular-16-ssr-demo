import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { RxState } from '@rx-angular/state';
import { RxActionFactory } from '@rx-angular/state/actions';
import { concatMap, map, catchError, EMPTY } from 'rxjs';

type SearchAction = {
  search: string;
};

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  providers: [RxState, RxActionFactory],
  template: `
    <form #form="ngForm" (submit)="this.commands.search(form.value.search)">
      <div class="flex flex-row ">
        <input
          type="text"
          class="flex-1 rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-400 bg-white text-lg font-semibold"
          placeholder="Search"
          name="search"
          #search="ngModel"
          [ngModel]="route.snapshot.queryParams['q']"
        />
        <button
          type="submit"
          class="px-8 rounded-r-lg bg-white  text-blue-500 font-bold p-4 border-gray-400 border-t border-b border-r hover:bg-gray-100 hover:text-black"
        >
          <fa-icon [icon]="searchIcon"></fa-icon>
        </button>
      </div>
    </form>
  `,
  styles: [],
})
export class SearchComponent extends RxState<{}> {
  searchIcon = faSearch;
  factory = inject(RxActionFactory<SearchAction>);
  commands = this.factory.create();
  router = inject(Router);
  route = inject(ActivatedRoute);
  search$ = this.commands.search$.pipe(
    concatMap((s) =>
      this.router.navigate([], {
        queryParams: { q: s },
        relativeTo: this.route,
      })
    ),
    map(() => {
      return {};
    }),
    catchError((_) => EMPTY)
  );

  constructor() {
    super();
    this.hold(this.search$);
  }
}
