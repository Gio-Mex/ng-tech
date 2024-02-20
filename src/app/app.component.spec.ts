import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { AppComponent } from './app.component';

import { AppService } from './services/app.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let appService: jasmine.SpyObj<AppService>;
  const mockNewsId = [1, 2, 3];
  const mockNewStories = [
    { title: 'Test news item1' },
    { title: 'Test news item2' },
    { title: 'HN: Test news item3' },
  ];

  beforeEach(async () => {
    const appServiceSpy = jasmine.createSpyObj('AppService', ['getData']);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [{ provide: AppService, useValue: appServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        appService = TestBed.inject(AppService) as jasmine.SpyObj<AppService>;
      });
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call getNewsId and getNewStories on ngOnInit', () => {
    appService.getData.and.returnValues(of(mockNewsId), of(mockNewStories));

    spyOn(component, 'getNewsId').and.callThrough();
    const getNewStoriesSpy = spyOn(component, 'getNewStories');

    component.ngOnInit();

    expect(component.getNewStories).toHaveBeenCalled();
    expect(getNewStoriesSpy).toHaveBeenCalled();
  });

  it('should fetch newsId', () => {
    appService.getData.and.returnValue(of(mockNewsId));

    component.getNewsId().subscribe(() => {
      expect(appService.getData).toHaveBeenCalledWith('newstories.json');
      expect(component.newsId).toEqual(mockNewsId);
    });
  });

  it('should fetch and filter new stories', fakeAsync(() => {
    component.arrayStart = 0;
    component.arrayEnd = 3;
    component.newsId = mockNewsId;

    appService.getData.and.returnValues(
      of(mockNewStories[0]),
      of(mockNewStories[1]),
      of(mockNewStories[2])
    );

    component.getNewStories();
    tick();

    expect(component.newStories).toEqual([
      mockNewStories[0],
      mockNewStories[1],
    ]);
  }));

  it('should format date correctly', () => {
    const timestamp = 1708361100;
    const formattedDate = component.formatDate(timestamp);

    expect(formattedDate).toEqual('19 feb 2024');
  });

  it('should update arrayStart and arrayEnd, then call getNewStories', () => {
    const getNewStoriesSpy = spyOn(component, 'getNewStories');

    component.arrayStart = 0;
    component.arrayEnd = 10;

    component.loadMore();

    expect(component.arrayStart).toEqual(10);
    expect(component.arrayEnd).toEqual(20);
    expect(getNewStoriesSpy).toHaveBeenCalled();
  });
});
