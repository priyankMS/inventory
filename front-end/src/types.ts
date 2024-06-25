export interface order {
  companyname: string;
  date: "";
  orderdetail: {
    productname: string;
    quantity: number | undefined;
  }[];
}

export interface product {
  _id: string;
  createdBy: {
    _id: string;
    username: string;
  };
  description: string;
  productsname: string;
  quantity: number;
  invoice?: Blob;
}
