import { authenticatedFetch } from './authService';
import { config } from '../../config/academic-config';
import type { CourseFromAPI, CourseForUI, CourseVersionFromAPI, CourseVersionForUI } from './types';

// ============================================
// MAPPERS
// ============================================

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

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Obtiene la lista de cursos desde la API
 */
export async function fetchCourses(): Promise<CourseForUI[]> {
    try {
        const url = `${config.apiUrl}${config.endpoints.marketing.courses}`;

        console.log('[courseService] Fetching courses from:', url);

        const response = await authenticatedFetch(url);

        if (!response.ok) {
            throw new Error(`Error fetching courses: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[courseService] Courses response:', data);

        const courses: CourseFromAPI[] = data.data || [];

        return courses.map(mapCourseToUI);
    } catch (error) {
        console.error('[courseService] Error fetching courses:', error);

        if (error instanceof Error && error.message.includes('login')) {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/marketing';
            }
        }

        return [];
    }
}

/**
 * Obtiene la lista de versiones de cursos desde la API
 */
export async function fetchVersions(): Promise<CourseVersionForUI[]> {
    try {
        const url = `${config.apiUrl}${config.endpoints.marketing.versions}`;

        console.log('[courseService] Fetching versions from:', url);

        const response = await authenticatedFetch(url);

        if (!response.ok) {
            throw new Error(`Error fetching versions: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[courseService] Versions response:', data);

        const versions: CourseVersionFromAPI[] = data.data || [];

        return versions.map(mapVersionToUI);
    } catch (error) {
        console.error('[courseService] Error fetching versions:', error);

        if (error instanceof Error && error.message.includes('login')) {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/marketing';
            }
        }

        return [];
    }
}