import React, { useEffect, useState } from 'react';
import { IconFileTypePdf, IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react';

interface KPI {
  id: number;
  name: string;
  display_name: string;
  goal_value: number;
  current_value: number;
  previous_value: number;
  trend: number;
  status: 'Requiere atención' | 'En camino' | 'Cumplido';
}

interface ExportData {
  kpis: KPI[];
  generated_at: string;
}

export default function KpiExportPDF() {
  const [data, setData] = useState<ExportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('kpiExportData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
      setLoading(false);
      
      // Auto print después de cargar
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      setLoading(false);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Cumplido': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'En camino': 'bg-blue-100 text-blue-800 border-blue-300',
      'Requiere atención': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status as keyof typeof colors] || colors['Requiere atención'];
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <IconTrendingUp className="h-4 w-4 inline" />;
    if (trend < 0) return <IconTrendingDown className="h-4 w-4 inline" />;
    return <IconMinus className="h-4 w-4 inline" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"></div>
          <p className="text-sm text-slate-600">Preparando reporte...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.kpis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <IconFileTypePdf className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="text-sm text-slate-600">No se encontraron datos para exportar</p>
        </div>
      </div>
    );
  }

  const cumplidos = data.kpis.filter(k => k.status === 'Cumplido').length;
  const enCamino = data.kpis.filter(k => k.status === 'En camino').length;
  const requierenAtencion = data.kpis.filter(k => k.status === 'Requiere atención').length;

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 border-b-2 border-slate-700 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Reporte de Indicadores (KPIs)
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Métricas clave de desempeño institucional
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Generado el:</p>
            <p className="text-sm font-semibold text-slate-700">
              {formatDate(data.generated_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase">Total Indicadores</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{data.kpis.length}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-medium text-emerald-600 uppercase">Cumplidos</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{cumplidos}</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-medium text-blue-600 uppercase">En Camino</p>
          <p className="mt-2 text-2xl font-bold text-blue-700">{enCamino}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-medium text-red-600 uppercase">Requieren Atención</p>
          <p className="mt-2 text-2xl font-bold text-red-700">{requierenAtencion}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="space-y-6">
        {data.kpis.map((kpi) => {
          const progress = kpi.goal_value > 0 ? (kpi.current_value / kpi.goal_value) * 100 : 0;
          
          return (
            <div 
              key={kpi.id}
              className="rounded-lg border-2 border-slate-200 bg-white p-6 break-inside-avoid"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {kpi.display_name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Meta: <span className="font-semibold">{kpi.goal_value.toFixed(0)}%</span>
                    {' | '}
                    Actual: <span className="font-semibold">{kpi.current_value.toFixed(0)}%</span>
                    {kpi.previous_value > 0 && (
                      <>
                        {' | '}
                        Anterior: <span className="font-semibold">{kpi.previous_value.toFixed(0)}%</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {kpi.trend !== 0 && (
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      kpi.trend > 0 
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {getTrendIcon(kpi.trend)}
                      <span className="ml-1">
                        {kpi.trend > 0 ? '+' : ''}{kpi.trend.toFixed(1)}%
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Progreso hacia la meta
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className="h-full"
                    style={{ 
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: '#0083C9'
                    }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Estado:</span>
                <span className={`inline-flex items-center rounded-full border px-4 py-1 text-sm font-semibold ${getStatusColor(kpi.status)}`}>
                  {kpi.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 border-t-2 border-slate-200 pt-4 text-center">
        <p className="text-xs text-slate-500">
          Instituto CETI Virgen de la Puerta | Sistema de Gestión Administrativa
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Este documento es un reporte oficial generado automáticamente
        </p>
      </div>
    </div>
  );
}