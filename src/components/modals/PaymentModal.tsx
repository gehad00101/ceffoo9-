
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppStore } from "@/hooks/use-app-store";
import { CreditCard, Truck, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";


const paymentFormSchema = z.object({
  paymentMethod: z.enum(['credit_card', 'cash_on_delivery'], {
    required_error: "الرجاء اختيار طريقة الدفع.",
  }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function PaymentModal() {
  const { 
    openModalType, 
    closeModal, 
    placeOrder, 
    showAppToast, 
    openModal, 
    modalData,
    cart,
    cartTotal
  } = useAppStore();

  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'credit_card' | 'cash_on_delivery' | undefined>(undefined);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: undefined,
    },
  });

  const customerDetails = modalData?.customerDetails;
  const totalAmount = modalData?.totalAmount ?? cartTotal();


  useEffect(() => {
    if (openModalType === 'payment') {
      form.reset({ paymentMethod: undefined }); // Reset form when modal opens
      setSelectedPaymentMethod(undefined);
    }
  }, [openModalType, form]);


  const handleActualSubmit = (data: PaymentFormValues) => {
    if (!customerDetails) {
      showAppToast("خطأ: معلومات العميل مفقودة.", "destructive");
      setIsConfirming(false);
      return;
    }
    try {
      const orderPayload = {
        customerName: customerDetails.customerName,
        customerEmail: customerDetails.customerEmail,
        customerAddress: customerDetails.customerAddress,
        customerPhone: customerDetails.customerPhone,
        paymentMethod: data.paymentMethod,
      };
      const orderId = placeOrder(orderPayload);
      showAppToast("تم تأكيد طلبك بنجاح!");
      closeModal(); 
      form.reset(); 
      openModal('confirmation', { orderId }); 
    } catch (error) {
      showAppToast("حدث خطأ أثناء تأكيد الطلب. الرجاء المحاولة مرة أخرى.", "destructive");
      console.error("Payment error:", error);
    }
    setIsConfirming(false); 
  };

  const onSubmit = (data: PaymentFormValues) => {
    setIsConfirming(true);
  };

  if (openModalType !== 'payment' || !customerDetails) return null;

  return (
    <Dialog open={openModalType === 'payment'} onOpenChange={(isOpen) => { if (!isOpen) { closeModal(); setIsConfirming(false); }}}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-primary">اختر طريقة الدفع</DialogTitle>
           <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">إغلاق</span>
          </DialogClose>
        </DialogHeader>

        <div className="p-2 space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-primary mb-2">ملخص الطلب</h4>
            {cart.slice(0,2).map(item => (
                 <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{(item.price * item.quantity).toFixed(2)} ر.س</span>
                </div>
            ))}
            {cart.length > 2 && <p className="text-sm text-muted-foreground text-center">... ومنتجات أخرى</p>}
            <Separator className="my-2" />
            <div className="flex justify-between text-xl font-bold text-primary">
              <span>الإجمالي:</span>
              <span>{totalAmount.toFixed(2)} ر.س</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-semibold text-primary">طرق الدفع المتاحة:</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 gap-3">
                        <div
                          className={cn(
                            "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                            field.value === 'credit_card' ? "border-primary ring-2 ring-primary bg-primary/5" : "border-border"
                          )}
                          onClick={() => {
                            field.onChange('credit_card');
                            setSelectedPaymentMethod('credit_card');
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-8 w-8 text-primary" />
                            <span className="text-lg font-medium text-foreground">بطاقة ائتمانية</span>
                          </div>
                          {field.value === 'credit_card' && <CheckCircle className="h-6 w-6 text-green-600" />}
                        </div>

                        <div
                          className={cn(
                            "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                            field.value === 'cash_on_delivery' ? "border-primary ring-2 ring-primary bg-primary/5" : "border-border"
                          )}
                          onClick={() => {
                             field.onChange('cash_on_delivery');
                             setSelectedPaymentMethod('cash_on_delivery');
                            }}
                        >
                          <div className="flex items-center gap-3">
                            <Truck className="h-8 w-8 text-primary" />
                            <span className="text-lg font-medium text-foreground">الدفع عند الاستلام</span>
                          </div>
                          {field.value === 'cash_on_delivery' && <CheckCircle className="h-6 w-6 text-green-600" />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                    disabled={!selectedPaymentMethod}
                    >
                    إتمام عملية الدفع
                  </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>

        <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد عملية الشراء</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من أنك تريد إتمام عملية الشراء والدفع؟
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsConfirming(false)}>إلغاء</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  const paymentData = form.getValues();
                  if (paymentData.paymentMethod) { // Ensure payment method is selected
                    handleActualSubmit(paymentData);
                  } else {
                    showAppToast("الرجاء اختيار طريقة الدفع أولاً.", "destructive");
                    setIsConfirming(false);
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                تأكيد والدفع
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </DialogContent>
    </Dialog>
  );
}
