import { motion, AnimatePresence } from 'motion/react';
import { Clock, User, Hash, ChefHat, CheckCircle2, AlertCircle, MoreVertical } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const statusConfig = {
  new: {
    label: 'New',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    icon: <AlertCircle className="w-4 h-4" />
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: <ChefHat className="w-4 h-4" />
  },
  ready: {
    label: 'Ready',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    icon: <CheckCircle2 className="w-4 h-4" />
  }
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const timeElapsed = Math.floor((Date.now() - order.timestamp) / 60000);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full"
    >
      <Card className={cn(
        "h-full flex flex-col border-2 transition-all duration-300",
        order.status === 'new' && timeElapsed >= 5 ? "border-red-500 shadow-lg shadow-red-500/20" : "border-border/50",
        order.status === 'ready' ? "opacity-75 grayscale-[0.2]" : ""
      )}>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs font-bold px-2 py-0.5 bg-muted/50">
              #{order.orderNumber.split('-')[1]}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs font-bold px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
              {order.tableNumber}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8")}>
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusChange(order.id, 'new')}>Set to New</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(order.id, 'preparing')}>Set to Preparing</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(order.id, 'ready')}>Set to Ready</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-sm truncate">{order.customerName}</span>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex flex-col gap-0.5">
                <div className="flex items-start justify-between text-sm">
                  <span className="font-medium">
                    <span className="text-primary font-bold mr-2">{item.quantity}x</span>
                    {item.name}
                  </span>
                </div>
                {item.notes && (
                  <span className="text-[10px] text-muted-foreground italic ml-6 leading-tight">
                    Note: {item.notes}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{timeElapsed}m ago</span>
            </div>
            <Badge className={cn("flex items-center gap-1 px-2 py-0.5 border", statusConfig[order.status].color)}>
              {statusConfig[order.status].icon}
              {statusConfig[order.status].label}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            {order.status === 'new' && (
              <Button 
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                onClick={() => onStatusChange(order.id, 'preparing')}
              >
                Start Preparing
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button 
                className="col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                onClick={() => onStatusChange(order.id, 'ready')}
              >
                Mark as Ready
              </Button>
            )}
            {order.status === 'ready' && (
              <Button 
                variant="outline"
                className="col-span-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                disabled
              >
                Ready for Pickup
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
