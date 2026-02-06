
export enum EquipmentCategory {
  TOTAL_STATIONS = 'Total Stations',
  GNSS_GPS = 'GNSS/GPS',
  DRONES = 'Drones/UAV',
  LASER_LEVELS = 'Laser Levels',
  TRIPODS_ACCESSORIES = 'Tripods & Accessories',
  SCANNERS = '3D Laser Scanners',
  THEODOLITES = 'Theodolites',
  OPTICAL_LEVELS = 'Optical Levels',
  OTHER = 'Other'
}

export enum Condition {
  NEW = 'New',
  LIKE_NEW = 'Like New',
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair'
}

export enum TransactionType {
  SALE = 'Sale',
  RENTAL = 'Rental',
  BOTH = 'Both'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  rating: number;
  totalTransactions: number;
}

export interface EquipmentListing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: EquipmentCategory;
  condition: Condition;
  transactionType: TransactionType;
  salePrice?: number;
  rentalPriceDaily?: number;
  rentalPriceWeekly?: number;
  location: string;
  images: string[];
  specs: Record<string, string>;
  isApproved: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  buyerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}
