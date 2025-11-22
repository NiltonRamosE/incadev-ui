import { useState, useEffect } from 'react';

export function useStrategicAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Intentamos recuperar el token del localStorage (como lo hacen los otros módulos)
    const t = window.localStorage.getItem("token");
    const u = window.localStorage.getItem("user");
    
    // 2. Limpiamos las comillas extra si existen (patrón común en este proyecto)
    const cleanToken = t ? t.replace(/^"|"$/g, '') : null;

    setToken(cleanToken);
    try { 
      setUser(u ? JSON.parse(u) : null); 
    } catch { 
      setUser(null); 
    }
    setMounted(true);
  }, []);

  return { token, user, mounted };
}