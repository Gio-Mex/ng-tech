import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  baseUrl = 'https://hacker-news.firebaseio.com/v0/';

  constructor(private http: HttpClient) {}

  getData(query: string) {
    return this.http.get(this.baseUrl + query);
  }
}
