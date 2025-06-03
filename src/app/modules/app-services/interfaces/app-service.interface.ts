export interface IActivity {
  _id?: string;
  name: string;
  point: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: string;
  name: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AppService {
  _id?: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  active: boolean;
  activities: IActivity[];
  categories: ICategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppServiceRequest {
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  active?: boolean;
  activities?: IActivity[];
  categories?: Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>[];
}

export interface UpdateAppServiceRequest {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  active?: boolean;
  activities?: IActivity[];
  categories?: Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>[];
}

export interface CreateCategoryRequest {
  name: string;
  active?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  active?: boolean;
}

export interface CreateActivityRequest {
  name: string;
  point: number;
  active?: boolean;
}

export interface UpdateActivityRequest {
  name?: string;
  point?: number;
  active?: boolean;
}
