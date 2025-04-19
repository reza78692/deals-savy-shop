
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <p className="text-muted-foreground mb-4">
              Manage your store's products, add new items, update inventory.
            </p>
            <Button asChild>
              <Link to="/admin/products">Manage Products</Link>
            </Button>
          </div>
          
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <p className="text-muted-foreground mb-4">
              View and manage customer orders, update shipping status.
            </p>
            <Button asChild>
              <Link to="/admin/orders">Manage Orders</Link>
            </Button>
          </div>
          
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Customers</h2>
            <p className="text-muted-foreground mb-4">
              View customer information and purchase history.
            </p>
            <Button asChild>
              <Link to="/admin/customers">Manage Customers</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
