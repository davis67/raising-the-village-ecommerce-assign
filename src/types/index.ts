// Customer types
export interface Customer {
  customerId: string;
  name: string;
  email: string;
  country: string;
  signupDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Order types
export interface Order {
  orderId: string;
  customerId: string;
  productName: string;
  amount: number;
  orderDate: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Unified response format
export interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  country: string;
  signupDate: string;
}

export interface OrderDetail {
  orderId: string;
  productName: string;
  amount: number;
  orderDate: string;
  status: string;
}

export interface OrderSummary {
  totalOrders: number;
  totalSpent: number;
  orders: OrderDetail[];
}

export interface CustomerWithOrders {
  customer: CustomerDetail;
  orderSummary: OrderSummary;
}

export interface CustomersAggregated {
  customer: CustomerDetail;
  orderSummary: OrderSummary;
}

// CSV upload response
export interface UploadResponse {
  success: boolean;
  message: string;
  recordsProcessed?: number;
  recordsFailed?: number;
  errors?: string[];
}

// Validation error
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
