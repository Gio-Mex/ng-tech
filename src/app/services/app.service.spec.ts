import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppService],
    });
    service = TestBed.inject(AppService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data from the API', () => {
    const testData = { test: 'data' };
    const query = 'test.json';

    service.getData(query).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('https://hacker-news.firebaseio.com/v0/test.json');
    expect(req.request.method).toEqual('GET');

    req.flush(testData);
  });
});