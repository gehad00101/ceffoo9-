"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/hooks/use-app-store";
import { Copy, X } from "lucide-react";

export default function ConfirmationModal() {
  const { openModalType, closeModal, modalData, showAppToast, openModal } = useAppStore();
  const orderId = modalData?.orderId;

  const handleCopyToClipboard = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId)
        .then(() => showAppToast("تم نسخ رقم الطلب!"))
        .catch(() => showAppToast("فشل نسخ رقم الطلب.", "destructive"));
    }
  };

  const handleContinueShopping = () => {
    closeModal();
  };

  const handleTrackOrder = () => {
    closeModal();
    openModal('tracking', { orderId });
  };
  
  if (openModalType !== 'confirmation') return null;

  return (
    <Dialog open={openModalType === 'confirmation'} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-green-700">تم الشراء بنجاح!</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">إغلاق</span>
          </DialogClose>
        </DialogHeader>
        <div className="p-6 text-center space-y-4">
          <p className="text-lg text-muted-foreground">شكراً لك على طلبك. سيتم تجهيز طلبك وشحنه قريباً.</p>
          {orderId && (
            <div className="text-xl font-bold text-primary mb-6 flex items-center justify-center">
              رقم طلبك: <span className="text-accent mx-2" id="order-id-display">{orderId}</span>
              <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} className="h-8 w-8">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button 
              onClick={handleContinueShopping}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            >
              متابعة التسوق
            </Button>
            {orderId && (
               <Button 
                onClick={handleTrackOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
              >
                تتبع طلبي
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}