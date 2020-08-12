import { Component, OnInit } from '@angular/core';
import { ProductService } from './../service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  constructor(private productsService: ProductService) {}

  ngOnInit(): void {
    this.productsService.get().subscribe((prods) => console.log(prods));
  }
}
