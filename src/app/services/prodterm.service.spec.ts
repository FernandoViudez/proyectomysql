import { TestBed } from '@angular/core/testing';

import { ProdtermService } from './prodterm.service';

describe('ProdtermService', () => {
  let service: ProdtermService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdtermService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
