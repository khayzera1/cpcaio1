
'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

type LoginFormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signInUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormData) {
    setIsSubmitting(true);
    try {
      await signInUser(values.email, values.password);
      toast({
        title: "Login realizado com sucesso!",
      });
      router.push("/");
    } catch (error: any) {
      console.error("Failed to sign in:", error);
      const errorMessage = error.code === 'auth/invalid-credential'
        ? "Credenciais inválidas. Verifique seu e-mail e senha."
        : "Ocorreu um erro ao tentar fazer login. Tente novamente.";

      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-4">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
             <div className="flex justify-center items-center gap-3 mb-2">
                <LogIn className="h-6 w-6 text-primary"/>
                <CardTitle className="text-2xl">Acessar Painel</CardTitle>
            </div>
            <CardDescription>Use suas credenciais para entrar no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seuemail@exemplo.com" {...field} />
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
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Entrar'}
                </Button>
              </form>
            </Form>
             <p className="text-center text-sm text-muted-foreground mt-6">
                Não tem uma conta?{' '}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                    Cadastre um novo usuário
                </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
