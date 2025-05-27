
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/hooks/use-app-store";
import { X } from "lucide-react";

const saudiCities = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", 
  "الخبر", "الظهران", "الطائف", "تبوك", "بريدة", "عنيزة", "الرس",
  "أبها", "خميس مشيط", "حائل", "جازان", "نجران", "الهفوف", 
  "المبرز", "ينبع", "الجبيل", "سكاكا", "عرعر", "الباحة"
];

// Schema for customer information
const customerInfoSchema = z.object({
  customerName: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل." }),
  customerEmail: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }),
  customerCity: z.string({ required_error: "الرجاء اختيار المدينة." }),
  customerStreetAddress: z.string().min(5, { message: "عنوان الشارع يجب أن يكون 5 أحرف على الأقل." }),
  customerPhone: z.string().regex(/^(\+966|0)?5\d{8}$/, { message: "الرجاء إدخال رقم هاتف سعودي صحيح (مثال: 05xxxxxxxx أو +9665xxxxxxxx)." }),
});

type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>;

export default function CheckoutModal() {
  const { openModalType, closeModal, openModal, loggedInUser, cartTotal } = useAppStore();

  const form = useForm<CustomerInfoFormValues>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerCity: undefined,
      customerStreetAddress: "",
      customerPhone: "",
    },
  });

  useEffect(() => {
    if (openModalType === 'checkout') {
      if (loggedInUser) {
        form.reset({
          customerName: loggedInUser.username || "",
          customerEmail: loggedInUser.email || "",
          customerCity: undefined, // City needs to be selected by user
          customerStreetAddress: "", // Street address needs to be entered
          customerPhone: loggedInUser.phone || "",
        });
      } else {
        form.reset({ 
          customerName: "",
          customerEmail: "",
          customerCity: undefined,
          customerStreetAddress: "",
          customerPhone: "",
        });
      }
    }
  }, [openModalType, loggedInUser, form]);

  const onSubmit = (data: CustomerInfoFormValues) => {
    const totalAmount = cartTotal();
    // Combine city and street address for the `customerAddress` field expected by `placeOrder`
    const fullAddress = `${data.customerCity}, ${data.customerStreetAddress}`;
    const customerDetailsForPayment = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerAddress: fullAddress, // Pass combined address
        customerPhone: data.customerPhone,
    };
    closeModal(); 
    openModal('payment', { customerDetails: customerDetailsForPayment, totalAmount }); 
  };
  
  if (openModalType !== 'checkout') return null;

  return (
    <Dialog open={openModalType === 'checkout'} onOpenChange={(isOpen) => { if (!isOpen) { closeModal(); }}}>
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
              name="customerCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">المدينة:</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="p-3 text-base">
                        <SelectValue placeholder="اختر مدينة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {saudiCities.map((city) => (
                        <SelectItem key={city} value={city} className="text-lg">
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="customerStreetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">عنوان الشارع (الحي، الشارع، رقم المبنى):</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: حي العليا، شارع الملك فهد، مبنى 123" {...field} className="p-3 text-base"/>
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
                <Button type="submit" size="lg" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">
                  متابعة إلى الدفع
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
