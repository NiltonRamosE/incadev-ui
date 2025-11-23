// src/services/marketingService.ts
import { config } from '../../config/academic-config'; // ← Cambiado de technology-config
import { authenticatedFetch } from './authService';
import { config as marketingConfig } from '../../config/marketing-config';

export interface StudentProfile {
  id: number;
  user_id: string;
  interests: string[];
  learning_goal: string;
  created_at: string;
  updated_at: string;
}

export interface StudentFromAPI {
  id: number;
  name: string;
  dni: string;
  fullname: string;
  avatar: string | null;
  phone: string | null;
  email: string;
  created_at: string;
  updated_at: string;
  student_profile: StudentProfile;
}

export interface StudentForUI {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  avatar: string | null;
  dni: string;
  estado: 'lead' | 'preinscrito' | 'inscrito' | 'cursando' | 'graduado' | 'desertor';
  curso: string;
  fechaRegistro: string;
  origen: string;
  ltv: number;
  cursosCompletados: number;
  engagementScore: number;
  ultimaInteraccion: string;
  interests: string[];
  learningGoal: string;
}

// ========== COURSES ==========
export interface CourseFromAPI {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseForUI {
  id: number;
  nombre: string;
  descripcion: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// ========== COURSE VERSIONS ==========
export interface CourseVersionFromAPI {
  id: number;
  course_id: number;
  version: string | null;
  name: string;
  price: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  course: CourseFromAPI;
}

export interface CourseVersionForUI {
  id: number;
  cursoId: number;
  cursoNombre: string;
  cursoDescripcion: string;
  nombre: string;
  version: string;
  precio: number;
  estado: 'draft' | 'published' | 'archived';
  fechaCreacion: string;
  fechaActualizacion: string;
}

/**
 * Mapea los datos de la API a la estructura que necesita la UI
 */
function mapStudentToUI(student: StudentFromAPI): StudentForUI {
  const diasDesdeRegistro = Math.floor(
    (new Date().getTime() - new Date(student.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  let estado: StudentForUI['estado'] = 'lead';
  if (diasDesdeRegistro > 60) {
    estado = Math.random() > 0.5 ? 'graduado' : 'cursando';
  } else if (diasDesdeRegistro > 30) {
    estado = Math.random() > 0.3 ? 'cursando' : 'inscrito';
  } else if (diasDesdeRegistro > 10) {
    estado = Math.random() > 0.5 ? 'inscrito' : 'preinscrito';
  } else {
    estado = 'lead';
  }

  const cursoPrincipal = student.student_profile?.interests?.[0] || 'Sin curso asignado';

  const tieneIntereses = (student.student_profile?.interests?.length || 0) > 0;
  const tieneObjetivo = !!student.student_profile?.learning_goal;
  const tieneAvatar = !!student.avatar;
  const tieneTelefono = !!student.phone;

  const engagementScore = Math.round(
    (tieneIntereses ? 40 : 0) +
    (tieneObjetivo ? 30 : 0) +
    (tieneAvatar ? 15 : 0) +
    (tieneTelefono ? 15 : 0)
  );

  const ltvMap = {
    'lead': 0,
    'preinscrito': 0,
    'inscrito': 450 + Math.floor(Math.random() * 100),
    'cursando': 500 + Math.floor(Math.random() * 100),
    'graduado': 1000 + Math.floor(Math.random() * 500),
    'desertor': 200
  };

  const origenes = ['Facebook', 'Instagram', 'Referido', 'Orgánico'];
  const origen = origenes[Math.floor(Math.random() * origenes.length)];

  return {
    id: student.id,
    nombre: student.fullname,
    email: student.email,
    telefono: student.phone || 'No registrado',
    avatar: student.avatar,
    dni: student.dni,
    estado,
    curso: cursoPrincipal,
    fechaRegistro: student.created_at,
    origen,
    ltv: ltvMap[estado],
    cursosCompletados: estado === 'graduado' ? Math.floor(Math.random() * 3) + 1 : 0,
    engagementScore,
    ultimaInteraccion: student.updated_at,
    interests: student.student_profile?.interests || [],
    learningGoal: student.student_profile?.learning_goal || 'Sin objetivo definido'
  };
}

/**
 * Obtiene la lista de estudiantes desde la API (CON AUTENTICACIÓN)
 */
export async function fetchStudents(): Promise<StudentForUI[]> {
  try {
    // Construir URL correctamente desde academic-config
    const url = `${config.apiUrl}${config.endpoints.marketing.students}`;

    console.log('[marketingService] Fetching students from:', url);

    // Usar authenticatedFetch con Bearer token
    const response = await authenticatedFetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching students: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[marketingService] Students response:', data);

    // La API devuelve { data: [...], meta: {...} }
    const students: StudentFromAPI[] = data.data || [];

    return students.map(mapStudentToUI);
  } catch (error) {
    console.error('[marketingService] Error fetching students:', error);

    // Si el error es de autenticación, redirigir al login
    if (error instanceof Error && error.message.includes('login')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/marketing';
      }
    }

    return [];
  }
}

// ============================================ 
// PROPOSALS TYPES & INTERFACES
// ============================================

export interface ProposalFromAPI {
  id: number;
  title: string;
  description: string;
  area: string;
  priority: 'alto' | 'medio' | 'bajo';
  status: 'borrador' | 'activa' | 'pausada' | 'aprobada' | 'rechazada';
  target_audience: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface ProposalForUI {
  id: number;
  tema: string;
  descripcion: string;
  departamento: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'borrador' | 'activa' | 'pausada' | 'aprobada' | 'rechazada';
  publico: string[];
  creadoPor: number;
  fecha: string;
  actualizado: string;
}

export interface CreateProposalDTO {
  title: string;
  description: string;
  area: string;
  priority: 'alto' | 'medio' | 'bajo';
  target_audience: string;
}

export interface UpdateProposalDTO {
  title?: string;
  description?: string;
  area?: string;
  priority?: 'alto' | 'medio' | 'bajo';
  status?: 'borrador' | 'activa' | 'pausada' | 'aprobada' | 'rechazada';
  target_audience?: string;
}

// ============================================
// PROPOSALS MAPPERS
// ============================================

function mapProposalFromAPI(apiProposal: ProposalFromAPI): ProposalForUI {
  return {
    id: apiProposal.id,
    tema: apiProposal.title,
    descripcion: apiProposal.description,
    departamento: apiProposal.area,
    prioridad: apiProposal.priority === 'alto' ? 'alta' : apiProposal.priority === 'medio' ? 'media' : 'baja',
    estado: apiProposal.status,
    publico: apiProposal.target_audience.split(',').map(p => p.trim()),
    creadoPor: apiProposal.created_by,
    fecha: apiProposal.created_at,
    actualizado: apiProposal.updated_at
  };
}

// ============================================
// PROPOSALS API FUNCTIONS
// ============================================

/**
 * Obtener todas las propuestas
 */
export async function fetchProposals(): Promise<ProposalForUI[]> {
  try {
    const endpoint = marketingConfig.endpoints.proposals.list;
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${marketingConfig.apiUrl}/api${endpoint}`;

    console.log('[marketingService] Fetching proposals from:', url);

    const response = await authenticatedFetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProposalFromAPI[] = await response.json();
    console.log('[marketingService] Proposals fetched:', data.length);

    return data.map(mapProposalFromAPI);
  } catch (error) {
    console.error('[marketingService] Error fetching proposals:', error);
    throw error;
  }
}

/**
 * Obtener una propuesta por ID
 */
export async function fetchProposalById(id: number): Promise<ProposalForUI> {
  try {
    const endpoint = marketingConfig.endpoints.proposals.detail.replace(':id', String(id));
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${marketingConfig.apiUrl}/api${endpoint}`;

    console.log('[marketingService] Fetching proposal by ID:', url);
/**
 * Mapea los datos de curso de la API a la estructura que necesita la UI
 */
function mapCourseToUI(course: CourseFromAPI): CourseForUI {
  return {
    id: course.id,
    nombre: course.name,
    descripcion: course.description || 'Sin descripción',
    fechaCreacion: course.created_at,
    fechaActualizacion: course.updated_at
  };
}

/**
 * Mapea los datos de versión de curso de la API a la estructura que necesita la UI
 */
function mapVersionToUI(version: CourseVersionFromAPI): CourseVersionForUI {
  return {
    id: version.id,
    cursoId: version.course_id,
    cursoNombre: version.course?.name || 'Curso desconocido',
    cursoDescripcion: version.course?.description || 'Sin descripción',
    nombre: version.name,
    version: version.version || '',
    precio: parseFloat(version.price) || 0,
    estado: version.status,
    fechaCreacion: version.created_at,
    fechaActualizacion: version.updated_at
  };
}

/**
 * Obtiene la lista de cursos desde la API (CON AUTENTICACIÓN)
 */
export async function fetchCourses(): Promise<CourseForUI[]> {
  try {
    const url = `${config.apiUrl}${config.endpoints.marketing.courses}`;

    console.log('[marketingService] Fetching courses from:', url);

    const response = await authenticatedFetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProposalFromAPI = await response.json();
    return mapProposalFromAPI(data);
  } catch (error) {
    console.error('[marketingService] Error fetching proposal:', error);
    throw error;
  }
}

/**
 * Crear nueva propuesta
 */
export async function createProposal(proposal: CreateProposalDTO): Promise<ProposalForUI> {
  try {
    const endpoint = marketingConfig.endpoints.proposals.create;
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${marketingConfig.apiUrl}/api${endpoint}`;

    console.log('[marketingService] Creating proposal:', url);

    const response = await authenticatedFetch(url, {
      method: 'POST',
      body: JSON.stringify(proposal)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProposalFromAPI = await response.json();
    console.log('[marketingService] Proposal created:', data.id);

    return mapProposalFromAPI(data);
  } catch (error) {
    console.error('[marketingService] Error creating proposal:', error);
    throw error;
  }
}

/**
 * Actualizar propuesta
 */
export async function updateProposal(id: number, updates: UpdateProposalDTO): Promise<ProposalForUI> {
  try {
    const endpoint = marketingConfig.endpoints.proposals.update.replace(':id', String(id));
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${marketingConfig.apiUrl}/api${endpoint}`;

    console.log('[marketingService] Updating proposal:', url);

    const response = await authenticatedFetch(url, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProposalFromAPI = await response.json();
    console.log('[marketingService] Proposal updated:', data.id);

    return mapProposalFromAPI(data);
  } catch (error) {
    console.error('[marketingService] Error updating proposal:', error);
    throw error;
  }
}

/**
 * Eliminar propuesta
 */
export async function deleteProposal(id: number): Promise<void> {
  try {
    const endpoint = marketingConfig.endpoints.proposals.delete.replace(':id', String(id));
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${marketingConfig.apiUrl}/api${endpoint}`;

    console.log('[marketingService] Deleting proposal:', url);

    const response = await authenticatedFetch(url, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('[marketingService] Proposal deleted:', id);
  } catch (error) {
    console.error('[marketingService] Error deleting proposal:', error);
    throw error;
      throw new Error(`Error fetching courses: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[marketingService] Courses response:', data);

    const courses: CourseFromAPI[] = data.data || [];

    return courses.map(mapCourseToUI);
  } catch (error) {
    console.error('[marketingService] Error fetching courses:', error);

    if (error instanceof Error && error.message.includes('login')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/marketing';
      }
    }

    return [];
  }
}

/**
 * Obtiene la lista de versiones de cursos desde la API (CON AUTENTICACIÓN)
 */
export async function fetchVersions(): Promise<CourseVersionForUI[]> {
  try {
    const url = `${config.apiUrl}${config.endpoints.marketing.versions}`;

    console.log('[marketingService] Fetching versions from:', url);

    const response = await authenticatedFetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching versions: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[marketingService] Versions response:', data);

    const versions: CourseVersionFromAPI[] = data.data || [];

    return versions.map(mapVersionToUI);
  } catch (error) {
    console.error('[marketingService] Error fetching versions:', error);

    if (error instanceof Error && error.message.includes('login')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/marketing';
      }
    }
    return [];
  }
}