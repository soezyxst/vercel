import { Flex, Link } from "@chakra-ui/react";
import { CldImage } from "next-cloudinary";
import { FiDownload } from "react-icons/fi";

interface DownloadableImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

const DownloadableImage = ({
  src,
  alt = "",
  height = 200,
  width = 200,
}: DownloadableImageProps) => {
  return (
    <Flex position="relative">
      <Link
        href={`https://res.cloudinary.com/dnbfcoads/image/upload/${src}`}
        target="_blank"
      >
        <CldImage alt={alt} src={src} width={width} height={height} />
      </Link>
      <Link
        href={`https://res.cloudinary.com/dnbfcoads/image/upload/fl_attachment/${src}`}
        download
        position="absolute"
        inset={`4px auto auto ${width - 30}px`}
        backgroundColor="rgba(0, 0, 0, .3)"
        padding=".25rem"
        rounded="full"
      >
        <FiDownload />
      </Link>
    </Flex>
  );
};

export default DownloadableImage;
