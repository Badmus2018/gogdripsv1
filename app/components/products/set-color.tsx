"use client";

import {
  CartProductType,
  SelectedImgType,
} from "@/app/product/[productId]/product-details";

interface SetColorProps {
  images: { image: string }[];
  cartProduct: CartProductType;
  handleColorSelect: (value: SelectedImgType) => void;
}

const SetColor: React.FC<SetColorProps> = ({
  images,
  cartProduct,
  handleColorSelect,
}) => {
  return (
    <div>
      <div className="flex gap-4 items-center">
        <span className="font-semibold">IMAGE:</span>
        <div className="flex gap-1">
          {images.map((image, idx) => (
            <div
              key={idx}
              onClick={() => handleColorSelect(image)}
              className="h-7 w-7 rounded-full border-teal-300 flex items-center justify-center transition active:scale-[0.8] cursor-pointer border-none"
            >
              {/* Optionally show image preview here */}
              <div className="h-5 w-5 rounded-full border-[1.2px] border-slate-300 cursor-pointer bg-gray-200 flex items-center justify-center">
                {/* Optionally show image preview here */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetColor;
