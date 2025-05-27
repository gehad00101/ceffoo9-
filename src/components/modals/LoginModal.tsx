
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

const loginFormSchema = z.object({
  username: z.string().min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginModal() {
  const { openModalType, closeModal, login: storeLogin, openModal, showAppToast } = useAppStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const success = await storeLogin(data.username, data.password);
    if (success) {
      form.reset();
      closeModal();
    }
  };

  const handleOpenRegister = () => {
    closeModal();
    openModal('register');
  };

  if (openModalType !== 'login') return null;

  return (
    <Dialog open={openModalType === 'login'} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-primary">تسجيل الدخول</DialogTitle>
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
                    <Input placeholder="اسم المستخدم" {...field} className="p-3 text-base" />
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
                    <Input type="password" placeholder="كلمة المرور" {...field} className="p-3 text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col gap-4 pt-4">
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-full shadow-lg">
                تسجيل الدخول
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                ليس لديك حساب؟{' '}
                <Button variant="link" type="button" onClick={handleOpenRegister} className="p-0 h-auto text-accent hover:underline">
                  سجل الآن
                </Button>
              </p>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
