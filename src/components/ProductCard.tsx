import React from 'react';
import { formatCurrency } from '../utils/stringUtils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  productImage: string;
  condition?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  productImage,
  condition
}) => {
  // Calculate discount percentage if originalPrice exists
  const discountPercentage = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Default image if imageUrl is not provided
  const defaultImage = 'https://via.placeholder.com/300x300?text=No+Image';
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={productImage || defaultImage}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Condition Badge */}
        {condition && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {condition}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{name}</h3>
        </div>
        
        <div className="mt-2">
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-amber-600">{formatCurrency(price)}</span>
            
            {originalPrice && originalPrice > price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;