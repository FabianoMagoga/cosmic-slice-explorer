// src/pages/AdminFuncionarios.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import AdminBackButton from "@/components/AdminBackButton";

type Funcionario = {
  id: string;
  nome: string;
  cargo?: string | null;
  telefone?: string | null;
  usuario: string;
  ativo: boolean;
};

const AdminFuncionarios = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [filtro, setFiltro] = useState("");

  // ============================
  // LISTAR FUNCIONÁRIOS
  // ============================
  const { data: funcionarios, isLoading } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funcionarios")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;
      return data as Funcionario[];
    },
  });

  // ============================
  // CRIAR FUNCIONÁRIO (SEM EDGE FUNCTION)
  // ============================
  const criarFuncionario = useMutation({
    mutationFn: async () => {
      if (!nome.trim() || !usuario.trim() || !senha.trim()) {
        throw new Error("Nome, usuário e senha são obrigatórios.");
      }

      const { error } = await supabase.from("funcionarios").insert({
        nome: nome.trim(),
        cargo: cargo.trim() || null,
        telefone: telefone.trim() || null,
        usuario: usuario.trim(),
        // ⚠ por enquanto sem hash, só para o sistema funcionar
        senha_hash: senha,
        ativo: true,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Funcionário criado com sucesso!", variant: "success" });
      setNome("");
      setCargo("");
      setTelefone("");
      setUsuario("");
      setSenha("");
      queryClient.invalidateQueries(["funcionarios"]);
    },
    onError: (err: any) => {
      toast({
        title: "Erro ao criar funcionário",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // ============================
  // ATIVAR/DESATIVAR
  // ============================
  const toggleAtivo = async (id: string, atual: boolean) => {
    const { error } = await supabase
      .from("funcionarios")
      .update({ ativo: !atual })
      .eq("id", id);

    if (error) {
      toast({ title: "Erro ao mudar status", variant: "destructive" });
    } else {
      toast({ title: "Status atualizado!", variant: "success" });
      queryClient.invalidateQueries(["funcionarios"]);
    }
  };

  // FILTRO
  const listaFiltrada =
    funcionarios?.filter((f) => {
      const t = filtro.toLowerCase();
      if (!t) return true;
      return (
        f.nome.toLowerCase().includes(t) ||
        f.usuario.toLowerCase().includes(t) ||
        (f.cargo ?? "").toLowerCase().includes(t)
      );
    }) ?? [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminBackButton />

      <h1 className="text-3xl font-bold mb-6">Funcionários</h1>

      {/* FORMULÁRIO DE CADASTRO */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cadastrar funcionário</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            placeholder="Cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
          <Input
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <Input
            placeholder="Usuário de login"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Button
            className="md:col-span-3 mt-2"
            onClick={() => criarFuncionario.mutate()}
          >
            Criar funcionário
          </Button>
        </CardContent>
      </Card>

      {/* BUSCA */}
      <Input
        className="mb-4"
        placeholder="Buscar por nome, cargo ou usuário..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {/* LISTA */}
      {isLoading && <p>Carregando funcionários...</p>}

      <div className="space-y-3">
        {listaFiltrada.map((f) => (
          <Card key={f.id}>
            <CardContent className="py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{f.nome}</p>
                <p className="text-sm text-muted-foreground">
                  Usuário: {f.usuario}
                </p>
                <p className="text-sm text-muted-foreground">
                  Cargo: {f.cargo || "-"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tel: {f.telefone || "-"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span>{f.ativo ? "Ativo" : "Inativo"}</span>
                <Switch
                  checked={f.ativo}
                  onCheckedChange={() => toggleAtivo(f.id, f.ativo)}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {!isLoading && listaFiltrada.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum funcionário encontrado.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminFuncionarios;
