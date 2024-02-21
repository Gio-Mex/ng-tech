import { Component } from '@angular/core';

import { AppService } from './services/app.service';

import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Ng-Tech';
  newsId: any;
  newStory!: Observable<any>;
  newStories: any[] = [];
  arrayStart = 0;
  arrayEnd = 10;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.getNewsId().subscribe(() => this.getNewStories());
  }

  getNewsId(): Observable<any> {
    return this.appService
      .getData('newstories.json')
      .pipe(tap((_newsId) => (this.newsId = _newsId)));
  }

  getNewStories() {
    for (let i = this.arrayStart; i < this.arrayEnd; i++) {
      this.appService
        .getData('item/' + this.newsId[i] + '.json')
        .subscribe((_newStory: any) => {
          if (!_newStory.title.includes('HN:')) {
            this.newStory = _newStory;
            this.newStories = this.newStories.concat(this.newStory);
          }
        });
    }
  }

  formatDate(date: number): string {
    return new Date(date * 1000).toLocaleString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  loadMore() {
    this.arrayStart += 10;
    this.arrayEnd += 10;
    this.getNewStories();
  }
}
