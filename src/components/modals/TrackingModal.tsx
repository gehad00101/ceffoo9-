
"use client";

import React, { useState, useEffect } from 'react';
import type { Order, OrderHistoryEntry } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/hooks/use-app-store";
import { X, ClipboardCheck, PackageOpen, Truck, PackageSearch, PackageCheck, Search } from "lucide-react";
import { Separator } from '../ui/separator';

const statusSteps: { name: Order['status']; icon: React.ElementType; label: string }[] = [
  { name: 'تم تأكيد الطلب', icon: ClipboardCheck, label: 'تم التأكيد' },
  { name: 'قيد التجهيز', icon: PackageOpen, label: 'قيد التجهيز' },
  { name: 'تم الشحن', icon: Truck, label: 'تم الشحن' },
  { name: 'في طريقها للتسليم', icon: PackageSearch, label: 'في الطريق' },
  { name: 'تم التسليم', icon: PackageCheck, label: 'تم التسليم' },
];

const IconMap: Record<string, React.ElementType> = {
  ClipboardCheck,
  PackageOpen,
  Truck,
  PackageSearch,
  PackageCheck,
};

export default function TrackingModal() {
  const { openModalType, closeModal, modalData, getOrderStatus, showAppToast } = useAppStore();
  const [orderIdInput, setOrderIdInput] = useState(modalData?.orderId || "");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (openModalType === 'tracking' && modalData?.orderId) {
      setOrderIdInput(modalData.orderId);
      handleTrackOrder(modalData.orderId);
    } else if (openModalType !== 'tracking') {
      // Reset when modal is closed or not a tracking modal
      setOrderIdInput("");
      setCurrentOrder(null);
    }
  }, [openModalType, modalData]);


  const handleTrackOrder = async (idToTrack?: string) => {
    const finalOrderId = idToTrack || orderIdInput;
    if (!finalOrderId.trim()) {
      showAppToast("الرجاء إدخال رقم الطلب.", "destructive");
      return;
    }
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const orderDetails = getOrderStatus(finalOrderId.trim());
    setCurrentOrder(orderDetails);
    setIsLoading(false);
    if (!orderDetails) {
      showAppToast(`لم يتم العثور على طلب بالرقم: ${finalOrderId}`, "destructive");
    }
  };
  
  const currentStatusIndex = currentOrder ? statusSteps.findIndex(step => step.name === currentOrder.status) : -1;
  const progressPercentage = currentOrder ? ((currentStatusIndex + 1) / statusSteps.length) * 100 : 0;

  if (openModalType !== 'tracking') return null;

  return (
    <Dialog open={openModalType === 'tracking'} onOpenChange={(isOpen) => { if (!isOpen) { closeModal(); setCurrentOrder(null); setOrderIdInput(''); } }}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-primary">تتبع الطلب</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">إغلاق</span>
          </DialogClose>
        </DialogHeader>

        <div className="p-1 md:p-3 space-y-6">
          <div className="flex gap-2 items-center">
            <Input 
              type="text" 
              id="order-id-input-modal"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="flex-grow p-3 text-base" 
              placeholder="مثال: ORD-123ABC"
            />
            <Button onClick={() => handleTrackOrder()} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3">
              {isLoading ? 'جاري البحث...' : <><Search className="me-2 h-5 w-5" /> تتبع</>}
            </Button>
          </div>

          {currentOrder && (
            <div className="bg-background p-4 rounded-lg border border-border shadow-sm space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-primary mb-1">طلب رقم: <span className="text-accent">{currentOrder.id}</span></h3>
                <p className="text-md text-muted-foreground">الحالة الحالية: <span className="font-semibold text-foreground">{currentOrder.status}</span></p>
                {currentOrder.estimatedDelivery && (
                  <p className="text-md text-muted-foreground">التسليم المتوقع: <span className="font-semibold text-foreground">{currentOrder.estimatedDelivery}</span></p>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">مراحل تقدم الطلب:</h4>
                <div className="flex justify-between items-start mb-2 relative">
                  {statusSteps.map((step, index) => (
                    <div key={step.name} className="flex flex-col items-center flex-1 relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2
                        ${index <= currentStatusIndex ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-border text-muted-foreground'}
                        transition-all duration-300 ease-in-out transform ${index === currentStatusIndex ? 'scale-110 ring-2 ring-primary ring-offset-2' : ''}
                      `}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <p className={`mt-2 text-xs text-center font-medium ${index <= currentStatusIndex ? 'text-primary' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {index < statusSteps.length -1 && (
                        <div className="absolute top-5 left-1/2 w-full h-1 bg-border -z-10">
                           <div 
                            className="h-full bg-primary transition-all duration-500 ease-in-out"
                            style={{ width: index < currentStatusIndex ? '100%' : (index === currentStatusIndex && currentOrder.status !== statusSteps[0].name ? '0%' : '0%') /* Refine for partial fill based on actual progress if available*/ }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                 <Progress value={progressPercentage} className="w-full h-2 mt-1" />
              </div>
              
              <Separator />

              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">تاريخ الطلب:</h4>
                <ul className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {currentOrder.history.slice().reverse().map((entry, index) => {
                    const IconComponent = IconMap[entry.icon] || PackageSearch; // Fallback icon
                    return (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 bg-accent/20 text-accent rounded-full">
                           <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{entry.description}</p>
                          <p className="text-xs text-muted-foreground">{entry.date}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
          {!currentOrder && !isLoading && orderIdInput && (
             <p className="text-center text-muted-foreground p-4">أدخل رقم طلب صحيح واضغط "تتبع" لعرض التفاصيل.</p>
          )}
           {!currentOrder && !isLoading && !orderIdInput && (
             <p className="text-center text-muted-foreground p-4">أدخل رقم الطلب أعلاه لتتبع حالته.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
