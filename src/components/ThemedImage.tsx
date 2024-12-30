import Image from 'next/legacy/image';
import { useTheme } from '../context/ThemeContext';

interface ThemedImageProps {
  imageLight: string;
  imageDark: string;
  layout?: 'intrinsic' | 'fixed' | 'responsive' | 'fill';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  width?: number;
  height?: number;
  alt: string;
  onClick?: () => void;
}

const ThemedImage = ({ imageLight, imageDark, layout, objectFit, width, height, alt, onClick }: ThemedImageProps) => {
  const { isDarkMode } = useTheme();
  const imageUrl = isDarkMode ? imageDark : imageLight;

  return <Image src={imageUrl} width={width} height={height} layout={layout} objectFit={objectFit} alt={alt} onClick={onClick} />;
};

export default ThemedImage;