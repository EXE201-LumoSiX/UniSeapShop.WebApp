import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Building2, Wallet, MapPin, User, Phone, Mail, CheckCircle, Clock, Shield, Truck, Package } from 'lucide-react';
import { CartItem } from '../types';

// Mock cart data for payment
const mockCartItems: CartItem[] = [
  {
    id: 'cart-1',
    product: {
      id: 1,
      productName: 'iPhone 13 Pro Max',
      productImage: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300',
      categoryId: 'electronics',
      description: 'iPhone 13 Pro Max 256GB, màu xanh dương, còn bảo hành',
      price: 25000000,
      quantity: 1,
      supplierId: 'supplier-001',
      createdAt: '2025-01-20T10:00:00Z',
      title: 'iPhone 13 Pro Max',
      category: 'Điện tử',
      condition: 'Excellent',
      seller: 'Nguyễn Văn An',
      location: 'Hà Nội',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300',
      canExchange: true,
      postedDate: '2 ngày trước'
    },
    quantity: 1,
    addedAt: '2025-01-22T10:00:00Z'
  },
  {
    id: 'cart-2',
    product: {
      id: 2,
      productName: 'MacBook Air M2',
      productImage: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=300',
      categoryId: 'electronics',
      description: 'MacBook Air M2 2022, 8GB RAM, 256GB SSD, như mới',
      price: 28000000,
      quantity: 1,
      supplierId: 'supplier-002',
      createdAt: '2025-01-18T14:30:00Z',
      title: 'MacBook Air M2',
      category: 'Điện tử',
      condition: 'Like New',
      seller: 'Trần Thị Bình',
      location: 'TP.HCM',
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=300',
      canExchange: false,
      postedDate: '4 ngày trước'
    },
    quantity: 1,
    addedAt: '2025-01-21T15:30:00Z'
  }
];

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
  fee?: number;
}

interface DeliveryMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
  fee: number;
  estimatedTime: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'online',
    name: 'Thanh toán online',
    icon: CreditCard,
    description: 'Thẻ tín dụng, ví điện tử, chuyển khoản',
    fee: 0
  },
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    icon: Package,
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    fee: 15000
  }
];

const onlinePaymentOptions = [
  {
    id: 'credit_card',
    name: 'Thẻ tín dụng/Ghi nợ',
    icon: CreditCard,
    description: 'Visa, Mastercard, JCB'
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    icon: Smartphone,
    description: 'Thanh toán qua ví điện tử MoMo'
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    icon: Wallet,
    description: 'Thanh toán qua ví ZaloPay'
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    icon: Building2,
    description: 'Chuyển khoản trực tiếp'
  }
];

const deliveryMethods: DeliveryMethod[] = [
  {
    id: 'standard',
    name: 'Giao hàng tiêu chuẩn',
    icon: Truck,
    description: 'Giao hàng trong giờ hành chính',
    fee: 30000,
    estimatedTime: '3-5 ngày'
  },
  {
    id: 'express',
    name: 'Giao hàng nhanh',
    icon: Package,
    description: 'Giao hàng trong 24h',
    fee: 50000,
    estimatedTime: '1-2 ngày'
  },
  {
    id: 'pickup',
    name: 'Tự đến lấy',
    icon: MapPin,
    description: 'Đến địa chỉ người bán để lấy hàng',
    fee: 0,
    estimatedTime: 'Linh hoạt'
  }
];

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('online');
  const [selectedOnlinePayment, setSelectedOnlinePayment] = useState('credit_card');
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: ''
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate totals
  const totalItems = mockCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const paymentFee = paymentMethods.find(m => m.id === selectedPaymentMethod)?.fee || 0;
  const deliveryFee = deliveryMethods.find(m => m.id === selectedDeliveryMethod)?.fee || 0;
  const total = subtotal + paymentFee + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('card_')) {
      setCardInfo(prev => ({ ...prev, [name.replace('card_', '')]: value }));
    } else {
      setShippingInfo(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate shipping info
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Họ tên là bắt buộc';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email là bắt buộc';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    if (!shippingInfo.address.trim()) newErrors.address = 'Địa chỉ là bắt buộc';
    if (!shippingInfo.city.trim()) newErrors.city = 'Thành phố là bắt buộc';

    // Validate card info if online payment with credit card is selected
    if (selectedPaymentMethod === 'online' && selectedOnlinePayment === 'credit_card') {
      if (!cardInfo.cardNumber.trim()) newErrors.card_cardNumber = 'Số thẻ là bắt buộc';
      if (!cardInfo.expiryDate.trim()) newErrors.card_expiryDate = 'Ngày hết hạn là bắt buộc';
      if (!cardInfo.cvv.trim()) newErrors.card_cvv = 'CVV là bắt buộc';
      if (!cardInfo.cardName.trim()) newErrors.card_cardName = 'Tên trên thẻ là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
    }, 3000);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-mono font-semibold">#TM{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="font-bold text-green-600">{total.toLocaleString()} VNĐ</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-medium">{paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Giao hàng:</span>
              <span className="font-medium">{deliveryMethods.find(m => m.id === selectedDeliveryMethod)?.name}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
            >
              Tiếp tục mua sắm
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
            >
              Xem đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            to="/cart" 
            className="flex items-center text-amber-800 hover:text-amber-900 transition-colors duration-200 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại giỏ hàng
          </Link>
          <h1 className="text-3xl font-bold text-amber-900">Thanh toán</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-blue-500" />
                  Thông tin giao hàng
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập email"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Thành phố"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={shippingInfo.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Quận/Huyện"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã
                    </label>
                    <input
                      type="text"
                      name="ward"
                      value={shippingInfo.ward}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Phường/Xã"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ chi tiết *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Số nhà, tên đường..."
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    name="notes"
                    value={shippingInfo.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                    placeholder="Ghi chú thêm cho đơn hàng..."
                  />
                </div>
              </div>

              {/* Delivery Methods */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Truck className="h-6 w-6 mr-2 text-purple-500" />
                  Phương thức giao hàng
                </h2>
                
                <div className="space-y-4">
                  {deliveryMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedDeliveryMethod === method.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedDeliveryMethod(method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value={method.id}
                            checked={selectedDeliveryMethod === method.id}
                            onChange={() => setSelectedDeliveryMethod(method.id)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <IconComponent className="h-6 w-6 text-gray-600" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{method.name}</span>
                              <div className="text-right">
                                <span className="font-medium text-gray-900">
                                  {method.fee === 0 ? 'Miễn phí' : `${method.fee.toLocaleString()} VNĐ`}
                                </span>
                                <div className="text-sm text-gray-500">{method.estimatedTime}</div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-6 w-6 mr-2 text-green-500" />
                  Phương thức thanh toán
                </h2>
                
                <div className="space-y-4 mb-6">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedPaymentMethod === method.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={() => setSelectedPaymentMethod(method.id)}
                            className="text-green-600 focus:ring-green-500"
                          />
                          <IconComponent className="h-6 w-6 text-gray-600" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{method.name}</span>
                              {method.fee && method.fee > 0 && (
                                <span className="text-sm text-gray-500">+{method.fee.toLocaleString()} VNĐ</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Online Payment Options */}
                {selectedPaymentMethod === 'online' && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn phương thức thanh toán online</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {onlinePaymentOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <div
                            key={option.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              selectedOnlinePayment === option.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onClick={() => setSelectedOnlinePayment(option.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="onlinePayment"
                                value={option.id}
                                checked={selectedOnlinePayment === option.id}
                                onChange={() => setSelectedOnlinePayment(option.id)}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <IconComponent className="h-5 w-5 text-gray-600" />
                              <div>
                                <div className="font-medium text-gray-900">{option.name}</div>
                                <div className="text-sm text-gray-600">{option.description}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Credit Card Form */}
                    {selectedOnlinePayment === 'credit_card' && (
                      <div className="border-t pt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thẻ</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Số thẻ *
                            </label>
                            <input
                              type="text"
                              name="card_cardNumber"
                              value={cardInfo.cardNumber}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                                errors.card_cardNumber ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="1234 5678 9012 3456"
                            />
                            {errors.card_cardNumber && <p className="text-red-500 text-sm mt-1">{errors.card_cardNumber}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ngày hết hạn *
                            </label>
                            <input
                              type="text"
                              name="card_expiryDate"
                              value={cardInfo.expiryDate}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                                errors.card_expiryDate ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="MM/YY"
                            />
                            {errors.card_expiryDate && <p className="text-red-500 text-sm mt-1">{errors.card_expiryDate}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              name="card_cvv"
                              value={cardInfo.cvv}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                                errors.card_cvv ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="123"
                            />
                            {errors.card_cvv && <p className="text-red-500 text-sm mt-1">{errors.card_cvv}</p>}
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tên trên thẻ *
                            </label>
                            <input
                              type="text"
                              name="card_cardName"
                              value={cardInfo.cardName}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                                errors.card_cardName ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="NGUYEN VAN A"
                            />
                            {errors.card_cardName && <p className="text-red-500 text-sm mt-1">{errors.card_cardName}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của bạn</h3>
                
                {/* Products */}
                <div className="space-y-4 mb-6">
                  {mockCartItems.map((item) => (
                    <div key={item.id} className="flex space-x-3">
                      <img
                        src={item.product.productImage}
                        alt={item.product.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {item.product.productName}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">x{item.quantity}</span>
                          <span className="font-medium text-gray-900">
                            {(item.product.price * item.quantity).toLocaleString()} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Summary */}
                <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính ({totalItems} sản phẩm)</span>
                    <span className="font-medium">{subtotal.toLocaleString()} VNĐ</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí giao hàng</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        `${deliveryFee.toLocaleString()} VNĐ`
                      )}
                    </span>
                  </div>
                  
                  {paymentFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí thanh toán</span>
                      <span className="font-medium">{paymentFee.toLocaleString()} VNĐ</span>
                    </div>
                  )}
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-amber-800">{total.toLocaleString()} VNĐ</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      <span>Xác nhận thanh toán</span>
                    </>
                  )}
                </button>

                {/* Security Info */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Thanh toán được bảo mật bởi SSL</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {deliveryMethods.find(m => m.id === selectedDeliveryMethod)?.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;