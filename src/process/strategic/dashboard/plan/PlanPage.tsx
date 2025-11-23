import StrategicLayout from "../../StrategicLayout";
import { DashboardBreadcrumb } from "@/process/strategic/components/plan/Breadcrumb";
import { DataTable } from "@/process/strategic/components/plan/DataTable";

interface Props {
  planes: { id: number; nombre: string }[];
}

export default function PlanPage({ planes }: Props) {
  return (
    <StrategicLayout title="Dashboard - Gestión de Planes">
      <div className="flex-1 space-y-6 p-4 md:p-6 pt-6">
        <DashboardBreadcrumb items={[{ label: "Inicio" }]} />

        <h1 className="text-2xl font-bold mb-4">Planes Estratégicos</h1>

        <DataTable data={planes} nivel="plan" />
      </div>
    </StrategicLayout>
  );
}
