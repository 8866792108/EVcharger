import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const slides = [
  {
    image: "../src/assets/imgs/pic1.png",
    name: "LUNDEV",
    description: "Tình ru anh chơi đùa\nChưa kịp chơi đùa mà em đã xa anh",
    specs: ["Năm sản xuất 2022", "Tốc độ tối đa 100km/h", "Dung lượng pin 5.2 kWh"]
  },
  {
    image: "../src/assets/imgs/pic2.png",
    name: "EVO-X",
    description: "Trải nghiệm tốc độ với EVO-X, thiết kế tương lai và mạnh mẽ.",
    specs: ["Năm sản xuất 2023", "Tốc độ tối đa 120km/h", "Dung lượng pin 6.0 kWh"]
  },
  {
    image: "../src/assets/imgs/pic3.png",
    name: "EVO-X",
    description: "Trải nghiệm tốc độ với EVO-X, thiết kế tương lai và mạnh mẽ.",
    specs: ["Năm sản xuất 2023", "Tốc độ tối đa 120km/h", "Dung lượng pin 6.0 kWh"]
  },
  {
    image: "../src/assets/imgs/pic4.png",
    name: "X-TREME",
    description: "Dẫn đầu phong cách với động cơ mạnh mẽ và kiểu dáng ấn tượng.",
    specs: ["Năm sản xuất 2024", "Tốc độ tối đa 130km/h", "Dung lượng pin 7.0 kWh"]
  }
];

export default function CarSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("right");

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection("right");
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setDirection("left");
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setDirection("right");
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-screen bg-black flex justify-center items-center text-white">
      <div className="absolute top-5 left-10 flex items-center space-x-5 text-sm">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        <ul className="flex space-x-5">
          <li>HOME</li>
          <li>CATEGORY</li>
          <li>INFO</li>
          <li>CONTACT</li>
        </ul>
      </div>
      <motion.div
        key={current}
        className="absolute w-3/4 h-auto"
        initial={{ opacity: 0, scale: direction === "right" ? 0.2 : 2.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <img src={slides[current].image} alt="Vehicle" className="w-full" />
      </motion.div>
      <div className="absolute left-10 top-1/3 text-left">
        <h1 className="text-5xl font-bold">{slides[current].name}</h1>
        <p className="text-lg mt-2">{slides[current].description}</p>
        <button className="mt-4 px-4 py-2 bg-black rounded-lg">See more →</button>
      </div>
      <div className="absolute right-10 top-1/3">
        <h2 className="text-2xl font-bold">CẤU HÌNH</h2>
        <ul className="mt-2 space-y-2">
          {slides[current].specs.map((spec, index) => (
            <li key={index} className="flex items-center">• {spec}</li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-5 flex space-x-3">
        <button onClick={handlePrev}>◀</button>
        <button onClick={handleNext}>▶</button>
      </div>
    </div>
  );
}
