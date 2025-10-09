import React from 'react';
import { Smartphone, Home, Car, Shirt, Gamepad2, Camera, BookOpen, Wrench } from 'lucide-react';

interface CategoriesProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const categories = [
  { name: 'All', icon: null },
  { name: 'Điện thoại - Phụ Kiện', icon: Smartphone },
  { name: 'Nhà cửa & Đời sống', icon: Home },
  { name: 'Ô Tô & Xe Máy & Xe Đạp', icon: Car },
  { name: 'Quần áo - Phụ kiện', icon: Shirt },
  { name: 'Giải trí', icon: Gamepad2 },
  { name: 'Máy Ảnh & Máy Quay Phim', icon: Camera },
  { name: 'Sách', icon: BookOpen },
  { name: 'Dụng cụ và thiết bị tiện ích', icon: Wrench },
];

const Categories: React.FC<CategoriesProps> = ({ selectedCategory, onCategorySelect }) => {
  return (
    <section className="py-8 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Danh Mục</h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.name;
            
            return (
              <button
                key={category.name}
                onClick={() => onCategorySelect(category.name)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
                  isSelected
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-amber-800'
                }`}
              >
                {IconComponent && <IconComponent className="h-5 w-5" />}
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;