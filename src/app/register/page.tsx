'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

type RegisterFormData = z.infer<typeof formSchema>;

function RegisterPageClient() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, signUpUser, isLoading } = useAuth();
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  async function onSubmit(values: RegisterFormData) {
    try {
      await signUpUser(values.email, values.password);
      toast({
        title: "Usuário Cadastrado!",
        description: "O novo usuário foi criado com sucesso. Você será redirecionado para o login.",
      });
      router.push("/login");
    } catch (error: any) {
      console.error("Failed to sign up:", error);
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? "Este e-mail já está em uso por outra conta."
        : "Ocorreu um erro ao tentar cadastrar. Tente novamente.";

      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: errorMessage,
      });
    }
  }

  if (isLoading || (!isLoading && user)) {
     return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-4">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
             <div className="flex justify-center items-center gap-3 mb-2">
                <UserPlus className="h-6 w-6 text-primary"/>
                <CardTitle className="text-2xl">Cadastrar Novo Usuário</CardTitle>
            </div>
            <CardDescription>Crie uma nova conta de acesso ao painel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail do Usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="novo.usuario@exemplo.com" {...field} />
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
                        <Input type="password" placeholder="Crie uma senha forte" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : 'Cadastrar Usuário'}
                </Button>
              </form>
            </Form>
             <p className="text-center text-sm text-muted-foreground mt-6">
                Já tem uma conta?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Faça login
                </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPageClient;
