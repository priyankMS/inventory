export interface orderDetail {
  productname: string;
  quantity: number;
}
export interface createby {
  _id: string;
  username: string;
}

export interface orderListDetails {
  invoice?: string;
  _id: string;
  companyname: string;
  orderdetail: orderDetail[];
  date: string;
  createdBy: createby;
  __v: number;
}

export interface selectorderDetails {
  _id: string;
  companyname: string;
  orderdetail: orderDetail[];
  date: string;
  createdBy: createby;
  __v: number;
}

export interface repeateOrder {
  _id: string;
  companyname: string;
  orderdetail: orderDetail[];
  date: string;
  createdBy: createby;
  __v: number;
  invoice?: string;
}

export interface ComapanyOrderList {
  _id: string;
  company: string;
  products: string[];
  createdBy: string;
  date: string;
  __v: number;
}

export interface productOrderList {
  _id: string;
  productsname: string;
  description: string;
  quantity: number;
  createdBy: createby;
  __v: number;
}

export interface companyOrderList {
  company: string;
  products: string[];
}

  export interface DateRange {
    name: string;
    label: string;
    placeholder: string;
    disableDates: string;
    value: string;
  }


  export interface state {
    startDate:string
    endDate:string
  }

  export interface selectedProduct {
    selectedProduct :orderDetail[]
  }

