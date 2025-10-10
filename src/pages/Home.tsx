import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import Hero from '../components/Hero';
import { useNavigate } from 'react-router-dom';
import { Heart } from "lucide-react";


const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get('api/Product');
        
        if (response.data && response.data.isSuccess) {
          // Map the API response to match our ApiProduct interface
          const mappedProducts = response.data.value.data.map((item: any) => ({
            id: item.id,
            productName: item.productName,
            price: item.price, // Calculate final price after discount
            productImage: item.productImage
          }));
          
          setProducts(mappedProducts);
          
          // Set some products as featured (for example, first 5)
          setFeaturedProducts(mappedProducts.slice(0, 5));
        } else {
          throw new Error(response.data.message || 'Failed to fetch products');
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div>
      <Hero products={featuredProducts} onProductClick={handleProductClick} />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      ) : (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-amber-900">Tất cả sản phẩm</h2>
                <p className="text-amber-700 mt-1"> Tìm thấy {products.length} sản phẩm</p>
              </div>
              
              <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <option>Sắp xếp theo: Mới nhất</option>
                <option>Giá: Thấp đến Cao</option>
                <option>Giá: Cao đến Thấp</option>
                <option>Phổ biến nhất</option>
              </select>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
                <p className="text-gray-500">Try adjusting your search or browse different categories</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-200"
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={product.productImage || "https://via.placeholder.com/300x200?text=No+Image"}
                        alt={product.productName}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Wishlist */}
                      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 group">
                        <Heart className="h-4 w-4 text-gray-600 group-hover:text-red-500" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-800 transition-colors duration-200">
                        {product.productName}
                      </h3>

                      <div className="flex items-center">
                        <span className="text-xl font-bold text-amber-800">
                          {product.price.toLocaleString()} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;