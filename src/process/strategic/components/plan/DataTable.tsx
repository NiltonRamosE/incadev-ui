import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface Props {
  data: any[];
  nivel?: "plan" | "objetivo" | "kpi";
  planId?: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const urlBase = "/estrategico/plan";

export const DataTable: React.FC<Props> = ({
  data,
  nivel,
  onEdit,
  onDelete,
  planId,
}) => {
  const handleSelect = (id: number) => {
    if (nivel === "plan") {
      document.location.href = `${urlBase}/objetivos?id=${id}`;
    } else if (nivel === "objetivo") {
      document.location.href = `${urlBase}/objetivos/kpis?planId=${planId}&id=${id}`;
    } else {
      console.warn("Nivel no definido en DataTable");
    }
  };

  const [objetivoId, setObjetivoId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // 🛑 Evita que se ejecute en el servidor
    const params = new URLSearchParams(window.location.search);
    setObjetivoId(Number(params.get("id")) || 0);
  }, []);

  return (
    <div className="border rounded-md overflow-x-auto shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 border-b">
            <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
              ID
            </TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
              Nombre
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-200">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground py-4"
              >
                No hay datos disponibles
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                  {item.id}
                </TableCell>
                <TableCell>{item.nombre}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors"
                      onClick={() => handleSelect(item.id)}
                      title="Ver"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="hover:bg-green-50 dark:hover:bg-green-900/40 transition-colors"
                      onClick={() => onEdit?.(item.id)}
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4 text-green-600" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
                      onClick={() => onDelete?.(item.id)}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
