
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Tag, Star, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import ProductCard from "@/components/products/ProductCard";
import CountdownTimer from "@/components/products/CountdownTimer";
import { 
  getFeaturedProducts, 
  getProductsByDealType 
} from "@/services/productService";
import { Product } from "@/types/product";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [clearanceDeals, setClearanceDeals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const [featured, flash, clearance] = await Promise.all([
          getFeaturedProducts(),
          getProductsByDealType("flash"),
          getProductsByDealType("clearance")
        ]);
        
        setFeaturedProducts(featured);
        setFlashDeals(flash);
        setClearanceDeals(clearance);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Incredible Deals on Premium Products
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Discover amazing discounts on top-quality items across all categories.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/deals/flash">Shop Flash Deals</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/products">Browse All Products</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Deals Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Zap className="h-6 w-6 text-deal mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold">Flash Deals</h2>
            </div>
            <Button asChild variant="ghost" className="gap-1">
              <Link to="/deals/flash">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {flashDeals.length > 0 && (
                <div className="mb-8 bg-muted rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-deal mr-2" />
                    <span className="font-medium">These deals are going fast! Ending soon:</span>
                  </div>
                  {flashDeals[0].dealEnds && (
                    <CountdownTimer 
                      endDate={flashDeals[0].dealEnds} 
                      className="text-deal font-mono"
                    />
                  )}
                </div>
              )}

              <div className="mb-12">
                <Carousel>
                  <CarouselContent>
                    {flashDeals.map((product) => (
                      <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <div className="p-1">
                          <ProductCard product={product} featured={true} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/category/electronics" className="group">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:translate-y-[-4px]">
                <div className="aspect-square relative bg-primary/10 flex items-center justify-center">
                  <div className="text-4xl">🎧</div>
                </div>
                <div className="p-4 text-center font-medium">Electronics</div>
              </div>
            </Link>
            <Link to="/category/fashion" className="group">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:translate-y-[-4px]">
                <div className="aspect-square relative bg-secondary/10 flex items-center justify-center">
                  <div className="text-4xl">👕</div>
                </div>
                <div className="p-4 text-center font-medium">Fashion</div>
              </div>
            </Link>
            <Link to="/category/home" className="group">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:translate-y-[-4px]">
                <div className="aspect-square relative bg-accent/10 flex items-center justify-center">
                  <div className="text-4xl">🏠</div>
                </div>
                <div className="p-4 text-center font-medium">Home & Garden</div>
              </div>
            </Link>
            <Link to="/category/toys" className="group">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:translate-y-[-4px]">
                <div className="aspect-square relative bg-destructive/10 flex items-center justify-center">
                  <div className="text-4xl">🎮</div>
                </div>
                <div className="p-4 text-center font-medium">Toys & Games</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-accent mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            </div>
            <Button asChild variant="ghost" className="gap-1">
              <Link to="/products">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <Tabs defaultValue="all" className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All Featured</TabsTrigger>
                <TabsTrigger value="flash">Flash Deals</TabsTrigger>
                <TabsTrigger value="clearance">Clearance</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <ProductGrid products={featuredProducts} featured={true} />
              </TabsContent>
              <TabsContent value="flash" className="mt-6">
                <ProductGrid 
                  products={featuredProducts.filter(p => p.dealType === "flash")}
                  featured={true}
                />
              </TabsContent>
              <TabsContent value="clearance" className="mt-6">
                <ProductGrid 
                  products={featuredProducts.filter(p => p.dealType === "clearance")}
                  featured={true}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* Clearance Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-destructive/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Tag className="h-6 w-6 text-destructive mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold">Clearance Sale</h2>
            </div>
            <Button asChild variant="ghost" className="gap-1">
              <Link to="/deals/clearance">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <ProductGrid products={clearanceDeals.slice(0, 4)} />
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Get the Latest Deals First
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new arrivals,
            flash sales, and exclusive discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 border rounded-md flex-grow"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
