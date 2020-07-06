import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NewsTableComponent } from './news-table/news-table.component';
import { GraphComponent } from './graph/graph.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: ':pageNo', component: NewsTableComponent },
  { path: '', component: NewsTableComponent},
  { path: '**', redirectTo: '/' }
];
@NgModule({
  declarations: [
    AppComponent,
    NewsTableComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
