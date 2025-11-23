import { useState } from "react";
import StrategicLayout from "../../StrategicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrganizacionesPage() {
  // 📊 Datos simulados
  const organizaciones = [
    {
      ruc: "20123456789",
      tipo: "Universidad",
      telefono: "987654321",
      email: "contacto@universidadx.edu.pe",
    },
    {
      ruc: "20567891234",
      tipo: "Empresa Privada",
      telefono: "956789123",
      email: "rrhh@empresay.com",
    },
    {
      ruc: "20876543210",
      tipo: "Gobierno",
      telefono: "912345678",
      email: "info@ministerioz.gob.pe",
    },
  ];

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 🔍 Filtro de búsqueda
  const filtered = organizaciones.filter(
    (o) =>
      o.tipo.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.ruc.includes(search)
  );

  return (
    <StrategicLayout title="Dashboard - Gestión de Organizaciones">
      <div className="flex-1 space-y-6 p-4 md:p-6 pt-6">
        {/* 🏷️ Título */}
        <h1 className="text-2xl font-bold">🏢 Organizaciones</h1>

        {/* 🧾 Lista de organizaciones */}
        <div className="flex items-center justify-between mt-6">
          <h2 className="text-xl font-semibold">Lista de organizaciones</h2>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar organización..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[200px]"
            />

            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <Button variant="default">+ Nueva organización</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar nueva organización</DialogTitle>
                </DialogHeader>

                <form className="space-y-3 mt-3">
                  <Input placeholder="RUC" />
                  <Input placeholder="Tipo" />
                  <Input placeholder="Teléfono de contacto" />
                  <Input placeholder="Email de contacto" />
                  <Button type="submit" className="w-full">
                    Guardar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 📋 Tabla de organizaciones */}
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RUC</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Teléfono de contacto</TableHead>
                <TableHead>Email de contacto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o, i) => (
                <TableRow key={i}>
                  <TableCell>{o.ruc}</TableCell>
                  <TableCell>{o.tipo}</TableCell>
                  <TableCell>{o.telefono}</TableCell>
                  <TableCell>{o.email}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-4"
                  >
                    No se encontraron organizaciones.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </StrategicLayout>
  );
}
