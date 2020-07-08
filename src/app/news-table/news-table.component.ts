import { LOAD_STATE } from './../models/CONST';
import { ApiService } from './../services/api.service';
import { NewsDetails } from './../models/news.interface';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-news-table',
  templateUrl: './news-table.component.html',
  styleUrls: ['./news-table.component.scss']
})
export class NewsTableComponent implements OnInit {
  newsDetails: NewsDetails[];
  pageNo: number;
  dataState =  LOAD_STATE.LOADING;
  constructor(
    private api: ApiService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute) {
      ref.detach();
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const i = isNaN(params.pageNo) ? 1 : params.pageNo;
      this.dataState =  LOAD_STATE.LOADING;
      this.pageNo = i;
      this.getNews(i);
    });
  }

  hide(item: NewsDetails){
    this.newsDetails = this.newsDetails.filter(ele => ele.id !== item.id);
    this.api.updateNewsDetails(this.newsDetails);
    this.ref.detectChanges();
  }

  addVote(item: NewsDetails){
    item.points += 1;
    this.api.updateNewsDetails(this.newsDetails);
    this.ref.detectChanges();
  }

  getNews(page){
    this.api.getNewsDetails(page).pipe(take(1)).subscribe(res => {
      this.newsDetails = res;
      this.dataState =  res.length ? LOAD_STATE.LOADED : LOAD_STATE.EMPTY;
      this.ref.detectChanges();
    });
  }

  prev(){
    if (this.pageNo > 1){
      this.router.navigate(['', --this.pageNo]);
      // this.ref.detectChanges();
    }
  }

  next(){
      this.router.navigate(['', ++this.pageNo]);
      // this.ref.detectChanges();
  }

  trackByItemId(i, {id}){
    return id;
  }

}
