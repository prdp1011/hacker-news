import { ChartData } from './../models/news.interface';
import { ApiService } from './../services/api.service';
import { Component, OnDestroy, ElementRef, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { INIT_DATA, CHART_OPTION } from '../models/CONST';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit, OnDestroy {
  private data = INIT_DATA;
  private chart: any;
  private subs: Subscription;
  constructor(public el: ElementRef,
              private  cdRef: ChangeDetectorRef,
              private zone: NgZone,
              private api: ApiService) {
                cdRef.detach();
              }

  async ngAfterViewInit() {
    const chart  = await import('chart.js');
    this.subs = this.api.observeChartData().subscribe((res: ChartData) => {
      if (res){
        this.data.labels = res.ids;
        this.data.datasets[0].data = res.votes;
        this.initChart(chart);
      }
    });
  }

  private initChart(Chart) {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = Chart.Line(this.el.nativeElement.children[0].children[0], {
          type: 'line',
          data: this.data,
          options: CHART_OPTION,
          plugins: []
      });
    });
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
