
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from "react"; // Import useState
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
  AlertDialogTrigger,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/hooks/use-app-store";
import { CreditCard, Truck, X } from "lucide-react";

const checkoutFormSchema = z.object({
  customerName: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل." }),
  customerEmail: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }),
  customerAddress: z.string().min(10, { message: "العنوان يجب أن يكون 10 أحرف على الأقل." }),
  customerPhone: z.string().regex(/^(\+966|0)?5\d{8}$/, { message: "الرجاء إدخال رقم هاتف سعودي صحيح (مثال: 05xxxxxxxx أو +9665xxxxxxxx)." }),
  paymentMethod: z.enum(['credit_card', 'cash_on_delivery'], {
    required_error: "الرجاء اختيار طريقة الدفع.",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutModal() {
  const { openModalType, closeModal, placeOrder, showAppToast, openModal } = useAppStore();
  const [isConfirming, setIsConfirming] = useState(false); // State for AlertDialog
  const [formData, setFormData] = useState<CheckoutFormValues | null>(null);


  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerAddress: "",
      customerPhone: "",
      paymentMethod: undefined,
    },
  });

  const handleActualSubmit = (data: CheckoutFormValues) => {
    try {
      const orderDetails = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerAddress: data.customerAddress,
        customerPhone: data.customerPhone,
        paymentMethod: data.paymentMethod,
      };
      const orderId = placeOrder(orderDetails);
      showAppToast("تم تأكيد طلبك بنجاح!");
      closeModal(); // Close checkout modal
      form.reset(); // Reset form fields
      openModal('confirmation', { orderId }); // Open confirmation modal
    } catch (error) {
      showAppToast("حدث خطأ أثناء تأكيد الطلب. الرجاء المحاولة مرة أخرى.", "destructive");
      console.error("Checkout error:", error);
    }
    setIsConfirming(false); // Close AlertDialog
  };

  // This function is called when the form is submitted
  const onSubmit = (data: CheckoutFormValues) => {
    setFormData(data); // Store form data
    setIsConfirming(true); // Open the AlertDialog
  };
  
  if (openModalType !== 'checkout') return null;

  return (
    <Dialog open={openModalType === 'checkout'} onOpenChange={(isOpen) => { if (!isOpen) { closeModal(); setIsConfirming(false); }}}>
      <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-primary">معلومات الشحن والدفع</DialogTitle>
           <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">إغلاق</span>
          </DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-2">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">الاسم الكامل:</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: محمد عبدالله" {...field} className="p-3 text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">البريد الإلكتروني:</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@mail.com" {...field} className="p-3 text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">العنوان:</FormLabel>
                  <FormControl>
                    <Textarea placeholder="المدينة، الحي، الشارع، رقم المبنى" rows={3} {...field} className="p-3 text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">رقم الهاتف:</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="05xxxxxxxx" {...field} className="p-3 text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-semibold">طريقة الدفع:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 rtl:space-x-reverse"
                    >
                      <FormItem className="flex items-center space-x-2 rtl:space-x-reverse p-3 border rounded-lg hover:bg-accent/10 has-[:checked]:bg-accent/20 has-[:checked]:border-accent transition-all">
                        <FormControl>
                          <RadioGroupItem value="credit_card" />
                        </FormControl>
                        <FormLabel className="font-normal text-base cursor-pointer flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-primary" />
                          بطاقة ائتمانية
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 rtl:space-x-reverse p-3 border rounded-lg hover:bg-accent/10 has-[:checked]:bg-accent/20 has-[:checked]:border-accent transition-all">
                        <FormControl>
                          <RadioGroupItem value="cash_on_delivery" />
                        </FormControl>
                        <FormLabel className="font-normal text-base cursor-pointer flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary" />
                          الدفع عند الاستلام
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
                {/* This button now triggers the AlertDialog */}
                <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">
                  تأكيد الشراء
                </Button>
            </DialogFooter>
          </form>
        </Form>

        {/* AlertDialog for pre-purchase confirmation */}
        <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد عملية الشراء</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من أنك تريد إتمام عملية الشراء؟ لا يمكن التراجع عن هذا الإجراء بعد التأكيد.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsConfirming(false)}>إلغاء</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  if (formData) {
                    handleActualSubmit(formData);
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                تأكيد
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </DialogContent>
    </Dialog>
  );
}
