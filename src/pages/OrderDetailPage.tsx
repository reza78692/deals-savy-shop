
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getOrderById, cancelOrder } from "@/services/orderService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { toast } from "sonner";
import { AlertTriangle, Check, Truck, Package, X } from "lucide-react";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id || ''),
    enabled: !!id,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: () => cancelOrder(id || '', user?.id || ''),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['order', id] });
        queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
        toast.success('Order cancelled successfully');
      } else {
        toast.error(result.error?.message || 'Failed to cancel order');
      }
    },
    onError: () => {
      toast.error('An error occurred while cancelling the order');
    },
  });

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrderMutation.mutate();
    }
  };

  // Status icon mapping
  const statusIcons = {
    pending: <AlertTriangle className="h-6 w-6 text-amber-500" />,
    processing: <Package className="h-6 w-6 text-blue-500" />,
    shipped: <Truck className="h-6 w-6 text-purple-500" />,
    delivered: <Check className="h-6 w-6 text-green-500" />,
    cancelled: <X className="h-6 w-6 text-red-500" />,
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button asChild variant="ghost" size="sm" className="p-0 h-auto">
                <Link to="/orders">Orders</Link>
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">Order Details</span>
            </div>
            <h1 className="text-3xl font-bold">Order #{id?.slice(-8)}</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/profile">Back to Profile</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error || !order ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Order not found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find this order in our records.
            </p>
            <Button asChild>
              <Link to="/orders">View All Orders</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                  <div className="flex items-center gap-3">
                    {statusIcons[order.status as keyof typeof statusIcons]}
                    <div>
                      <p className="font-medium capitalize">{order.status}</p>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {format(new Date(order.updated_at || ''), 'PPp')}
                      </p>
                    </div>
                  </div>
                  
                  {order.tracking_number && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">Tracking Number</p>
                      <p className="font-mono">{order.tracking_number}</p>
                    </div>
                  )}
                  
                  {order.status === 'pending' || order.status === 'processing' ? (
                    <Button 
                      variant="destructive" 
                      className="mt-4" 
                      onClick={handleCancelOrder}
                      disabled={cancelOrderMutation.isPending}
                    >
                      {cancelOrderMutation.isPending ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Cancelling...
                        </>
                      ) : (
                        'Cancel Order'
                      )}
                    </Button>
                  ) : null}
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                  <div className="space-y-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 bg-muted rounded flex-shrink-0 flex items-center justify-center">
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
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          <div className="flex justify-between mt-1">
                            <p>${item.price.current.toFixed(2)}</p>
                            <p className="font-medium">
                              ${(item.price.current * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Details Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Date:</span>
                      <span>{format(new Date(order.created_at || ''), 'PP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Number:</span>
                      <span>#{id?.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold mb-3">Shipping Address</h3>
                  <address className="not-italic text-muted-foreground">
                    <p>{order.shipping_address.street}</p>
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                    </p>
                    <p>{order.shipping_address.country}</p>
                  </address>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about your order, please contact our customer support.
                </p>
                <Button className="w-full">Contact Support</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderDetailPage;
