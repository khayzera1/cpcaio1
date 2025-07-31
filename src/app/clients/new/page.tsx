'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Header } from "@/components/header";
import Link from "next/link";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  clientName: z.string().min(2, {
    message: "O nome do cliente deve ter pelo menos 2 caracteres.",
  }),
});

export type NewClientFormData = z.infer<typeof formSchema>;

export default function NewClientPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, signOutUser, addClient } = useAuth();


    const form = useForm<NewClientFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientName: "",
        },
    });

    async function onSubmit(values: NewClientFormData) {
        setIsSubmitting(true);
        try {
            await addClient(values);
            toast({
                title: "Cliente Cadastrado com Sucesso!",
                description: `O cliente ${values.clientName} foi adicionado.`,
            });
            router.push("/");
        } catch (error) {
            console.error("Failed to add client:", error);
            toast({
                variant: "destructive",
                title: "Erro ao cadastrar cliente",
                description: "Não foi possível adicionar o cliente. Tente novamente.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header user={user} onSignOut={signOutUser} />
            <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <Card className="shadow-lg border-primary/20">
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <UserPlus className="h-6 w-6 text-primary"/>
                                    <CardTitle className="text-2xl">Cadastrar Novo Cliente</CardTitle>
                                </div>
                                <Link href="/">
                                    <Button variant="outline">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Voltar
                                    </Button>
                                </Link>
                            </div>
                            <CardDescription>Preencha as informações abaixo para adicionar um novo cliente.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="clientName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome do Cliente</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: Pizzaria do Bairro" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    O nome fantasia ou razão social do cliente.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex justify-end gap-4 pt-4">
                                        <Button type="button" variant="ghost" onClick={() => router.push('/')} disabled={isSubmitting}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Salvar Cliente
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
