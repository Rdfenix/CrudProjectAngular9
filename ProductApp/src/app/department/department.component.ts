import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Department } from '../interface/department';
import { DepartmentService } from '../service/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  depName: string = '';
  departments: Department[] = [];
  onEdit: Department = null;
  private unSubscribe$: Subject<any> = new Subject();

  constructor(
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.departmentService
      .get()
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((deps) => {
        this.departments = deps;
      });
  }

  save() {
    if (this.onEdit) {
      this.departmentService
        .update({
          name: this.depName,
          _id: this.onEdit._id,
        })
        .subscribe(
          (dep) => {
            this.info('Updated!');
          },
          (err) => {
            this.info('Error');
            console.error(err);
          }
        );
    } else {
      this.departmentService.add({ name: this.depName }).subscribe(
        (dep) => {
          console.log(dep);
          this.info('Inserted');
        },
        (err) => {
          console.error(err);
        }
      );
    }
    this.clearField();
  }

  clearField() {
    this.depName = '';
    this.onEdit = null;
  }

  cancel() {
    this.clearField();
  }

  edit(dep: Department) {
    this.depName = dep.name;
    this.onEdit = dep;
  }
  delete(dep: Department) {
    this.departmentService.delete(dep).subscribe(
      () => this.info('Removed'),
      (err) => this.info(err.error.error)
    );
  }

  info(msg: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }

  ngOnDestroy() {
    this.unSubscribe$.next();
  }
}
