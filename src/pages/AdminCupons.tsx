// src/pages/AdminCupons.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminBackButton from "@/components/AdminBackButton";

type TipoCupom = "percentual" | "valor_fixo";

const AdminCupons = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<TipoCupom>("percentual");
  const [valor, setValor] = useState("");
  const [apenasPix, setApenasPix] = useState(false);

  // ============================
  // LISTAR CUPONS
  // ============================
  const { data: cupons, isLoading } = useQuery({
    queryKey: ["cupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cupons")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) {
        console.error(error);
        throw new Error("Erro ao carregar cupons");
      }
      return data;
    },
  });

  // ============================
  // CRIAR CUPOM
  // ============================
  const criarCupom = useMutation({
    mutationFn: async () => {
      if (!codigo || !valor) {
        throw new Error("Preencha o código e o valor.");
      }

      const valorNumero = Number(valor);
      if (!valorNumero || valorNumero <= 0) {
        throw new Error("Valor inválido.");
      }

      const { error } = await supabase.from("cupons").insert({
        codigo: codigo.trim().toUpperCase(),
        descricao: descricao || null,
        tipo,
        valor: valorNumero,
        apenas_pix: apenasPix,
        ativo: true,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Cupom criado com sucesso!", variant: "success" });
      setCodigo("");
      setDescricao("");
      setTipo("percentual");
      setValor("");
      setApenasPix(false);
      queryClient.invalidateQueries(["cupons"]);
    },
    onError: (err: any) => {
      toast({
        title: "Erro ao criar cupom",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // ============================
  // ALTERAR STATUS (ATIVAR/DESATIVAR)
  // ============================
  const toggleStatus = async (cupomId: string, ativo: boolean) => {
    const { error } = await supabase
      .from("cupons")
      .update({ ativo: !ativo })
      .eq("id", cupomId);

    if (error) {
      console.error(error);
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    } else {
      toast({ title: "Status do cupom atualizado!", variant: "success" });
      queryClient.invalidateQueries(["cupons"]);
    }
  };

  // ============================
  // DELETAR CUPOM
  // ============================
  const deletarCupom = async (cupomId: string) => {
    const { error } = await supabase.from("cupons").delete().eq("id", cupomId);

    if (error) {
      console.error(error);
      toast({ title: "Erro ao deletar cupom", variant: "destructive" });
    } else {
      toast({ title: "Cupom removido!", variant: "success" });
      queryClient.invalidateQueries(["cupons"]);
    }
  };

  const formatValor = (c: any) => {
    if (c.tipo === "percentual") {
      return `${Number(c.valor)}%`;
    }
    return `R$ ${Number(c.valor).toFixed(2)}`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminBackButton />

      <h1 className="text-3xl font-bold mb-6">Cupons Promocionais</h1>

      {/* ===================== FORMULÁRIO DE CRIAÇÃO ===================== */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cadastrar Novo Cupom</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Código do cupom</label>
            <Input
              placeholder="Ex: PLANET10"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Tipo</label>
            <select
              className="border rounded-md px-3 py-2 bg-background"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoCupom)}
            >
              <option value="percentual">% de desconto</option>
              <option value="valor_fixo">Valor fixo (R$)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Valor {tipo === "percentual" ? "(%)" : "(R$)"}
            </label>
            <Input
              placeholder={tipo === "percentual" ? "Ex: 10 = 10%" : "Ex: 5 = R$5"}
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Válido apenas para Pix?</label>
            <div className="flex items-center gap-3">
              <Switch
                checked={apenasPix}
                onCheckedChange={(checked) => setApenasPix(!!checked)}
              />
              <span className="text-sm">
                {apenasPix ? "Sim, somente pedidos em Pix" : "Não, qualquer forma de pagamento"}
              </span>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium">Descrição (opcional)</label>
            <Textarea
              placeholder="Ex: 10% OFF em qualquer pedido de terça-feira"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Button onClick={() => criarCupom.mutate()}>Criar Cupom</Button>
          </div>
        </CardContent>
      </Card>

      {/* ===================== LISTAGEM DE CUPONS ===================== */}
      <h2 className="text-2xl font-semibold mb-4">Cupons Cadastrados</h2>

      {isLoading && <p>Carregando cupons...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cupons?.map((c: any) => (
          <Card key={c.id} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <span>{c.codigo}</span>
                <Switch
                  checked={c.ativo}
                  onCheckedChange={() => toggleStatus(c.id, c.ativo)}
                />
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {c.descricao && (
                <p className="text-sm text-muted-foreground">{c.descricao}</p>
              )}

              <p className="text-sm">
                <span className="font-semibold">Tipo: </span>
                {c.tipo === "percentual" ? "% de desconto" : "Valor fixo (R$)"}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Valor: </span>
                {formatValor(c)}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Pix somente: </span>
                {c.apenas_pix ? "Sim" : "Não"}
              </p>

              <Button
                variant="destructive"
                className="w-full mt-2"
                onClick={() => deletarCupom(c.id)}
              >
                Deletar cupom
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCupons;
