import React, { useEffect, useState } from 'react';
import { IconFileTypePdf, IconFileTypeDocx, IconFileTypeXls, IconFileText } from '@tabler/icons-react';

interface Document {
  id: number;
  name: string;
  type: string;
  size_formatted?: string;
  created_at: string;
}

interface ExportData {
  documents: Document[];
  stats: {
    total_documents: number;
    pdf_count: number;
    docx_count: number;
    xlsx_count: number;
    total_size: number;
  };
  generated_at: string;
}

const getFileIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case 'PDF':
      return <IconFileTypePdf className="h-4 w-4 text-red-600" />;
    case 'DOCX':
    case 'DOC':
      return <IconFileTypeDocx className="h-4 w-4 text-blue-600" />;
    case 'XLSX':
    case 'XLS':
      return <IconFileTypeXls className="h-4 w-4 text-emerald-600" />;
    default:
      return <IconFileText className="h-4 w-4 text-slate-600" />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatBytes = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const generateDocumentId = (id: number): string => {
  return `DOC-${String(id).padStart(3, '0')}`;
};

export default function DocumentExportPDF() {
  const [data, setData] = useState<ExportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('documentsExportData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
      } catch (error) {
        console.error('Error parsing export data:', error);
      }
    }
    setLoading(false);

    // Auto-print después de cargar
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold">No se encontraron datos para exportar</p>
          <button
            onClick={() => window.close()}
            className="mt-4 px-4 py-2 bg-slate-700 text-white rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-8 bg-white">
      {/* Header */}
      <div className="mb-8 pb-6 border-b-2 border-slate-300">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Reporte de Documentos Administrativos
            </h1>
            <p className="text-slate-600">
              Instituto CETI Virgen de la Puerta
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Generado el {currentDate}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-slate-100 px-4 py-2 rounded">
              <p className="text-xs text-slate-600">Fecha de generación</p>
              <p className="font-semibold">{formatDate(data.generated_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg border">
          <p className="text-xs text-slate-600 mb-1">Total Documentos</p>
          <p className="text-2xl font-bold text-slate-900">{data.stats.total_documents}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-xs text-red-600 mb-1">Documentos PDF</p>
          <p className="text-2xl font-bold text-red-700">{data.stats.pdf_count}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 mb-1">Documentos DOCX</p>
          <p className="text-2xl font-bold text-blue-700">{data.stats.docx_count}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <p className="text-xs text-emerald-600 mb-1">Documentos XLSX</p>
          <p className="text-2xl font-bold text-emerald-700">{data.stats.xlsx_count}</p>
        </div>
      </div>

      {/* Tabla de documentos */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Listado de Documentos ({data.documents.length})
        </h2>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-300">
              <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Nombre del Documento</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-700 text-sm">Tipo</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-700 text-sm">Tamaño</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-700 text-sm">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {data.documents.map((doc, index) => (
              <tr
                key={doc.id}
                className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
              >
                <td className="py-3 px-4 text-sm font-medium text-slate-700">
                  {generateDocumentId(doc.id)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getFileIcon(doc.type)}
                    <span className="text-sm text-slate-900">{doc.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-slate-200 text-slate-700">
                    {doc.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-sm text-slate-600">
                  {doc.size_formatted || 'N/A'}
                </td>
                <td className="py-3 px-4 text-center text-sm text-slate-600">
                  {formatDate(doc.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-300">
        <div className="flex justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Instituto CETI Virgen de la Puerta</p>
          <p>Página 1 de 1</p>
        </div>
      </div>

      {/* Estilos para impresión */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          @page {
            margin: 1.5cm;
            size: landscape;
          }
          
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
        }
      `}</style>
    </div>
  );
}