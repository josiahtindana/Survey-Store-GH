import { EquipmentCategory, Condition, TransactionType, EquipmentListing, User } from './types.ts';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'James Survey', email: 'james@example.com', role: 'seller', rating: 4.8, totalTransactions: 42, avatar: 'https://picsum.photos/seed/u1/100/100' },
  { id: 'u2', name: 'Sarah Eng', email: 'sarah@example.com', role: 'buyer', rating: 4.9, totalTransactions: 12, avatar: 'https://picsum.photos/seed/u2/100/100' },
  { id: 'admin', name: 'System Admin', email: 'admin@surveytrade.com', role: 'admin', rating: 5.0, totalTransactions: 0 }
];

export const MOCK_LISTINGS: EquipmentListing[] = [
  {
    id: 'l1',
    sellerId: 'u1',
    title: 'Leica TS16 P 1" R1000 Robotic Total Station',
    description: 'Highly accurate robotic total station for demanding engineering projects. Captures data automatically with dynamic lock technology.',
    category: EquipmentCategory.TOTAL_STATIONS,
    condition: Condition.EXCELLENT,
    transactionType: TransactionType.BOTH,
    salePrice: 18500,
    rentalPriceDaily: 250,
    location: 'Accra, Greater Accra',
    images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800'],
    specs: { 'Brand': 'Leica', 'Accuracy': '1"', 'EDM Range': '1000m', 'Type': 'Robotic' },
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l2',
    sellerId: 'u1',
    title: 'Trimble R12i GNSS RTK System',
    description: 'Top-of-the-line GNSS system with ProPoint technology and tip compensation. Works in the most challenging environments.',
    category: EquipmentCategory.GNSS_GPS,
    condition: Condition.LIKE_NEW,
    transactionType: TransactionType.RENTAL,
    rentalPriceDaily: 350,
    location: 'Kumasi, Ashanti',
    images: ['https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&q=80&w=800'],
    specs: { 'Brand': 'Trimble', 'Model': 'R12i', 'Tilt': 'IMU-based', 'Signals': 'Triple Frequency' },
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l3',
    sellerId: 'u1',
    title: 'Faro Focus S350 Laser Scanner',
    description: 'High-speed 3D laser scanner for rapid indoor and outdoor documentation. Range up to 350m.',
    category: EquipmentCategory.SCANNERS,
    condition: Condition.EXCELLENT,
    transactionType: TransactionType.BOTH,
    salePrice: 28000,
    rentalPriceDaily: 600,
    location: 'Accra, Ghana',
    images: ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800'],
    specs: { 'Brand': 'Faro', 'Scan Rate': '976k pts/sec', 'Range': '350m', 'Accuracy': '±1mm' },
    isApproved: true,
    createdAt: new Date().toISOString()
  }
];