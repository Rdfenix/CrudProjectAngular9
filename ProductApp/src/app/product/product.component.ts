import { Component, OnInit } from '@angular/core';
import { ProductService } from './../service/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../interface/product';
import { DepartmentService } from '../service/department.service';
import { Department } from '../interface/department';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  constructor(
    private productsService: ProductService,
    private departmentService: DepartmentService,
    private fb: FormBuilder
  ) {}

  productForm: FormGroup = this.fb.group({
    _id: [null],
    name: ['', [Validators.required]],
    stock: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    departments: [[], [Validators.required]],
  });

  products: Product[] = [];
  departments: Department[] = [];

  private unsubscribe$: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.productsService
      .get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((prods) => (this.products = prods));
    this.departmentService
      .get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((deps) => (this.departments = deps));
  }

  save() {}

  delete(){}

  edit(){}

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
