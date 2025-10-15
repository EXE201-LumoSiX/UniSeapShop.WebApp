import React from "react";
import bannerImage from "../assets/images/naycanmaikhong.png";

const Hero: React.FC = () => {
  return (
    <section className="relative w-full">
      <div className="w-full">
        <div className="relative">
          <img 
            src={bannerImage} 
            alt="UniSeap Shop Banner" 
            className="w-full h-auto shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;