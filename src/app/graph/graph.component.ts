import { NewsDetails } from './../models/news.interface';
import { ApiService } from './../services/api.service';
import { Component, OnInit, OnDestroy, Input, ElementRef, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';
import { INIT_DATA, CHART_OPTION } from '../models/CONST';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit, OnDestroy {
  height = '350px';
  data = INIT_DATA;
  chart: any;

  constructor(public el: ElementRef, private api: ApiService) {}

  ngAfterViewInit() {
    this.api.getNewsDetails(1).subscribe(res => {
      this.mapToChartData(res);
      this.initChart();
    });
  }

  mapToChartData(res: NewsDetails[]) {
    res.forEach((ele) => {
      this.data.labels.push(ele.id);
      this.data.datasets[0].data.push(ele.points);
    });
  }

  initChart() {
    const options: any = CHART_OPTION;
    if (options.responsive && (this.height)) {
        options.maintainAspectRatio = false;
    }

    this.chart = new Chart(this.el.nativeElement.children[0].children[0], {
        type: 'line',
        data: this.data,
        options,
        plugins: []
    });
  }

  reinit() {
      if (this.chart) {
          this.chart.destroy();
          this.initChart();
      }
  }

  ngOnDestroy() {
      if (this.chart) {
          this.chart.destroy();
          this.chart = null;
      }
  }
}
