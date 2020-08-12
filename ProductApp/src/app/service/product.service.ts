import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Product } from '../interface/product';
import { DepartmentService } from './department.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly url = `${environment.url}/products`;
  private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >(null);
  private loaded: boolean = false;
  constructor(
    private http: HttpClient,
    private departmentService: DepartmentService
  ) {}

  get(): Observable<Product[]> {
    if (!this.loaded) {
      combineLatest(
        this.http.get<Product[]>(this.url),
        this.departmentService.get()
      )
        .pipe(
          map(([products, departments]) => {
            for (let prod of products) {
              const ids = prod.departments as string[];
              prod.departments = ids.map((id) =>
                departments.find((dep) => dep._id == id)
              );
            }
            return products;
          })
        )
        .subscribe(this.productsSubject$);

      this.loaded = true;
      // this.http.get<Product[]>(this.url).subscribe(this.productsSubject$);
    }
    return this.productsSubject$.asObservable();
  }

  // add(): Observable<Product> {}

  // update(): Observable<Product> {}
}
