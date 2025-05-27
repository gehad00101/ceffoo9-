"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { useAppStore } from "@/hooks/use-app-store";
import { X } from "lucide-react";

const checkoutFormSchema = z.object({
  customerName: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل." }),
  customerEmail: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }),
  customerAddress: z.string().min(10, { message: "العنوان يجب أن يكون 10 أحرف على الأقل." }),
  customerPhone: z.string().regex(/^(\+966|0)?5\d{8}$/, { message: "الرجاء إدخال رقم هاتف سعودي صحيح (مثال: 05xxxxxxxx أو +9665xxxxxxxx)." }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutModal() {
  const { openModalType, closeModal, placeOrder, showAppToast, openModal } = useAppStore();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerAddress: "",
      customerPhone: "",
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    try {
      const orderId = placeOrder(data);
      showAppToast("تم تأكيد طلبك بنجاح!");
      closeModal(); // Close checkout modal
      form.reset(); // Reset form fields
      openModal('confirmation', { orderId }); // Open confirmation modal
    } catch (error) {
      showAppToast("حدث خطأ أثناء تأكيد الطلب. الرجاء المحاولة مرة أخرى.", "destructive");
      console.error("Checkout error:", error);
    }
  };
  
  if (openModalType !== 'checkout') return null;

  return (
    <Dialog open={openModalType === 'checkout'} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-primary">معلومات الشحن</DialogTitle>
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
            <DialogFooter className="pt-4">
              <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">
                تأكيد الشراء
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}