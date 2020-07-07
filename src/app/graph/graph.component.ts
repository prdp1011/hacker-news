import { ChartData } from './../models/news.interface';
import { ApiService } from './../services/api.service';
import { Component, OnDestroy, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import * as Chart from 'chart.js';
import { INIT_DATA, CHART_OPTION } from '../models/CONST';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit, OnDestroy {
  height = '350px';
  private data = INIT_DATA;
  private chart: any;
  private subs: Subscription;
  constructor(public el: ElementRef,
              private ngZone: NgZone,
              private api: ApiService) {}

  ngAfterViewInit() {
    this.subs = this.api.observeChartData().subscribe((res: ChartData) => {
      if (res){
        this.data.labels = res.ids;
        this.data.datasets[0].data = res.votes;
        this.reinit();
      }
    });
  }

  private initChart() {
    const options: any = CHART_OPTION;
    if (options.responsive && (this.height)) {
        options.maintainAspectRatio = false;
    }
    this.ngZone.runOutsideAngular(() => {
      this.chart = new Chart(this.el.nativeElement.children[0].children[0], {
          type: 'line',
          data: this.data,
          options,
          plugins: []
      });
    });
  }

  private reinit() {
      if (this.chart) {
          this.chart.destroy();
      }
      this.initChart();
  }

  ngOnDestroy() {
      if (this.chart) {
          this.chart.destroy();
          this.chart = null;
      }
      if (this.subs){
        this.subs.unsubscribe();
      }
  }
}
