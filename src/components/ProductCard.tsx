// import React from 'react';
// import { Heart, MapPin, RefreshCw } from 'lucide-react';

// // Define the API product type based on the response
// interface ApiProduct {
//   id: string;
//   productName: string;
//   price: number;
//   description: string;
//   categoryId: string;
//   quantity: number;
//   supplierId: string;
//   image?: string;
//   condition?: string;
//   location?: string;
//   seller?: string;
//   canExchange?: boolean;
//   createdAt?: string;
// }

// interface ProductCardProps {
//   product: ApiProduct;
//   onClick?: () => void;
//   featured?: boolean;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, featured = false }) => {
//   const productImage = product?.image || "https://via.placeholder.com/300x200?text=No+Image";
  
//   return (
//     <div 
//       className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden ${
//         featured ? 'border-2 border-yellow-300' : 'border border-gray-200'
//       }`}
//       onClick={onClick}
//     >
//       {/* Image */}
//       <div className="relative overflow-hidden">
//         <img
//           src={productImage}
//           alt={product.productName}
//           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//         />
        
//         {/* Badges */}
//         <div className="absolute top-3 left-3 flex flex-col gap-2">
//           {featured && (
//             <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
//               Nổi bật
//             </span>
//           )}
//           {product.canExchange && (
//             <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
//               <RefreshCw className="h-3 w-3" />
//               Trao đổi
//             </span>
//           )}
//         </div>

//         {/* Wishlist */}
//         <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 group">
//           <Heart className="h-4 w-4 text-gray-600 group-hover:text-red-500" />
//         </button>
//       </div>

//       {/* Content */}
//       <div className="p-5">
//         <div className="flex justify-between items-start mb-2">
//           <span className="text-sm text-yellow-600 font-medium bg-yellow-100 px-2 py-1 rounded">
//             {product.categoryId}
//           </span>
//           <span className="text-sm text-gray-500">
//             {product.createdAt ? new Date(product.createdAt).toLocaleDateString('vi-VN') : ''}
//           </span>
//         </div>

//         <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-800 transition-colors duration-200">
//           {product.productName}
//         </h3>

//         {product.location && (
//           <div className="flex items-center text-sm text-gray-600 mb-3">
//             <MapPin className="h-4 w-4 mr-1" />
//             <span>{product.location}</span>
//           </div>
//         )}

//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <span className="text-xl font-bold text-amber-800">
//               {product.price.toLocaleString('vi-VN')} đ
//             </span>
//           </div>
          
//           {product.condition && (
//             <div className="text-sm">
//               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                 product.condition === 'Như mới' ? 'bg-green-100 text-green-800' :
//                 product.condition === 'Khá tốt' ? 'bg-blue-100 text-blue-800' :
//                 product.condition === 'Tốt' ? 'bg-yellow-100 text-yellow-800' :
//                 'bg-orange-100 text-orange-800'
//               }`}>
//                 {product.condition}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;