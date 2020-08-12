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

  delete(dep: Department): Observable<any> {
    return this.http.delete(`${this.url}/${dep._id}`).pipe(
      tap(() => {
        let departments = this.departmenteSubject$.getValue();
        let index = departments.findIndex(
          (department) => department._id === dep._id
        );
        if (index >= 0) {
          departments.splice(index, 1);
        }
      })
    );
  }

  update(dep: Department): Observable<Department> {
    return this.http.patch<Department>(`${this.url}/${dep._id}`, dep).pipe(
      tap((dep) => {
        let departments = this.departmenteSubject$.getValue();
        let index = departments.findIndex(
          (department) => department._id === dep._id
        );
        if (index >= 0) {
          departments[index].name = dep.name;
        }
      })
    );
  }
}
