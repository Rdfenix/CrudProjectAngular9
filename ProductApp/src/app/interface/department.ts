export interface Department {
  name: string;
  _id?: string;
  __v?: number;
}

export interface ResponseDepartment {
  Department: Department[];
}
