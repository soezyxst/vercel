import { Image, type ImageProps } from "@chakra-ui/react";

const CloImage = ({ src, alt = "", ...props }: ImageProps) => {
  return (
    <Image
      src={src ? "https://res.cloudinary.com/dnbfcoads/image/upload/" + src : "/orpheus.jpg"}
      alt={alt}
      {...props}
    />
  );
};

export default CloImage;