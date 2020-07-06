import { ApiService } from './../services/api.service';
import { NewsDetails } from './../models/news.interface';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-news-table',
  templateUrl: './news-table.component.html',
  styleUrls: ['./news-table.component.scss']
})
export class NewsTableComponent implements OnInit {
  newsDetails: NewsDetails[];
  pageNo: number;
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      const i = isNaN(params.pageNo) ? 1 : params.pageNo;
      this.pageNo = i;
      this.getNews(1);
    });
  }

  hide(item: NewsDetails, i: number){
    item.hide = true;
    this.api.updateNewsDetails(item, i);
  }

  addVote(item: NewsDetails, i: number){
    item.points += 1;
    this.api.updateNewsDetails(item, i);
  }

  getNews(page){
    this.api.getNewsDetails(page).subscribe(res => this.newsDetails = res);
  }

  prev(){
    this.router.navigate(['', ++this.pageNo]);
  }

  next(){
    this.router.navigate(['', ++this.pageNo]);
  }

  trackByItemId(i, {id}){
    return id;
  }

}
