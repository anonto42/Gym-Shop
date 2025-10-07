export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
  
export interface CartItem {
    product: Product;
    quantity: number;
}
  
export interface User {
    id: number;
    email: string;
    name: string;
}
  
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}