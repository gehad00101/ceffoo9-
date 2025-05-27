
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
import { useAppStore } from "@/hooks/use-app-store";
import { X } from "lucide-react";

const registerFormSchema = z.object({
  username: z.string().min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  confirmPassword: z.string().min(6, { message: "تأكيد كلمة المرور مطلوب." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"], // path to field that will display the error
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterModal() {
  const { openModalType, closeModal, register: storeRegister, openModal, showAppToast } = useAppStore();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const success = await storeRegister(data.username, data.password);
    if (success) {
      form.reset();
      closeModal();
    }
  };

  const handleOpenLogin = () => {
    closeModal();
    openModal('login');
  };

  if (openModalType !== 'register') return null;

  return (
    <Dialog open={openModalType === 'register'} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-primary">تسجيل جديد</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">إغلاق</span>
          </DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">اسم المستخدم:</FormLabel>
                  <FormControl>
                    <Input placeholder="اسم المستخدم" {...field} className="p-3 text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">كلمة المرور:</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="كلمة المرور" {...field} className="p-3 text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">تأكيد كلمة المرور:</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="تأكيد كلمة المرور" {...field} className="p-3 text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col gap-4 pt-4">
              <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">
                تسجيل جديد
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                لديك حساب بالفعل؟{' '}
                <Button variant="link" type="button" onClick={handleOpenLogin} className="p-0 h-auto text-accent hover:underline">
                  سجل الدخول
                </Button>
              </p>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
