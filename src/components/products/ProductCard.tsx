
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Calculate time left for deal
  useEffect(() => {
    if (!product.dealEnds) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const diff = new Date(product.dealEnds!).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [product.dealEnds]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // In a real app, this would call a wishlist service
  };

  const discountPercentage = Math.round(
    ((product.price.original - product.price.current) / product.price.original) * 100
  );

  return (
    <Card className={cn(
      "h-full transition-all duration-300 hover:shadow-md overflow-hidden group",
      featured && "animate-pulse-border border-2 border-primary/50"
    )}>
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-deal hover:bg-deal">
              {discountPercentage}% OFF
            </Badge>
          )}
          {product.dealType && (
            <Badge 
              className={cn(
                "absolute top-2 right-2",
                product.dealType === "flash" ? "bg-deal" : 
                product.dealType === "clearance" ? "bg-destructive" : "bg-accent"
              )}
            >
              {product.dealType === "flash" ? "Flash Deal" : 
               product.dealType === "clearance" ? "Clearance" : "Limited Time"}
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between">
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full"
              onClick={handleToggleWishlist}
            >
              <Heart className={cn("h-4 w-4", isWishlisted ? "fill-destructive text-destructive" : "")} />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base line-clamp-2 mb-1">{product.name}</h3>
          <div className="flex items-center mt-1">
            <span className="text-deal font-bold">${product.price.current.toFixed(2)}</span>
            {product.price.original > product.price.current && (
              <span className="price-original ml-2">${product.price.original.toFixed(2)}</span>
            )}
          </div>
          <div className="flex items-center mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-1">
              ({product.reviews})
            </span>
          </div>
          
          {timeLeft && (
            <div className="mt-2 countdown-timer">
              <Clock className="h-3 w-3" />
              <span>{timeLeft}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {product.stock < 10 && (
            <p className="text-sm text-destructive">
              Only {product.stock} left in stock!
            </p>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
