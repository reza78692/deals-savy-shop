
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Zap, 
  Tag, 
  ShoppingBag, 
  Heart, 
  User, 
  LogIn,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  // For future implementation with authentication
  const isLoggedIn = false;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-40 pt-16 overflow-y-auto md:hidden">
      <div className="container px-4 py-6 flex flex-col space-y-6">
        <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link to="/deals/flash" className="flex items-center space-x-2" onClick={onClose}>
          <Zap className="h-5 w-5" />
          <span>Flash Deals</span>
        </Link>

        <Link to="/deals/clearance" className="flex items-center space-x-2" onClick={onClose}>
          <Tag className="h-5 w-5" />
          <span>Clearance</span>
        </Link>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="categories">
            <AccordionTrigger className="flex items-center space-x-2 py-0">
              <ShoppingBag className="h-5 w-5 mr-2" />
              <span>Categories</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-3 pl-7 mt-2">
                <Link to="/category/electronics" className="hover:text-primary" onClick={onClose}>
                  Electronics
                </Link>
                <Link to="/category/fashion" className="hover:text-primary" onClick={onClose}>
                  Fashion
                </Link>
                <Link to="/category/home" className="hover:text-primary" onClick={onClose}>
                  Home & Garden
                </Link>
                <Link to="/category/toys" className="hover:text-primary" onClick={onClose}>
                  Toys & Games
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Link to="/wishlist" className="flex items-center space-x-2" onClick={onClose}>
          <Heart className="h-5 w-5" />
          <span>Wishlist</span>
        </Link>

        {isLoggedIn ? (
          <>
            <Link to="/account/profile" className="flex items-center space-x-2" onClick={onClose}>
              <User className="h-5 w-5" />
              <span>My Account</span>
            </Link>
            <Button variant="destructive" onClick={onClose}>
              Sign Out
            </Button>
          </>
        ) : (
          <Link to="/login" onClick={onClose}>
            <Button className="w-full flex items-center justify-center">
              <LogIn className="h-5 w-5 mr-2" />
              <span>Sign In</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
