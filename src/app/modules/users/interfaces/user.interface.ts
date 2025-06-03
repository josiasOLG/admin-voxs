import { UserRoles } from '../../../shared/enums';

export interface User {
  id: string;
  _id?: string;
  name: string;
  code?: string;
  email: string;
  phone?: string;
  role: UserRoles | string;
  active: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  points: any[];
  addresses: UserAddress[];
  barberServices: BarberService[];
  typeService?: string;
}

export interface BarberService {
  id: string;
  name: string;
  points: string;
}

export interface UserAddress {
  id?: string;
  _id?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  userId?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  role: UserRoles;
  password: string;
  address?: CreateUserAddressRequest;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRoles;
  isActive?: boolean;
}

export interface CreateUserAddressRequest {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UpdateUserAddressRequest {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}
