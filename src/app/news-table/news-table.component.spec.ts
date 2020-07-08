import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsTableComponent } from './news-table.component';

describe('NewsTableComponent', () => {
  let component: NewsTableComponent;
  let fixture: ComponentFixture<NewsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create add vote', () => {
    const item = component.newsDetails[0];
    component.addVote(item);
    expect(component.newsDetails[0].points).toEqual(component.newsDetails[0].points + 1);

  });

  it('should create hide news', () => {
    const item = component.newsDetails[0];
    component.hide(item);
    const lists = component.newsDetails.filter(list => list.objectID !== item.objectID);
    expect(component.newsDetails).toEqual(lists);
  });


});
