import { config } from "@/config/strategic-config";

export interface QualityStandard {
  id: number;
  name: string;          // Antes era 'title'
  category: string;
  description: string;
  target_score: number;
  current_score: number; // Antes era 'current_average'
}

// Renombrado para ser consistente
export const fetchQualityStandards = async (token: string) => {
  try {
    // URL corregida: quality-standards
    const response = await fetch(`${config.apiUrl}/api/strategic/quality-standards`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching standards:", error);
    return { success: false, data: [] };
  }
};

export const submitVote = async (standardId: number, score: number, comment: string, token: string) => {
  try {
    // URL corregida: quality-standards/{id}/rate
    const response = await fetch(`${config.apiUrl}/api/strategic/quality-standards/${standardId}/rate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ score, comment }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error submitting vote:", error);
    return { success: false, message: "Error de conexión" };
  }
};