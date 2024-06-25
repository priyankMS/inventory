export interface companyDetails {
  _id: string;
  company: string;
  products: string[];
  createdBy: string;
  date: string;
  __v: number;
}

export interface companyProduct {
  _id: string;
  productsname: string;
  description: string;
  quantity: number;
  createdBy: {
    _id: string;
    username: string;
  };
  __v: number;
}


export interface companyFormData {
  _id?: string;
  company: string;
  products: string[];
}