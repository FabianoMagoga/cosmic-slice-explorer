// src/pages/AdminConfig.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import AdminBackButton from "@/components/AdminBackButton";
import { useToast } from "@/hooks/use-toast";

type ConfigLoja = {
  id: string;
  nome: string;
  telefone: string | null;
  endereco: string | null;
  taxa_entrega: number | null;
  aceita_pix: boolean;
  aceita_cartao_credito: boolean;
  aceita_cartao_debito: boolean;
  cnpj: string | null;
  chave_pix: string | null;
};

const AdminConfig = () => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [cfgId, setCfgId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [taxaEntrega, setTaxaEntrega] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [chavePix, setChavePix] = useState("");

  const [aceitaPix, setAceitaPix] = useState(true);
  const [aceitaCredito, setAceitaCredito] = useState(true);
  const [aceitaDebito, setAceitaDebito] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("config_loja")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const cfg = data as ConfigLoja;
          setCfgId(cfg.id);
          setNome(cfg.nome ?? "");
          setTelefone(cfg.telefone ?? "");
          setEndereco(cfg.endereco ?? "");
          setTaxaEntrega(cfg.taxa_entrega ? String(cfg.taxa_entrega) : "");
          setCnpj(cfg.cnpj ?? "");
          setChavePix(cfg.chave_pix ?? "");
          setAceitaPix(cfg.aceita_pix);
          setAceitaCredito(cfg.aceita_cartao_credito);
          setAceitaDebito(cfg.aceita_cartao_debito);
        }
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Erro ao carregar configurações",
          description: error.message ?? "Tente novamente em instantes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [toast]);

  const handleSalvar = async () => {
    try {
      if (!nome.trim()) {
        toast({
          title: "Nome obrigatório",
          description: "Informe o nome da pizzaria.",
          variant: "destructive",
        });
        return;
      }

      setSaving(true);

      const taxa = taxaEntrega ? Number(taxaEntrega) : null;
      if (taxaEntrega && (Number.isNaN(taxa) || taxa! < 0)) {
        throw new Error("Taxa de entrega inválida.");
      }

      const payload = {
        nome: nome.trim(),
        telefone: telefone.trim() || null,
        endereco: endereco.trim() || null,
        taxa_entrega: taxa,
        cnpj: cnpj.trim() || null,
        chave_pix: chavePix.trim() || null,
        aceita_pix: aceitaPix,
        aceita_cartao_credito: aceitaCredito,
        aceita_cartao_debito: aceitaDebito,
      };

      if (cfgId) {
        const { error } = await supabase
          .from("config_loja")
          .update(payload)
          .eq("id", cfgId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("config_loja")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        setCfgId(data.id);
      }

      toast({
        title: "Configurações salvas",
        description: "As informações da pizzaria foram atualizadas.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao salvar",
        description: error.message ?? "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Administração
            </p>
            <h1 className="text-2xl font-semibold">Configurações da loja</h1>
            <p className="text-xs text-slate-400">
              Nome, telefone, entrega, formas de pagamento e dados fiscais.
            </p>
          </div>
          <AdminBackButton />
        </div>

        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader>
            <CardTitle>
              {loading ? "Carregando..." : "Dados da Planet Pizza"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome da pizzaria</Label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Planet Pizza • Sistema Solar"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone / WhatsApp</Label>
                <Input
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua das Estrelas, 123 - Bairro Galáxia"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa de entrega (R$)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={taxaEntrega}
                  onChange={(e) => setTaxaEntrega(e.target.value)}
                  placeholder="Ex: 7.90"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>CNPJ (opcional)</Label>
                <Input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <Label>Chave PIX (opcional)</Label>
                <Input
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  placeholder="Chave PIX (telefone, e-mail, CPF, aleatória...)"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">PIX</p>
                  <p className="text-xs text-slate-400">
                    Exibir opção de pagamento via PIX.
                  </p>
                </div>
                <Switch
                  checked={aceitaPix}
                  onCheckedChange={setAceitaPix}
                  id="aceitaPix"
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">Crédito</p>
                  <p className="text-xs text-slate-400">
                    Exibir cartão de crédito no checkout.
                  </p>
                </div>
                <Switch
                  checked={aceitaCredito}
                  onCheckedChange={setAceitaCredito}
                  id="aceitaCredito"
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">Débito</p>
                  <p className="text-xs text-slate-400">
                    Exibir cartão de débito no checkout.
                  </p>
                </div>
                <Switch
                  checked={aceitaDebito}
                  onCheckedChange={setAceitaDebito}
                  id="aceitaDebito"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSalvar} disabled={saving || loading}>
                {saving ? "Salvando..." : "Salvar configurações"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConfig;
