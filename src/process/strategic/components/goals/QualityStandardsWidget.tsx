import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// 1. Importamos la nueva interfaz QualityStandard
import { fetchQualityStandards, submitVote, type QualityStandard } from "@/services/estrategico/qualityService";
import { useStrategicAuth } from "../../hooks/useStrategicAuth";

export function QualityStandardsWidget() {
  const { token, mounted } = useStrategicAuth();
  // 2. Usamos el tipo correcto en el estado
  const [standards, setStandards] = useState<QualityStandard[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    const res = await fetchQualityStandards(token);
    if (res.success) {
      setStandards(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mounted && token) loadData();
  }, [mounted, token]);

  const handleVote = async (standardId: number, score: number) => {
    if (!token) return;
    
    const res = await submitVote(standardId, score, "", token);
    
    if (res.success) {
      toast({ 
        title: "¡Voto registrado!", 
        description: `Has calificado con ${score} estrellas.`,
        variant: "default"
      });
      loadData(); // Recargamos para actualizar la barra de progreso
    } else {
      toast({ 
        title: "Error", 
        description: res.message || "No se pudo registrar el voto.", 
        variant: "destructive"
      });
    }
  };

  if (!mounted) return null;
  if (loading) return <div className="p-8 text-center text-gray-500">Cargando estándares de calidad...</div>;
  
  // Validación visual si no hay datos
  if (standards.length === 0) return (
    <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <p className="text-gray-500">No hay estándares de calidad activos para evaluar en este momento.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {standards.map((std) => {
        // 3. Usamos las nuevas propiedades: current_score y target_score
        const percentage = (std.current_score / 5) * 100;
        const isMeetingGoal = std.current_score >= std.target_score;

        return (
          <Card key={std.id} className="shadow-md hover:shadow-lg transition-all border-t-4 border-t-blue-600 bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-full tracking-wide">
                  {std.category}
                </span>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${isMeetingGoal ? "text-green-600" : "text-amber-500"}`}>
                    {std.current_score}
                  </span>
                  <span className="text-xs text-gray-400 block font-medium">Meta: {std.target_score}</span>
                </div>
              </div>
              {/* 4. Usamos std.name en lugar de title */}
              <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                {std.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-500 mb-6 min-h-[40px] line-clamp-2">
                {std.description}
              </p>
              
              {/* Barra de Progreso */}
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1.5 font-medium text-gray-600">
                  <span>Progreso actual</span>
                  <span>{Math.round(percentage)}%</span>
                </div>
                
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ${isMeetingGoal ? 'bg-green-500' : 'bg-amber-500'}`} 
                        style={{ width: `${percentage}%` }}
                    />
                </div>
              </div>

              {/* Votación */}
              <div className="border-t pt-4">
                <p className="text-xs font-medium text-gray-400 mb-2 text-center uppercase tracking-wider">Tu Calificación</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleVote(std.id, star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none group"
                      title={`Votar ${star} estrellas`}
                    >
                      <Star 
                        className={`w-7 h-7 transition-colors ${
                          // Usamos std.current_score para pintar las estrellas referenciales o lógica propia si quieres guardar el voto del usuario
                          // Por ahora, esto pinta basado en el promedio global, lo ideal sería pintar basado en el voto del usuario si tuviéramos ese dato
                          star <= Math.round(std.current_score) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-200 group-hover:text-yellow-200"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}