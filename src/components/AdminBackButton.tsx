// src/components/touch 
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminBackButtonProps {
  to?: string;
  label?: string;
}

const AdminBackButton = ({
  to = "/admin",
  label = "Voltar para o painel",
}: AdminBackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => navigate(to)}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Button>
  );
};

export default AdminBackButton;
