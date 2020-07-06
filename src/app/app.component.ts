import { Component, AfterViewInit, ViewChild, ElementRef, ComponentFactoryResolver, Injector, ApplicationRef, EmbeddedViewRef, ViewContainerRef } from '@angular/core';
import { ComponentLoaderService } from './services/component-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('graphLoader') graphLoader: ElementRef;
  isloaded: boolean;
  constructor(
    private listServ: ComponentLoaderService,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver){}

  ngAfterViewInit(): void {
    this.listServ.loadComponent(this.graphLoader, 'graphLoader')
    .subscribe(() => this.startAddingComponent(this.graphLoader));
  }

  async startAddingComponent(ref: ElementRef){
    this.viewContainerRef.clear();
    const { GraphComponent } = await import('./graph/graph.component');
    this.isloaded = true;

    this.viewContainerRef.createComponent(
      this.cfr.resolveComponentFactory(GraphComponent)
    );
  }
}
