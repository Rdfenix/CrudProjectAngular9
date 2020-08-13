import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Product } from '../interface/product';
import { Department } from '../interface/department';
import { DepartmentService } from './department.service';
import { filter, map, tap } from 'rxjs/operators';

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
        this.departmentService.get(),
        this.http.get<Product[]>(this.url)
      )
        .pipe(
          filter(
            ([departments, products]) =>
              departments != null && products !== null
          ),
          map(([departments, products]) => {
            for (let prod of products) {
              let ids = prod.departments as string[];
              prod.departments = ids.map((id) =>
                departments.find((dep) => dep._id == id)
              );
            }
            return products;
          }),
          tap((products) => console.log(products))
        )
        .subscribe(this.productsSubject$);
      this.loaded = true;
    }
    return this.productsSubject$.asObservable();
  }

  add(prod: Product): Observable<Product> {
    let departments = (prod.departments as Department[]).map((dep) => dep._id);
    return this.http
      .post<Product>(this.url, { ...prod, departments })
      .pipe(
        tap((prod) => {
          this.productsSubject$.getValue().push({ ...prod, _id: prod._id });
        })
      );
  }

  delete(prod: Product): Observable<any> {
    return this.http.delete(`${this.url}/${prod._id}`).pipe(
      tap(() => {
        let products = this.productsSubject$.getValue();
        let index = products.findIndex((p) => p._id === prod._id);
        if (index >= 0) products.splice(index, 1);
      })
    );
  }

  update(prod: Product): Observable<Product> {
    let departments = (prod.departments as Department[]).map((dep) => dep._id);
    return this.http
      .patch<Product>(`${this.url}/${prod._id}`, {
        ...prod,
        departments,
      })
      .pipe(
        tap(() => {
          let products = this.productsSubject$.getValue();
          let index = products.findIndex((p) => p._id === prod._id);
          if (index >= 0) products[index] = prod;
        })
      );
  }
}
