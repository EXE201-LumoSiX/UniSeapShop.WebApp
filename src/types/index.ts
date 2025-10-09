export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: 'Như mới' | 'Tốt' | 'Khá tốt';
  seller: string;
  location: string;
  image: string;
  description: string;
  canExchange: boolean;
  postedDate: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  location: string;
  avatar?: string;
  rating: number;
  totalSales: number;
}

export interface ExchangeRequest {
  id: number;
  fromUserId: number;
  toUserId: number;
  offeredProductId: number;
  requestedProductId: number;
  status: 'Đang chờ' | 'Đã chấp nhận' | 'Đã từ chối';
  message?: string;
  createdAt: string;
}