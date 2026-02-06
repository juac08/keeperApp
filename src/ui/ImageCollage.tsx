import React from "react";
import { Box, Image } from "@chakra-ui/react";

type CollageImage = {
  src: string;
  alt: string;
  rotate?: string;
  top: string;
  left: string;
  width: string;
  height: string;
};

type Props = {
  images: CollageImage[];
};

const ImageCollage: React.FC<Props> = ({ images }) => {
  return (
    <Box position="relative" minH={{ base: "220px", md: "280px" }}>
      {images.map((image, index) => (
        <Image
          key={`${image.src}-${index}`}
          src={image.src}
          alt={image.alt}
          position="absolute"
          top={image.top}
          left={image.left}
          w={image.width}
          h={image.height}
          objectFit="cover"
          borderRadius="2xl"
          boxShadow="0 18px 40px rgba(15, 23, 42, 0.18)"
          border="1px solid"
          borderColor="border.muted"
          transform={image.rotate ? `rotate(${image.rotate})` : undefined}
        />
      ))}
    </Box>
  );
};

export default ImageCollage;
