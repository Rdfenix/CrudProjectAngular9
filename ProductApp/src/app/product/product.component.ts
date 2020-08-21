import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from './../service/product.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Product } from '../interface/product';
import { DepartmentService } from '../service/department.service';
import { Department } from '../interface/department';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  constructor(
    private productsService: ProductService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {}

  productForm: FormGroup = this.fb.group({
    _id: [null],
    name: ['', [Validators.required]],
    stock: ['', [Validators.required, Validators.min(0)]],
    price: ['', [Validators.required, Validators.min(0)]],
    departments: [[], [Validators.required]],
    __v: [null],
  });

  @ViewChild('form') form: NgForm;

  products: any = [];
  departments: Department[] = [];

  private unsubscribe$: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.departmentService
      .get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((deps) => {
        this.departments = deps;
      });
    this.productsService
      .get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((prods) => {
        this.products = prods;
      });
  }

  save() {
    let data = this.productForm.value;
    if (data._id) {
      this.productsService.update(data).subscribe();
    } else {
      this.productsService.add(data).subscribe();
    }

    this.resetForm();
  }

  delete(prod: Product) {
    this.productsService.delete(prod).subscribe(
      () => {
        this.notify('Deleted');
      },
      (err) => console.log(err)
    );
  }

  edit(prod: Product) {
    this.productForm.setValue(prod);
  }

  notify(msg: string) {
    this.snackbar.open(msg, 'OK', { duration: 3000 });
  }

  resetForm() {
    this.form.resetForm();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
