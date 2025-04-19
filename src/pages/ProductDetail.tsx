
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Check, 
  Truck, 
  Clock, 
  RefreshCw,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselThumbnail 
} from "@/components/ui/carousel";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import CountdownTimer from "@/components/products/CountdownTimer";
import { useCart } from "@/hooks/useCart";
import { getProductById, getRelatedProducts } from "@/data/products";
import { Product } from "@/types/product";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    
    const fetchedProduct = getProductById(id);
    if (!fetchedProduct) {
      navigate("/not-found");
      return;
    }
    
    setProduct(fetchedProduct);
    setRelatedProducts(getRelatedProducts(id));
    // Reset quantity when product changes
    setQuantity(1);
  }, [id, navigate]);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-64 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // In a real app, this would call a wishlist service
  };

  const discountPercentage = Math.round(
    ((product.price.original - product.price.current) / product.price.original) * 100
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="pl-0">
            <Link to="/products">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <Carousel className="mb-4">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} - image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-2 gap-2">
                {product.images.map((image, index) => (
                  <CarouselThumbnail key={index} index={index}>
                    <div className="w-16 h-16 rounded-md overflow-hidden cursor-pointer border border-border hover:border-primary">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CarouselThumbnail>
                ))}
              </div>
            </Carousel>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {product.dealType && (
                <Badge 
                  className={
                    product.dealType === "flash" ? "bg-deal" : 
                    product.dealType === "clearance" ? "bg-destructive" : "bg-accent"
                  }
                >
                  {product.dealType === "flash" ? "Flash Deal" : 
                   product.dealType === "clearance" ? "Clearance" : "Limited Time"}
                </Badge>
              )}
              <Badge variant="outline">{product.category}</Badge>
            </div>

            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
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
              <span className="text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-deal">${product.price.current.toFixed(2)}</span>
                {product.price.original > product.price.current && (
                  <span className="price-original ml-3 text-lg">${product.price.original.toFixed(2)}</span>
                )}
              </div>
              {discountPercentage > 0 && (
                <div className="text-deal font-semibold mt-1">
                  You save: ${(product.price.original - product.price.current).toFixed(2)} ({discountPercentage}%)
                </div>
              )}
            </div>

            {product.dealEnds && (
              <div className="mb-6 p-3 bg-muted rounded-md">
                <div className="font-medium mb-1">Limited Time Offer:</div>
                <CountdownTimer endDate={product.dealEnds} />
              </div>
            )}

            <div className="mb-6">
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="mb-6 flex items-center">
              <div className="mr-4">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Availability</label>
                <div className={`flex items-center ${product.stock < 10 ? "text-destructive" : "text-primary"}`}>
                  <Check className="h-4 w-4 mr-1" />
                  {product.stock > 0
                    ? product.stock < 10
                      ? `Only ${product.stock} left in stock!`
                      : "In Stock"
                    : "Out of Stock"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Button className="gap-2" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant={isWishlisted ? "default" : "outline"}
                size="icon"
                className={isWishlisted ? "bg-destructive hover:bg-destructive/90" : ""}
                onClick={toggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Truck className="h-4 w-4 mr-2" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>Order within 12 hours for same-day dispatch</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>30-day hassle-free returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start mb-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4 border rounded-md">
              <h3 className="text-lg font-semibold mb-3">Product Description</h3>
              <p className="mb-4">{product.description}</p>
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>High-quality materials for long-lasting performance</li>
                <li>Engineered for maximum durability and user comfort</li>
                <li>Backed by our comprehensive warranty</li>
                <li>Designed with user feedback for optimal functionality</li>
              </ul>
            </TabsContent>
            <TabsContent value="specifications" className="p-4 border rounded-md">
              <h3 className="text-lg font-semibold mb-3">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">General</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Brand</span>
                      <span className="font-medium">Premium Brand</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">XYZ-123</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium capitalize">{product.category}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Warranty</span>
                      <span className="font-medium">2 Years</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Material</span>
                      <span className="font-medium">Premium</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-medium">1.2 kg</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions</span>
                      <span className="font-medium">24 x 12 x 8 cm</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Country of Origin</span>
                      <span className="font-medium">USA</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="p-4 border rounded-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <Button>Write a Review</Button>
              </div>
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-500"
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
                  <span className="font-semibold">4.7 out of 5</span>
                </div>
                <p className="text-muted-foreground">Based on {product.reviews} reviews</p>
              </div>
              <div className="space-y-6">
                <div className="pb-6 border-b">
                  <div className="flex justify-between mb-2">
                    <div className="font-semibold">John D.</div>
                    <div className="text-sm text-muted-foreground">2 days ago</div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < 5 ? "text-yellow-500" : "text-gray-300"}`}
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
                  <h4 className="font-medium mb-2">Amazing quality for the price!</h4>
                  <p>
                    This product exceeded my expectations. The quality is outstanding and it arrived
                    quickly. I would definitely purchase again and recommend to friends.
                  </p>
                </div>
                <div className="pb-6 border-b">
                  <div className="flex justify-between mb-2">
                    <div className="font-semibold">Sarah M.</div>
                    <div className="text-sm text-muted-foreground">1 week ago</div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < 4 ? "text-yellow-500" : "text-gray-300"}`}
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
                  <h4 className="font-medium mb-2">Good product, fast shipping</h4>
                  <p>
                    I'm very happy with my purchase. The product works exactly as described and
                    shipping was faster than expected. Would buy from this store again.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
