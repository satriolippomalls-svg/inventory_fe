import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStockMovements, getItems, getUsers } from '@/lib/storage';
import { StockMovement } from '@/types';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const Stock = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);

  useEffect(() => {
    const allMovements = getStockMovements();
    setMovements(allMovements.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  const getItemName = (itemId: string) => {
    const items = getItems();
    return items.find(i => i.id === itemId)?.name || 'Unknown';
  };

  const getUserName = (userId: string) => {
    const users = getUsers();
    return users.find(u => u.id === userId)?.name || 'Unknown';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Stock Movements</h1>
          <p className="text-muted-foreground">Track all inventory transactions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {movements.map(movement => (
                <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      movement.type === 'in' ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      {movement.type === 'in' ? (
                        <ArrowUp className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowDown className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{getItemName(movement.itemId)}</p>
                      <p className="text-sm text-muted-foreground">{movement.notes}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={movement.type === 'in' ? 'default' : 'destructive'}>
                      {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {getUserName(movement.userId)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(movement.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Stock;
