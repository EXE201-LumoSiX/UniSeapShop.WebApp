import React from "react";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import logoImage from "../../assets/images/lumoxis_logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-amber-900 text-[#EDE3D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4 flex flex-col items-center md:items-start pl-6">
            <div className="p-2 rounded-lg">
              <img
                src={logoImage}
                alt="LumoSix Logo"
                className="h-20 w-auto"
              />
            </div>
            <div className="flex space-x-4 pl-20">
              <a href="https://www.tiktok.com/@uniseap" className="text-[#ffb44a] hover:text-yellow-500 transition-colors duration-300">
                <FontAwesomeIcon icon={faTiktok} size="lg" className="h-6 w-6" />
              </a>
              <a href="https://www.facebook.com/uniseap.info" className="text-[#ffb44a] hover:text-yellow-500 transition-colors duration-300">
                <FontAwesomeIcon icon={faFacebook} size="lg" className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#FFB44A]">
              Liên hệ với chúng tôi
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#FFB44A]" />
                <span className="text-[#FEF3C7]">0123456789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#FFB44A]" />
                <span className="text-[#FEF3C7]">uniseap.info@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-[#FFB44A]" />
                <span className="text-[#FEF3C7]">
                  123 đường số 1, TP.Thủ Đức
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#FFB44A]">
              Truy cập nhanh
            </h4>
            <nav className="space-y-2">
              <a
                href="#"
                className="block hover:text-yellow-400 transition-colors duration-200"
              >
                Nâng cấp tài khoản
              </a>
              <a
                href="#"
                className="block hover:text-yellow-400 transition-colors duration-200"
              >
                Truy cập nhanh
              </a>
              <a
                href="#"
                className="block hover:text-yellow-400 transition-colors duration-200"
              >
                Truy cập nhanh
              </a>
              <a
                href="#"
                className="block hover:text-yellow-400 transition-colors duration-200"
              >
                Truy cập nhanh
              </a>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#FFB44A]">
              Chính sách
            </h4>
            <nav className="space-y-2">
              <a
                href="#"
                className="block hover:text-yellow-400 transition-colors duration-200"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="block hover:text-yellow-400 transition-colors duration-200"
              >
                Bảo vệ người dùng
              </a>
              <a
                href="#"
                className="block hover:text-yellow-400 transition-colors duration-200"
              >
                Giải quyết tranh chấp
              </a>
              <a
                href="#"
                className="block hover:text-yellow-400 transition-colors duration-200"
              >
                Danh sách sản phẩm vi phạm
              </a>
            </nav>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-[#8B5E3C] text-sm">
              © 2025 LumosiX. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a
                href="#"
                className="text-[#8B5E3C] hover:text-yellow-400 transition-colors duration-200"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="text-[#8B5E3C] hover:text-yellow-400 transition-colors duration-200"
              >
                Điều khoản dịch vụ
              </a>
              <a
                href="#"
                className="text-[#8B5E3C] hover:text-yellow-400 transition-colors duration-200"
              >
                Hướng dẫn cộng đồng
              </a>
              <a
                href="#"
                className="text-[#8B5E3C] hover:text-yellow-400 transition-colors duration-200"
              >
                Trung tâm trợ giúp
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
