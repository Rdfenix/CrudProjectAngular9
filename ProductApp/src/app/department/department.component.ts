import { Component, OnInit } from '@angular/core';
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

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.departmentService.get().subscribe((deps) => {
      this.departments = deps;
    });
  }

  save() {
    this.departmentService.add({ name: this.depName }).subscribe(
      (dep) => {
        console.log(dep);
        this.clearField();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  clearField() {
    this.depName = '';
  }

  cancel() {}

  edit(dep: Department) {}
  delete(dep: Department) {}
}
