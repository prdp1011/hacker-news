import { Component, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('graphLoader') graphLoader: ElementRef;
  isloaded: boolean;
  subs: Subscription;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private inject: Injector,
    ){}

  ngAfterViewInit(): void {
    const platform = isPlatformBrowser(this.platformId);
    if (platform){
      this.addComponent();
    }
  }

  async addComponent() {
    const { ComponentLoaderService } = await import('./services/component-loader.service');
    const serv = this.inject.get(ComponentLoaderService);
    this.subs = serv.elementInSight(this.graphLoader)
    .subscribe((res) => {
      if (res){
        if (this.subs){
          this.subs.unsubscribe();
        }
        this.addLineChartComp();
      }
      });
  }

  async addLineChartComp(){
    const { ViewContainerRef } = await import('@angular/core');
    const { ComponentFactoryResolver } = await import('@angular/core');
    const viewContainerRef = this.inject.get(ViewContainerRef);
    const cfr = this.inject.get(ComponentFactoryResolver);
    viewContainerRef.clear();
    const { GraphComponent } = await import('./graph/graph.component');
    this.isloaded = true;
    viewContainerRef.createComponent(
      cfr.resolveComponentFactory(GraphComponent)
    );
  }
}
