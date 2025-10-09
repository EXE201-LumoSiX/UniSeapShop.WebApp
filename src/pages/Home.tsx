import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import ProductModal from "../components/ProductModal";
import SellItemModal from "../components/SellItemModal";
import { Product } from "../types";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Ghế bành da cổ điển",
    price: 450000,
    originalPrice: 850000,
    category: "Nhà cửa & Đời sống",
    condition: "Tốt",
    seller: "Thái Công",
    location: "Q1, TP.HCM",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAa6K7REl1EgQ2Wv7GCWu8RDH1gZeC38ceMA&s",
    description:
      "Chiếc ghế bành da cổ điển đẹp, tình trạng xuất sắc. Một chút mòn ở tay vịn nhưng rất thoải mái.",
    canExchange: true,
    postedDate: "2 ngày trước",
  },
  {
    id: 2,
    title: "iPhone 12 Pro",
    price: 12050000,
    originalPrice: 20000000,
    category: "Điện thoại - Phụ Kiện",
    condition: "Tốt",
    seller: "Táo Mỹ",
    location: "Quận 9, TP.HCM",
    image:
      "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500",
    description:
      "iPhone 12 Pro trong tình trạng tốt, full hộp và phụ chính hãng.",
    canExchange: true,
    postedDate: "1 ngày trước",
  },
  {
    id: 3,
    title: "Xe đạp địa hình",
    price: 320000,
    originalPrice: 600000,
    category: "Ô Tô & Xe Máy & Xe Đạp",
    condition: "Tốt",
    seller: "Decathon",
    location: "Q5, TP.HCM",
    image:
      "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=500",
    description:
      "Xe đạp địa hình tuyệt vời cho việc đạp trên đường mòn và trong thành phố. Mới được bảo dưỡng gần đây.",
    canExchange: true,
    postedDate: "3 ngày trước",
  },
  {
    id: 4,
    title: "Máy ảnh cổ điển",
    price: 280000,
    originalPrice: 450000,
    category: "Máy Ảnh & Máy Quay Phim",
    condition: "Tốt",
    seller: "Cannon",
    location: "Q3, TP.HCM",
    image:
      "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=500",
    description:
      "Máy ảnh phim cổ điển còn hoạt động tốt. Hoàn hảo cho những người đam mê nhiếp ảnh.",
    canExchange: false,
    postedDate: "5 ngày trước",
  },
  {
    id: 5,
    title: "Túi xách thiết kế",
    price: 190000,
    originalPrice: 380000,
    category: "Quần áo - Phụ kiện",
    condition: "Như mới",
    seller: "Khôi srote",
    location: "Q12, TP.HCM",
    image:
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500",
    description:
      "Túi xách thiết kế chính hãng, hiếm khi sử dụng. Kèm theo chứng nhận tính xác thực.",
    canExchange: true,
    postedDate: "1 tuần trước",
  },
  {
    id: 6,
    title: "Máy chơi game",
    price: 380000,
    originalPrice: 500000,
    category: "Giải trí",
    condition: "Tốt",
    seller: "Gamer",
    location: "Hóc Môn, TP.HCM",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=500",
    description: "Máy chơi game kèm theo hai tay cầm và một vài trò chơi.",
    canExchange: true,
    postedDate: "4 ngày trước",
  },
  {
    id: 7,
    title: "Sách kỹ năng sống",
    price: 30000,
    originalPrice: 40000,
    category: "Sách",
    condition: "Như mới",
    seller: "Nhật Ánh",
    location: "Q3, TP.HCM",
    image:
      "https://product.hstatic.net/200000343865/product/5_46267b16e33a46e38c8936b72ffb786c_large.jpg",
    description:
      'Kính Vạn Hoa" của Nguyễn Nhật Ánh là câu chuyện về tuổi học trò, tình bạn và những kỷ niệm đẹp qua góc nhìn chân thật, giản dị.',
    canExchange: true,
    postedDate: "2 ngày trước",
  },
  {
    id: 8,
    title: "Camera thông minh",
    price: 60000,
    originalPrice: 90000,
    category: "Dụng cụ và thiết bị tiện ích",
    condition: "Khá tốt",
    seller: "Minh Nhật",
    location: "Q.Bình Thạnh, TP.HCM",
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/12/camera-thong-minh.jpg",
    description:
      "camera có khả năng kết nối internet và sử dụng các công nghệ như nhận diện khuôn mặt, theo dõi chuyển động, và gửi cảnh báo trực tiếp qua ứng dụng.",
    canExchange: false,
    postedDate: "4 ngày trước",
  },
  {
    id: 9,
    title: "Điện thoại Iphone 17 Pro Max 256GB",
    price: 39999000,
    originalPrice: 41800000,
    category: "Điện thoại - Phụ Kiện",
    condition: "Tốt",
    seller: "Apple",
    location: "Q1, TP.HCM",
    image:
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/i/p/iphone-17-pro-256-gb.png",
    description:
      "iPhone 17 Pro Max là mẫu smartphone cao cấp của Apple, sở hữu chip A19 Pro mạnh mẽ, RAM 12GB và camera 48MP với khả năng zoom quang học lên đến 8x. Màn hình OLED 6.9 inch với độ sáng 3.000 nits và tần số quét 120Hz mang lại trải nghiệm hình ảnh tuyệt vời. Thời gian sử dụng pin lên đến 37 tiếng và hỗ trợ sạc nhanh.",
    canExchange: false,
    postedDate: "1 ngày trước",
  },
  {
    id: 10,
    title: "Áo cưới cô dâu",
    price: 13756000,
    originalPrice: 15678000,
    category: "Quần áo - Phụ kiện",
    condition: "Tốt",
    seller: "Wedding",
    location: "Q2, TP.HCM",
    image:
      "https://media.loveitopcdn.com/41138/thumb/vay-le-cup-nguc-tung-vi-tinh-k007h3-3.jpg",
    description:
      "Váy cưới cúp ngực tùng vát tinh tế, sang trọng, giúp cô dâu tôn lên vẻ đẹp quyến rũ và thanh lịch trong ngày trọng đại.",
    canExchange: false,
    postedDate: "3 ngày trước",
  },
  {
    id: 11,
    title: "Nhà phố hiện đại 1000m2",
    price: 1599000000,
    originalPrice: 1734000000,
    category: "Nhà cửa & Đời sống",
    condition: "Tốt",
    seller: "Thai Công",
    location: "Q2, TP.HCM",
    image:
      "https://sgl.com.vn/wp-content/uploads/2023/05/kien-truc-nha-o-1.png",
    description:
      "Nhà phố hiện đại với diện tích 1000m2, thiết kế sang trọng, tiện nghi đầy đủ, vị trí đắc địa tại trung tâm thành phố.",
    canExchange: false,
    postedDate: "15 ngày trước",
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    // Check if token exists and is not expired
    if (token && tokenExpiration) {
      const now = new Date();
      const expiration = new Date(tokenExpiration);
      setIsLoggedIn(now < expiration);
    } else {
      setIsLoggedIn(false);
    }

    // Listen for login state changes
    const handleLoginStateChange = () => {
      const updatedToken = localStorage.getItem("token");
      const updatedTokenExpiration = localStorage.getItem("tokenExpiration");

      if (updatedToken && updatedTokenExpiration) {
        const now = new Date();
        const expiration = new Date(updatedTokenExpiration);
        setIsLoggedIn(now < expiration);
      } else {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener("loginStateChange", handleLoginStateChange);

    return () => {
      window.removeEventListener("loginStateChange", handleLoginStateChange);
    };
  }, []);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formattedProducts = filteredProducts.map((product) => {
    return { ...product, price: product.price }; // Giữ giá trị như cũ
  });

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const openSellModal = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowSellModal(true);
    }
  };

  const handleAuthRequired = () => {
    navigate("/login");
  };

  return (
    <>
      <Hero
        products={mockProducts.slice(0, 10)}
        onProductClick={openProductModal}
      />
      <ProductGrid
        products={formattedProducts}
        onProductClick={openProductModal}
        searchQuery={searchQuery}
      />
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={closeProductModal}
          isLoggedIn={isLoggedIn}
          onAuthRequired={handleAuthRequired}
        />
      )}

      {showSellModal && (
        <SellItemModal onClose={() => setShowSellModal(false)} />
      )}
    </>
  );
};

export default Home;
