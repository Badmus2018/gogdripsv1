"use client";


import React from "react";
import Image from "next/image";

interface ProductImageProps {
  image: string;
  alt: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, alt }) => {
  const isDataUrl = typeof image === 'string' && image.startsWith('data:');
  return (
    <div className="flex-col items-center justify-center h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      <div className="flex max-h-[500px] min-h-[300px] sm:min-h-[400px] relative mb-1">
        {isDataUrl ? (
          <img
            src={image}
            alt={alt}
            style={{ objectFit: 'contain', width: '100%', height: 'auto', display: 'block', aspectRatio: '1/1', maxHeight: '500px', minHeight: '300px' }}
            className="object-contain aspect-square w-full block"
          />
        ) : (
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 550px"
            className="object-contain aspect-square"
            unoptimized={false}
          />
        )}
      </div>
    </div>
  );
};

export default ProductImage;
