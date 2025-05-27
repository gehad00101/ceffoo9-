"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';
import { useAppStore } from "@/hooks/use-app-store";
import { MinusCircle, PlusCircle, Trash2, X } from "lucide-react";

export default function CartModal() {
  const { 
    cart, 
    removeFromCart, 
    updateCartItemQuantity, 
    cartTotal, 
    cartItemCount,
    openModalType,
    closeModal,
    openModal 
  } = useAppStore();

  const total = cartTotal();
  const itemCount = cartItemCount();

  const handleCheckout = () => {
    closeModal(); // Close cart modal
    openModal('checkout'); // Open checkout modal
  };

  if (openModalType !== 'cart') return null;

  return (
    <Dialog open={openModalType === 'cart'} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent className="sm:max-w-[525px] bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-3xl font-bold text-center text-primary">سلة التسوق</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">إغلاق</span>
          </DialogClose>
        </DialogHeader>
        
        {itemCount === 0 ? (
          <p className="text-center text-lg text-muted-foreground py-10">سلتك فارغة حالياً.</p>
        ) : (
          <ScrollArea className="max-h-[60vh] md:max-h-[400px] mb-6 pr-3">
            {cart.map((item) => (
              <div key={item.id} className="mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden">
                    <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" data-ai-hint={item.dataAiHint || 'product'} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} ر.س</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>
                        <MinusCircle size={20} />
                      </Button>
                      <span className="text-lg font-bold w-6 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>
                        <PlusCircle size={20} />
                      </Button>
                    </div>
                     <span className="text-md font-bold text-accent">{(item.price * item.quantity).toFixed(2)} ر.س</span>
                  </div>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={18} />
                  </Button>
                </div>
                <Separator className="my-3" />
              </div>
            ))}
          </ScrollArea>
        )}
        
        {itemCount > 0 && (
          <DialogFooter className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t">
            <div className="text-2xl font-bold text-primary mb-4 sm:mb-0">
              الإجمالي: <span className="text-accent">{total.toFixed(2)}</span> ر.س
            </div>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
              onClick={handleCheckout}
              disabled={itemCount === 0}
            >
              إتمام الشراء
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}