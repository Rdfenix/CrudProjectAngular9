import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Department } from '../interface/department';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  readonly url = `${environment.url}/departments`;
  private departmenteSubject$: BehaviorSubject<
    Department[]
  > = new BehaviorSubject<Department[]>(null);

  private loaded: boolean = false;

  constructor(private http: HttpClient) {}

  get(): Observable<Department[]> {
    if (!this.loaded) {
      this.http.get<Department[]>(this.url).subscribe(this.departmenteSubject$);
      this.loaded = true;
    }
    return this.departmenteSubject$.asObservable();
  }

  add(dep: Department): Observable<Department> {
    return this.http
      .post<Department>(this.url, dep)
      .pipe(
        tap((dep: Department) => this.departmenteSubject$.getValue().push(dep))
      );
  }
}
