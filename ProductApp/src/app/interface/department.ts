export interface Department {
  name: string;
  _id?: string;
}

export interface ResponseDepartment {
  Department: Department[];
}
