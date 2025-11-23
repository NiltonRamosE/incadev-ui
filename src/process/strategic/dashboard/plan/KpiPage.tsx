import StrategicLayout from "../../StrategicLayout";
import { DashboardBreadcrumb } from "@/process/strategic/components/plan/Breadcrumb";
import { DataTable } from "@/process/strategic/components/plan/DataTable";

interface Props {
  plan?: { id: number; nombre: string };
  objetivo?: { id: number; nombre: string };
  kpis: { id: number; nombre: string }[];
}

export default function ObjetivoPage({ plan, objetivo, kpis }: Props) {
  return (
    <StrategicLayout title="Dashboard - Gestión de Objetivos">
      <div className="flex-1 space-y-6 p-4 md:p-6 pt-6">
        <DashboardBreadcrumb
          items={[
            { label: "Inicio", href: "/estrategico/plan" },
            {
              label: plan?.nombre || "Plan",
              href: `/estrategico/plan/objetivos?id=${plan?.id}`,
            },
            { label: objetivo?.nombre || "Objetivo" },
          ]}
        />

        <h1 className="text-2xl font-bold mb-4">
          KPIs del objetivo: {objetivo?.nombre}
        </h1>

        <DataTable data={kpis} />
      </div>
    </StrategicLayout>
  );
}
