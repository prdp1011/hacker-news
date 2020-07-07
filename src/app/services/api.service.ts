import { NewsDetails, UrlDetails, ChartData } from './../models/news.interface';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private currentKey: string;
  private observeData: BehaviorSubject<ChartData> = new BehaviorSubject(null);
  totalRecord = 200;
  constructor(private http: HttpClient) {
   }

  getNewsDetails(pageNo = 1): Observable<NewsDetails[]> {
    this.currentKey = 'hacker_news_data_Page_' + pageNo;
    const items = this.getNewsFromStorage();
    if (items){
      this.createGraphData(items);
      return of<NewsDetails[]>(items);
    }
    return this.http.get<NewsDetails[]>('https://hn.algolia.com/api/v1/search?page=' + pageNo)
    .pipe(map((data: any) => this.mapToChartDataFromApi(data)));
  }

  private mapToChartDataFromApi(data) {
    this.totalRecord = data.nbHits;
    const res: NewsDetails[] =  data.hits;
    const chart = {
      ids: [],
      votes: []
    };
    const result =  res.map(ele => {
      const list = this.mapDataForUi(ele);
      chart.ids.push(list.id);
      chart.votes.push(list.points);
      return list;
    });
    this.observeData.next(chart);
    this.setNewsFromStorage(result);
    return result;
  }

  private createGraphData(list = []) {
    const chart = {
      ids: [],
      votes: []
    };
    list.forEach(element => {
      chart.ids.push(element.id);
      chart.votes.push(element.points);
    });
    this.observeData.next(chart);
  }

  observeChartData(): Observable<ChartData>{
    return this.observeData.asObservable();
  }
  private mapDataForUi(data): NewsDetails {
    const { title, url, author, num_comments, points, created_at, objectID } = data;
    const urldetails = this.createUrl(url);
    const createdAt = this.getDateFrom(created_at);
    return {
       title,
       urldetails,
       author,
       commentsCount: num_comments  || 0,
       points: points || 0,
       createdAt,
       id: objectID,
       hide: false
    };
  }
  private createUrl(url): UrlDetails {
    const name = /^((http[s]?|ftp):\/)?\/?www.?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/g.test(url) ? RegExp.$3 : ' - ';
    return {url, name};
  }

  private getDateFrom(date){
    const d2 = new Date(date).getTime();
    const d1 = Date.now();
    const s  = Math.floor( d1 - d2 / 1000 );
    if (s < 60){
      return  s + ' seconds ago';
    }
    if (s < (60 * 60)){
      return Math.floor( s / 60 ) + ' minutes ago';
    }
    if (s < (60 * 60 * 24)){
      return Math.floor( s / (60 * 60) ) + ' hours ago';
    }
    if (s < (60 * 60 * 24 * 7)){
      return Math.floor( s / (60 * 60 * 24) ) + ' days ago';
    }

    if (s < (30 * 60 * 60 * 24)) {
      return Math.floor( s / (60 * 60 * 24 * 7) ) + ' weeks ago';
    }

    if (s < (12 * 30 * 60 * 60 * 24)) {
      return Math.floor( s / (60 * 60 * 24 * 30) ) + ' months ago';
    }
    return Math.floor( s / (60 * 60 * 24 * 30 * 12) ) + ' year ago';
  }

  updateNewsDetails(details) {
    this.setNewsFromStorage(details);
    this.createGraphData(details);
  }

  private getNewsFromStorage(): Array<any>{
    const items = localStorage.getItem(this.currentKey);
    return items ? JSON.parse(items) : null;
  }

  private setNewsFromStorage(item: NewsDetails[]) {
    localStorage.setItem(this.currentKey, JSON.stringify(item));
  }

}

