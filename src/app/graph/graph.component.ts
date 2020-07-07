import { ChartData } from './../models/news.interface';
import { ApiService } from './../services/api.service';
import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { INIT_DATA, CHART_OPTION } from '../models/CONST';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit {
  private data = INIT_DATA;
  private chart: any;
  constructor(public el: ElementRef,
              private api: ApiService) {}

  async ngAfterViewInit() {
    const chart  = await import('chart.js');
    this.api.observeChartData().subscribe((res: ChartData) => {
      if (res){
        this.data.labels = res.ids;
        this.data.datasets[0].data = res.votes;
        this.initChart(chart);
      }
    });
  }

  private initChart(Chart) {
    const options = CHART_OPTION;
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = Chart.Line(this.el.nativeElement.children[0].children[0], {
        type: 'line',
        data: this.data,
        options,
        plugins: []
    });
  }
}
