
import { useAuth } from "@/hooks/useAuth";
import { getUserOrders } from "@/services/orderService";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";

const OrdersPage = () => {
  const { user } = useAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => getUserOrders(user?.id || ''),
    enabled: !!user,
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Button asChild variant="outline">
            <Link to="/profile">Back to Profile</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">There was a problem loading your orders.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : data?.orders && data.orders.length > 0 ? (
          <div className="space-y-6">
            {data.orders.map((order) => (
              <div 
                key={order.id} 
                className="border rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b bg-muted/30">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Order Placed</span>
                      <p className="font-medium">
                        {order.created_at ? format(new Date(order.created_at), 'PP') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total</span>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Order #</span>
                      <p className="font-medium">{order.id?.slice(-8) || 'N/A'}</p>
                    </div>
                    <div className="md:text-right">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <p className={`font-medium capitalize
                        ${order.status === 'delivered' ? 'text-green-600' : 
                         order.status === 'shipped' ? 'text-blue-600' :
                         order.status === 'processing' ? 'text-amber-600' :
                         order.status === 'cancelled' ? 'text-red-600' : ''}`}
                      >
                        {order.status}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                          {item.images && item.images[0] ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-muted-foreground">No image</span>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm">${item.price.current.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 border-t bg-muted/30 flex justify-end">
                  <Button asChild>
                    <Link to={`/orders/${order.id}`}>View Order Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
