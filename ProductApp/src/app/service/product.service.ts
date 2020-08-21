import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ProductData } from '../interface/product';
import { DepartmentService } from './department.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly url = `${environment.url}/product`;
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
      this.http.get<ProductData>(this.url).subscribe((resp) => {
        this.productsSubject$.next(resp?.Product);
      });
      this.loaded = true;
    }

    return this.productsSubject$.asObservable();
  }

  add(prod: Product): Observable<Product> {
    prod.departments = prod.departments.map((item) => {
      delete item._id;
      delete item.__v;
      return item;
    });

    return this.http
      .post<Product>(this.url, prod)
      .pipe(tap((prod) => this.productsSubject$.getValue().push(prod)));
  }

  update(prod: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${prod._id}`, prod).pipe(
      tap(() => {
        let products = this.productsSubject$.getValue();
        let index = products.findIndex((p) => p._id === prod._id);
        if (index >= 0) products[index] = prod;
      })
    );
  }

  delete(prod: Product): Observable<any> {
    return this.http.delete(`${this.url}/${prod._id}`).pipe(
      tap((resp) => {
        let products = this.productsSubject$.getValue();
        const index = products.findIndex((p) => p._id === prod._id);
        if (index >= 0) products.splice(index, 1);
      })
    );
  }
}
