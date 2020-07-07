import { NewsDetails, UrlDetails, ChartData } from './../models/news.interface';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private currentKey: string;
  private storage: Map<string, string> = new Map();
  private observeData: BehaviorSubject<ChartData> = new BehaviorSubject(null);
  totalRecord = 200;
  constructor(private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: any,
              ) {}

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
    const createdAt = ' ' + this.getDateFrom(created_at) + ' ago';
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
    const s  = Math.floor( (d1 - d2) / 1000 );
    if (s < 60) {
      return  s + ' seconds';
    }
    if (s < (60 * 60)){
      return Math.floor( s / 60 ) + ' minutes';
    }
    if (s < (60 * 60 * 24)){
      return Math.floor( s / (60 * 60) ) + ' hours';
    }
    if (s < (60 * 60 * 24 * 7)){
      return Math.floor( s / (60 * 60 * 24) ) + ' days';
    }

    if (s < (30 * 60 * 60 * 24)) {
      return Math.floor( s / (60 * 60 * 24 * 7) ) + ' weeks';
    }

    if (s < (12 * 30 * 60 * 60 * 24)) {
      return Math.floor( s / (60 * 60 * 24 * 30) ) + ' months';
    }
    return Math.floor( s / (60 * 60 * 24 * 30 * 12) ) + ' year';
  }

  updateNewsDetails(details) {
    this.setNewsFromStorage(details);
    this.createGraphData(details);
  }

  private getNewsFromStorage(): Array<any>{
    const platform = isPlatformBrowser(this.platformId);
    const items = platform ? localStorage.getItem(this.currentKey) : this.storage.get(this.currentKey);
    return items ? JSON.parse(items) : null;
  }

  private setNewsFromStorage(item: NewsDetails[]) {
    const platform = isPlatformBrowser(this.platformId);
    if (platform) {
      localStorage.setItem(this.currentKey, JSON.stringify(item));
    } else {
      this.storage.set(this.currentKey, JSON.stringify(item));
    }
  }

}

