
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import { products, searchProducts, getProductsByCategory } from "@/data/products";
import { Product } from "@/types/product";

// Get unique categories from products
const categories = [...new Set(products.map((product) => product.category))];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  
  const initialCategory = searchParams.get("category");
  const initialSearch = searchParams.get("search");

  useEffect(() => {
    setSearchTerm(initialSearch || "");
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory, initialSearch]);

  useEffect(() => {
    let result = [...products];
    
    // Filter by search term
    if (searchTerm) {
      result = searchProducts(searchTerm);
    }
    
    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((product) => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Filter by price range
    result = result.filter(
      (product) => 
        product.price.current >= priceRange[0] && 
        product.price.current <= priceRange[1]
    );
    
    // Sort products
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price.current - b.price.current);
        break;
      case "price-high":
        result.sort((a, b) => b.price.current - a.price.current);
        break;
      case "newest":
        // In a real app, this would sort by date added
        result.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
      case "discount":
        result.sort((a, b) => b.discount - a.discount);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'featured' is default
        result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategories, priceRange, sortBy]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked 
        ? [...prev, category] 
        : prev.filter(c => c !== category)
    );
  };

  const handleClearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedCategories([]);
    setSearchTerm("");
    setSortBy("featured");
    setSearchParams({});
  };

  const handleSort = (value: string) => {
    setSortBy(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL search parameters
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  // Calculate max price for the range slider
  const maxPrice = Math.max(...products.map(p => p.price.current));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">All Products</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="discount">Biggest Discount</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="sm:w-[120px] gap-2 md:hidden">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filter Products</SheetTitle>
                  <SheetDescription>
                    Apply filters to narrow down your product search.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <SlidersHorizontal className="h-4 w-4 mr-1" />
                      Price Range
                    </h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={Math.ceil(maxPrice)}
                        step={5}
                        value={priceRange}
                        onValueChange={setPriceRange as (value: number[]) => void}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <Checkbox
                            id={`category-mobile-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => 
                              handleCategoryChange(category, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`category-mobile-${category}`}
                            className="ml-2 text-sm capitalize"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleClearFilters} variant="outline" className="w-full gap-2">
                      <X className="h-4 w-4" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-8">
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-1" />
                  Price Range
                </h3>
                <div className="px-2">
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={Math.ceil(maxPrice)}
                    step={5}
                    value={priceRange}
                    onValueChange={setPriceRange as (value: number[]) => void}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="ml-2 text-sm capitalize"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Button onClick={handleClearFilters} variant="outline" className="w-full gap-2">
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-grow">
            {/* Active filters */}
            {(selectedCategories.length > 0 || 
              searchTerm || 
              priceRange[0] > 0 || 
              priceRange[1] < maxPrice) && (
              <div className="mb-4 p-3 bg-muted rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium">Active Filters:</span>
                    
                    {selectedCategories.map(category => (
                      <Button
                        key={category}
                        variant="secondary"
                        size="sm"
                        className="h-7 gap-1 capitalize"
                        onClick={() => handleCategoryChange(category, false)}
                      >
                        {category}
                        <X className="h-3 w-3" />
                      </Button>
                    ))}
                    
                    {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 gap-1"
                        onClick={() => setPriceRange([0, maxPrice])}
                      >
                        ${priceRange[0]} - ${priceRange[1]}
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {searchTerm && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 gap-1"
                        onClick={() => {
                          setSearchTerm("");
                          const params = new URLSearchParams(searchParams);
                          params.delete("search");
                          setSearchParams(params);
                        }}
                      >
                        "{searchTerm}"
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7"
                    onClick={handleClearFilters}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}
            
            {/* Results count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
            
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
