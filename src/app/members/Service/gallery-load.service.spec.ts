import { TestBed } from '@angular/core/testing';

import { GalleryLoadService } from './gallery-load.service';

describe('GalleryLoadService', () => {
  let service: GalleryLoadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalleryLoadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
