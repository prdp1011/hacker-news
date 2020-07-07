import { Component, AfterViewInit, ViewChild, ElementRef,
   ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ComponentLoaderService } from './services/component-loader.service';
import { Subscription } from 'rxjs';

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
    private listServ: ComponentLoaderService,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver){}

  ngAfterViewInit(): void {
    this.subs = this.listServ.elementInSight(this.graphLoader)
    .subscribe((res) => {
      if (res){
        this.subs.unsubscribe();
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
