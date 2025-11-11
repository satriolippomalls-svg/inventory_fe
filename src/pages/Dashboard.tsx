import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getItems, getStockMovements } from '@/lib/storage';
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    stockIn: 0,
    stockOut: 0,
  });

  useEffect(() => {
    const items = getItems();
    const movements = getStockMovements();
    
    const today = new Date().setHours(0, 0, 0, 0);
    const todayMovements = movements.filter(m => 
      new Date(m.createdAt).setHours(0, 0, 0, 0) === today
    );

    setStats({
      totalItems: items.reduce((sum, item) => sum + item.amount, 0),
      lowStockItems: items.filter(item => item.amount < item.minStock).length,
      stockIn: todayMovements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0),
      stockOut: todayMovements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0),
    });
  }, []);

  const chartData = [
    { name: 'Mon', in: 65, out: 28 },
    { name: 'Tue', in: 59, out: 48 },
    { name: 'Wed', in: 80, out: 40 },
    { name: 'Thu', in: 81, out: 56 },
    { name: 'Fri', in: 56, out: 33 },
    { name: 'Sat', in: 55, out: 42 },
    { name: 'Sun', in: 40, out: 30 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your inventory</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-muted-foreground">In stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Items below minimum</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Stock In</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+{stats.stockIn}</div>
              <p className="text-xs text-muted-foreground">Items received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Stock Out</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">-{stats.stockOut}</div>
              <p className="text-xs text-muted-foreground">Items dispatched</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Stock Movement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="in" fill="hsl(var(--success))" />
                  <Bar dataKey="out" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="in" stroke="hsl(var(--success))" strokeWidth={2} />
                  <Line type="monotone" dataKey="out" stroke="hsl(var(--destructive))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
