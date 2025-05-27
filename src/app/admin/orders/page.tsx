
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAppStore } from '@/hooks/use-app-store';
import type { Order } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

export default function AdminOrdersPage() {
  const ordersMap = useAppStore((state) => state.orders);
  const orders: Order[] = Object.values(ordersMap).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

  const getStatusVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'تم التسليم':
        return 'default'; // Green-like (primary in current theme)
      case 'تم الشحن':
      case 'في طريقها للتسليم':
        return 'secondary'; // Amber-like
      case 'قيد التجهيز':
      case 'تم تأكيد الطلب':
        return 'outline'; // Neutral
      default:
        return 'default';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-primary">
          لوحة تحكم الطلبات
        </h1>
        {orders.length > 0 ? (
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <Table>
              <TableCaption className="mt-4 text-lg">قائمة بجميع الطلبات المستلمة في المتجر.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right font-semibold text-lg">رقم الطلب</TableHead>
                  <TableHead className="text-right font-semibold text-lg">اسم العميل</TableHead>
                  <TableHead className="text-right font-semibold text-lg">تاريخ الطلب</TableHead>
                  <TableHead className="text-right font-semibold text-lg">الإجمالي</TableHead>
                  <TableHead className="text-right font-semibold text-lg">الحالة</TableHead>
                  <TableHead className="text-right font-semibold text-lg">طريقة الدفع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-md py-3">{order.id}</TableCell>
                    <TableCell className="text-md py-3">{order.customerName}</TableCell>
                    <TableCell className="text-md py-3">
                      {format(new Date(order.orderDate), 'PPPp', { locale: arSA })}
                    </TableCell>
                    <TableCell className="text-md py-3 font-semibold text-accent">{order.totalAmount.toFixed(2)} ر.س</TableCell>
                    <TableCell className="text-md py-3">
                      <Badge variant={getStatusVariant(order.status)} className="text-sm px-3 py-1">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-md py-3">
                      {order.paymentMethod === 'credit_card' ? 'بطاقة ائتمانية' : 'الدفع عند الاستلام'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive-x mx-auto text-muted-foreground mb-4"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-v-11"/><path d="m9.5 12.5 5 5"/><path d="m14.5 12.5-5 5"/></svg>
            <p className="text-xl text-foreground/70">
              لا توجد طلبات لعرضها حالياً.
            </p>
            <p className="text-md text-muted-foreground mt-2">
                عندما يقوم العملاء بإجراء طلبات، ستظهر هنا.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
