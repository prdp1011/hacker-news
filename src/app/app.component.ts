import { Component, AfterViewInit, ViewChild, ElementRef,
   ComponentFactoryResolver, ViewContainerRef, Inject, PLATFORM_ID, Injector } from '@angular/core';
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
    private viewContainerRef: ViewContainerRef,
    private inject: Injector,
    private cfr: ComponentFactoryResolver){}

  ngAfterViewInit(): void {
    const platform = isPlatformBrowser(this.platformId);
    if (platform){
      this.addComponent();
    } else {
      // this.startAddingComponent();
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
        this.startAddingComponent();
      }
      });
  }

  async startAddingComponent(){
    this.viewContainerRef.clear();
    const { GraphComponent } = await import('./graph/graph.component');
    this.isloaded = true;
    this.viewContainerRef.createComponent(
      this.cfr.resolveComponentFactory(GraphComponent)
    );
  }
}
