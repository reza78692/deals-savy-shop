
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  AlertCircle, 
  Tag, 
  CreditCard,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");

  const shippingCost = cartItems.length > 0 ? 9.99 : 0;
  const subtotal = getCartTotal();
  const total = subtotal + shippingCost;

  const isOutOfStock = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    return item && item.stock === 0;
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    
    toast.error("Invalid or expired coupon code");
    setCouponCode("");
  };

  const handleCheckout = () => {
    toast.success("Redirecting to checkout...");
    // In a real app, this would redirect to the checkout page
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="text-center py-12">
            <div className="mb-4">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild size="lg">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                <CardDescription>
                  Review and update your items before checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Cart Items Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id} className={isOutOfStock(item.id) ? "bg-destructive/10" : ""}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="relative w-16 h-16 mr-4 rounded overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={item.images[0] || "/placeholder.svg"}
                                  alt={item.name}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div>
                                <Link to={`/product/${item.id}`} className="font-medium hover:text-primary">
                                  {item.name}
                                </Link>
                                {isOutOfStock(item.id) && (
                                  <div className="text-destructive text-sm flex items-center mt-1">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Out of stock
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <div className="font-medium">${item.price.current.toFixed(2)}</div>
                              {item.price.original > item.price.current && (
                                <div className="text-muted-foreground text-sm line-through">
                                  ${item.price.original.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <span className="w-10 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${(item.price.current * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                    <Button variant="ghost" onClick={() => clearCart()}>
                      Clear Cart
                    </Button>
                  </div>
                  
                  <div className="flex">
                    <Input
                      type="text"
                      placeholder="Coupon code"
                      className="w-36 sm:w-48 rounded-r-none"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button 
                      className="rounded-l-none gap-1" 
                      onClick={handleApplyCoupon}
                    >
                      <Tag className="h-4 w-4" />
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Complete your purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Alert className="mt-4 bg-muted">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Your transaction is secured with SSL encryption
                    </AlertDescription>
                  </div>
                </Alert>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button
                  size="lg"
                  className="w-full mb-3 gap-1"
                  onClick={handleCheckout}
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Checkout
                </Button>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="payment-methods">
                    <AccordionTrigger className="text-sm">
                      Accepted Payment Methods
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2 justify-center py-2">
                        <div className="bg-muted px-3 py-1 rounded text-xs font-medium">Visa</div>
                        <div className="bg-muted px-3 py-1 rounded text-xs font-medium">Mastercard</div>
                        <div className="bg-muted px-3 py-1 rounded text-xs font-medium">American Express</div>
                        <div className="bg-muted px-3 py-1 rounded text-xs font-medium">PayPal</div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
