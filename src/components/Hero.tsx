import React from "react";
import { ArrowRight } from "lucide-react";

const Hero: React.FC = () => {
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
      </div>
    </section>
  );
};

export default Hero;
