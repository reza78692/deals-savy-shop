
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserOrders } from "@/services/orderService";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";

const profileSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Load user orders
  const { data: orderData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => getUserOrders(user?.id || ''),
    enabled: !!user,
  });

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || "",
      name: user?.user_metadata?.name || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    console.log(values);
    // Here you would update the user profile through Supabase
  };

  const onPasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    console.log(values);
    // Here you would update the user password through Supabase
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Account Menu</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <Button 
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="justify-start rounded-none h-12"
                    onClick={() => setActiveTab("profile")}
                  >
                    Profile
                  </Button>
                  <Button 
                    variant={activeTab === "orders" ? "default" : "ghost"}
                    className="justify-start rounded-none h-12"
                    onClick={() => setActiveTab("orders")}
                  >
                    Orders
                  </Button>
                  <Button 
                    variant={activeTab === "security" ? "default" : "ghost"}
                    className="justify-start rounded-none h-12"
                    onClick={() => setActiveTab("security")}
                  >
                    Security
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form 
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)} 
                      className="space-y-6"
                    >
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and track your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <div className="flex justify-center py-8">
                      <Spinner />
                    </div>
                  ) : orderData?.orders && orderData.orders.length > 0 ? (
                    <div className="space-y-4">
                      {orderData.orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                            <div>
                              <div className="font-medium">Order #{order.id?.slice(-8)}</div>
                              <div className="text-sm text-muted-foreground">
                                Placed on {format(new Date(order.created_at || ''), 'PPP')}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div 
                                className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                  ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                   order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                   order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                   order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                   'bg-gray-100 text-gray-800'}`}
                              >
                                {order.status}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                            <div>
                              <div className="text-sm">{order.items.length} items</div>
                              <div className="font-medium">${order.total.toFixed(2)}</div>
                            </div>
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/orders/${order.id}`}>View Order</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                      <Button asChild>
                        <Link to="/products">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form 
                      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} 
                      className="space-y-6"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">Update Password</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
