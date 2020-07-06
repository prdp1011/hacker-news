import { LOAD_STATE } from './../models/CONST';
import { ApiService } from './../services/api.service';
import { NewsDetails } from './../models/news.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-news-table',
  templateUrl: './news-table.component.html',
  styleUrls: ['./news-table.component.scss']
})
export class NewsTableComponent implements OnInit, OnDestroy {
  newsDetails: NewsDetails[];
  pageNo: number;
  subs = new Subscription();
  dataState =  LOAD_STATE.LOADING;
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subs.add(this.route.params.subscribe(params => {
      const i = isNaN(params.pageNo) ? 1 : params.pageNo;
      this.dataState =  LOAD_STATE.LOADING;
      this.pageNo = i;
      this.getNews(i);
    }));
  }

  hide(item: NewsDetails, i: number){
    this.newsDetails.slice(i, 1);
    this.api.updateNewsDetails(this.newsDetails);
  }

  addVote(item: NewsDetails, i: number){
    item.points += 1;
    this.api.updateNewsDetails(this.newsDetails);
  }

  getNews(page){
    this.api.getNewsDetails(page).pipe(take(1)).subscribe(res => {
      this.newsDetails = res;
      this.dataState =  res.length ? LOAD_STATE.LOADED : LOAD_STATE.EMPTY;
    });
  }

  prev(){
    if (this.pageNo > 1){
      this.router.navigate(['', --this.pageNo]);
    }
  }

  next(){
      this.router.navigate(['', ++this.pageNo]);
  }

  trackByItemId(i, {id}){
    return id;
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
