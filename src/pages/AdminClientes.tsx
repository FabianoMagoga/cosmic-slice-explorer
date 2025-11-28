// src/pages/AdminClientes.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminBackButton from "@/components/AdminBackButton";

type Cliente = {
  id: string;
  nome: string;
  cpf: string;
  telefone?: string | null;
};

// helpers simples
const soDigitos = (s: string) => s.replace(/\D/g, "");
const formatCpf = (digits: string) => {
  const d = soDigitos(digits).padStart(11, "0");
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const AdminClientes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [filtro, setFiltro] = useState("");

  // ============================
  // LISTAR CLIENTES
  // ============================
  const { data: clientes, isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("nome", { ascending: true });

      if (error) {
        console.error(error);
        throw new Error("Erro ao carregar clientes");
      }
      return data as Cliente[];
    },
  });

  // ============================
  // CRIAR CLIENTE
  // ============================
  const criarCliente = useMutation({
    mutationFn: async () => {
      const nomeTrim = nome.trim();
      const cpfDigits = soDigitos(cpf);

      if (!nomeTrim) {
        throw new Error("Informe o nome do cliente.");
      }
      if (cpfDigits.length !== 11) {
        throw new Error("CPF deve ter 11 dígitos.");
      }

      const { error } = await supabase.from("clientes").insert({
        nome: nomeTrim,
        cpf: cpfDigits,
        telefone: telefone.trim() || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Cliente cadastrado com sucesso!", variant: "success" });
      setNome("");
      setCpf("");
      setTelefone("");
      queryClient.invalidateQueries(["clientes"]);
    },
    onError: (err: any) => {
      toast({
        title: "Erro ao cadastrar cliente",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // filtro simples por nome/CPF
  const listaFiltrada =
    clientes?.filter((c) => {
      const termo = filtro.trim().toLowerCase();
      if (!termo) return true;
      return (
        c.nome.toLowerCase().includes(termo) ||
        soDigitos(c.cpf).includes(soDigitos(termo))
      );
    }) ?? [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminBackButton />

      <h1 className="text-3xl font-bold mb-6">Clientes</h1>

      {/* ===================== FORMULÁRIO DE CADASTRO ===================== */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cadastrar novo cliente</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium">Nome completo</label>
            <Input
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">CPF</label>
            <Input
              placeholder="Somente números"
              value={cpf}
              onChange={(e) => setCpf(soDigitos(e.target.value))}
              maxLength={11}
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium">Telefone (opcional)</label>
            <Input
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <Button onClick={() => criarCliente.mutate()}>Salvar cliente</Button>
          </div>
        </CardContent>
      </Card>

      {/* ===================== FILTRO / BUSCA ===================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-semibold">Clientes cadastrados</h2>

        <Input
          placeholder="Buscar por nome ou CPF..."
          className="max-w-sm"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {/* ===================== LISTAGEM ===================== */}
      {isLoading && <p>Carregando clientes...</p>}

      <div className="space-y-3">
        {listaFiltrada.map((c) => (
          <Card key={c.id}>
            <CardContent className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-semibold text-lg">{c.nome}</p>
                <p className="text-sm text-muted-foreground">
                  CPF: {formatCpf(c.cpf)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tel: {c.telefone || "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {!isLoading && listaFiltrada.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum cliente encontrado.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminClientes;
