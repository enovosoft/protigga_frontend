import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

const ImageFallback = ({
  icon: IconComponent = ImageIcon,
  text = "",
  className = "",
  src,
  alt = "",
  hasError = false,
  onError,
}) => {
  const [internalError, setInternalError] = useState(false);

  // Use external error state or internal error state
  const showFallback = hasError || internalError;

  const handleImageError = () => {
    setInternalError(true);
    if (onError) {
      onError();
    }
  };

  if (src && !showFallback) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(`w-full h-full object-cover aspect-auto `, className)}
        onError={handleImageError}
      />
    );
  }

  return (
    <div
      className={cn(
        `w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 min-h-50`,
        className
      )}
    >
      <div className="text-center p-4">
        <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center">
          <IconComponent className="w-8 h-8 text-primary/60" />
        </div>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    </div>
  );
};

export default ImageFallback;
