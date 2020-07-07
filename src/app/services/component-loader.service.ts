import { Injectable, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/Operators';

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
        flatMap((entries: IntersectionObserverEntry[]) => entries),
        map((entry: IntersectionObserverEntry) => entry.isIntersecting)
      );
  }


}
