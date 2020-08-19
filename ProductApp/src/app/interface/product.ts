import { Department } from './department';

export interface Product {
  name: string;
  departments: Department[];
  stock: number;
  price: number;
  _id?: string;
}

export interface ProductData {
  Product?: Product[];
}

export interface ReponseProduct {
  Product?: Product[];
}
