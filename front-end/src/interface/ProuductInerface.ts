

type createBy = {
  _id: string;
  username: string;
};

export interface ProductInterface {
  createAt?: string;
  updatedAt?: string;
  productsname: string;
  quantity: number;
  description: string;
  _id?: string;
  createdBy: createBy;
}


export interface formDataProduct {
    _id?: string;
    productsname: string;
    description: string;
    quantity: number;
}

export interface productName {
  products:string[];
}

export interface productData {
      _id:string;
      company:string;
      products:string[];
      createdBy:string;
      date:string;
      __v:number;
}

export interface productSearchInterface{
  company:string;
  products:string[];
}