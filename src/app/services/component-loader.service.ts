import { Injectable, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import {  map, mergeMap } from 'rxjs/Operators';

@Injectable({
  providedIn: 'root'
})
export class ComponentLoaderService {

  elementInSight(element: ElementRef): Observable<boolean> {
    return new Observable(observer => {
      const intersectionObserver = new IntersectionObserver(entries => {
        observer.next(entries);
      });
      intersectionObserver.observe(element.nativeElement);
      return () => { intersectionObserver.disconnect(); };
      })
      .pipe (
        mergeMap((entries: IntersectionObserverEntry[]) => entries),
        map((entry: IntersectionObserverEntry) => entry.isIntersecting)
      );
  }


}
