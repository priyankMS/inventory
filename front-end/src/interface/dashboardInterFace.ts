export interface orderDetails {
  productname: string;
  quantity: number;
}
export interface createby {
  _id: string;
  username: string;
}

export interface orderDashboard {
  companyname: string;
  date: string;
  _id: string;
  orderdetail: orderDetails[];
}

export interface lowStockProduct {
     id?: string;
  key?: string;
  no?: number;
  productsname: string;
  quantity: number;
  updatedAt: string;
}
