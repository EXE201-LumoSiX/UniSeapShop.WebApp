import React from "react";
import { ArrowRight, Recycle, DollarSign, Repeat } from "lucide-react";
import { Product } from "../types";
import ProductCard from "./ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface HeroProps {
  products?: Product[];
  onProductClick?: (product: Product) => void;
}
const Hero: React.FC<HeroProps> = ({
  products = [],
  onProductClick = () => {},
}) => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    cssEase: "linear",
  };
  return (
    <section className="relative bg-gradient-to-l from-amber-100 via-yellow-50 to-orange-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-6">
            Mua, Bán, <span className="text-yellow-600">Trao Đổi</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center">
              Bắt Đầu Mua Sắm
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl">
              Đăng Bán Sản Phẩm Của Bạn
            </button>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-amber-900 mb-4">
          Sản phẩm nổi bật
        </h2>
        {/* Popular Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id} className="px-2">
                <ProductCard
                  product={product}
                  onClick={() => onProductClick(product)}
                  featured={true}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Hero;
