import { NewsDetails, UrlDetails } from './../models/news.interface';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map, tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private currentKey: string;
  // https://hn.algolia.com/api/v1/search?page=2
  constructor(private http: HttpClient) { }

  getNewsDetails(pageNo = 1): Observable<Array<NewsDetails>> {
    // this.currentKey = 'hacker_news_data_Page_' + pageNo;
    this.currentKey = 'data-table';
    const items = this.getNewsFromStorage();
    if (items){
      return of<any>(items);
    }
    return this.http.get<any>('https://hn.algolia.com/api/v1/search?page=' + pageNo)
    .pipe(
      map(clients => clients.hits.map(r => this.mapDataForUi(r))),
      tap(res => this.setNewsFromStorage(res))
      );
  }
  mapDataForUi(data): NewsDetails {
    const { title, url, author, num_comments, points, created_at, objectID } = data;
    const urldetails = this.createUrl(url);
    const createdAt =  moment(created_at).fromNow();
    return {
       title: title ? title : ' - ',
       urldetails,
       author:  author ? author : ' - ',
       commentsCount: num_comments ? num_comments : 0,
       points: points ? points : 0,
       createdAt,
       id: objectID,
       hide: false
    };
  }
  createUrl(url): UrlDetails {
    const name = /^((http[s]?|ftp):\/)?\/?www.?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/g.test(url) ? RegExp.$3 : ' - ';
    return {url, name};
  }
  updateNewsDetails(item, index) {
    const details = this.getNewsFromStorage();
    details[index] = item;
    this.setNewsFromStorage(details);
  }

  getNewsFromStorage(){
    const items = localStorage.getItem(this.currentKey);
    return items ? JSON.parse(items) : null;
  }

  setNewsFromStorage(item) {
    localStorage.setItem(this.currentKey, JSON.stringify(item));
  }
}


// {
//   "created_at": "2018-10-28T17:57:59.000Z",
//   "title": "IBM acquires Red Hat",
//   "url": "https://www.redhat.com/en/blog/red-hat-ibm-creating-leading-hybrid-cloud-provider",
//   "author": "nopriorarrests",
//   "points": 2611,
//   "story_text": null,
//   "comment_text": null,
//   "num_comments": 491,
//   "story_id": null,
//   "story_title": null,
//   "story_url": null,
//   "parent_id": null,
//   "created_at_i": 1540749479,
//   "relevancy_score": 8441,
//   "_tags": [
//     "story",
//     "author_nopriorarrests",
//     "story_18321884"
//   ],
//   "objectID": "18321884",
//   "_highlightResult": {
//     "title": {
//       "value": "IBM acquires Red Hat",
//       "matchLevel": "none",
//       "matchedWords": []
//     },
//     "url": {
//       "value": "https://www.redhat.com/en/blog/red-hat-ibm-creating-leading-hybrid-cloud-provider",
//       "matchLevel": "none",
//       "matchedWords": []
//     },
//     "author": {
//       "value": "nopriorarrests",
//       "matchLevel": "none",
//       "matchedWords": []
//     }
//   }
// }
