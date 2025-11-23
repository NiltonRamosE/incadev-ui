import { authenticatedFetch } from './authService';
import { config as marketingConfig } from '../../config/marketing-config';
import type {
    CampaignFromAPI,
    CampaignForUI,
    CreateCampaignDTO,
    UpdateCampaignDTO,
    CampaignMetricsFromAPI,
    CampaignMetricsForUI,
    PostFromAPI,
    PostForUI
} from './types';

// ============================================
// HELPERS
// ============================================

/**
 * Calcula el estado de una campaña basado en su fecha de fin
 */
function calcularEstadoCampaign(endDate: string): 'activa' | 'finalizada' {
    const hoy = new Date();
    const fin = new Date(endDate);

    return fin < hoy ? 'finalizada' : 'activa';
}

// ============================================
// MAPPERS
// ============================================

/**
 * Mapea los datos de campaña de la API a la estructura que necesita la UI
 */
function mapCampaignFromAPI(apiCampaign: CampaignFromAPI): CampaignForUI {
    return {
        id: apiCampaign.id,
        proposalId: apiCampaign.proposal_id,
        courseVersionId: apiCampaign.course_version_id,
        nombre: apiCampaign.name,
        objetivo: apiCampaign.objective,
        inicio: apiCampaign.start_date,
        fin: apiCampaign.end_date,
        estado: calcularEstadoCampaign(apiCampaign.end_date),
        fechaCreacion: apiCampaign.created_at,
        fechaActualizacion: apiCampaign.updated_at
    };
}

/**
 * Mapea las métricas de campaña de la API a la estructura que necesita la UI
 */
function mapCampaignMetricsFromAPI(apiMetrics: CampaignMetricsFromAPI): CampaignMetricsForUI {
    return {
        campaignId: apiMetrics.campaign_id,
        campaignName: apiMetrics.campaign_name,
        totalReach: apiMetrics.metrics_summary.total_reach,
        totalInteractions: apiMetrics.metrics_summary.total_interactions,
        totalLikes: apiMetrics.metrics_summary.total_likes,
        totalComments: apiMetrics.metrics_summary.total_comments,
        totalMessages: apiMetrics.metrics_summary.total_messages_received,
        totalPreRegistrations: apiMetrics.metrics_summary.total_pre_registrations,
        averageIntention: apiMetrics.metrics_summary.average_intention_percentage,
        averageCtr: apiMetrics.metrics_summary.average_ctr_percentage,
        expectedEnrollments: apiMetrics.metrics_summary.expected_enrollments,
        averageCpa: apiMetrics.metrics_summary.average_cpa_cost,
        postMetrics: apiMetrics.posts_metrics.map(pm => ({
            postId: pm.post_id,
            platform: pm.platform,
            reach: pm.total_reach,
            interactions: pm.total_interactions,
            likes: pm.likes,
            comments: pm.comments
        }))
    };
}

/**
 * Mapea los datos de post de la API a la estructura que necesita la UI
 */
function mapPostFromAPI(apiPost: PostFromAPI): PostForUI {
    return {
        id: apiPost.id,
        campaignId: apiPost.campaign_id,
        titulo: apiPost.title,
        plataforma: apiPost.platform,
        contenido: apiPost.content,
        tipo: apiPost.content_type,
        imagen: apiPost.image_path,
        enlace: apiPost.link_url,
        estado: apiPost.status,
        programadoPara: apiPost.scheduled_at,
        publicadoEn: apiPost.published_at,
        creadoPor: apiPost.created_by,
        fechaCreacion: apiPost.created_at
    };
}

// ============================================
// API FUNCTIONS - CAMPAIGNS
// ============================================

/**
 * Obtener todas las campañas de una propuesta
 */
export async function fetchCampaignsByProposal(proposalId: number): Promise<CampaignForUI[]> {
    try {
        const endpoint = `${marketingConfig.endpoints.campaigns.list}?proposal_id=${proposalId}`;
        const url = endpoint.startsWith('http')
            ? endpoint
            : `${marketingConfig.apiUrl}/api${endpoint}`;

        console.log('[campaignService] Fetching campaigns for proposal:', proposalId);

        const response = await authenticatedFetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CampaignFromAPI[] = await response.json();
        console.log('[campaignService] Campaigns fetched:', data.length);

        return data.map(mapCampaignFromAPI);
    } catch (error) {
        console.error('[campaignService] Error fetching campaigns:', error);
        throw error;
    }
}

/**
 * Obtener una campaña por ID
 */
export async function fetchCampaignById(id: number): Promise<CampaignForUI> {
    try {
        const endpoint = marketingConfig.endpoints.campaigns.detail.replace(':id', String(id));
        const url = endpoint.startsWith('http')
            ? endpoint
            : `${marketingConfig.apiUrl}/api${endpoint}`;

        console.log('[campaignService] Fetching campaign by ID:', url);

        const response = await authenticatedFetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CampaignFromAPI = await response.json();
        return mapCampaignFromAPI(data);
    } catch (error) {
        console.error('[campaignService] Error fetching campaign:', error);
        throw error;
    }
}

/**
 * Crear nueva campaña
 */
export async function createCampaign(campaign: CreateCampaignDTO): Promise<CampaignForUI> {
    try {
        const endpoint = marketingConfig.endpoints.campaigns.create;
        const url = endpoint.startsWith('http')
            ? endpoint
            : `${marketingConfig.apiUrl}/api${endpoint}`;

        console.log('[campaignService] Creating campaign:', url);

        const response = await authenticatedFetch(url, {
            method: 'POST',
            body: JSON.stringify(campaign)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CampaignFromAPI = await response.json();
        console.log('[campaignService] Campaign created:', data.id);

        return mapCampaignFromAPI(data);
    } catch (error) {
        console.error('[campaignService] Error creating campaign:', error);
        throw error;
    }
}

/**
 * Actualizar campaña
 */
export async function updateCampaign(id: number, updates: UpdateCampaignDTO): Promise<CampaignForUI> {
    try {
        const endpoint = marketingConfig.endpoints.campaigns.update.replace(':id', String(id));
        const url = endpoint.startsWith('http')
            ? endpoint
            : `${marketingConfig.apiUrl}/api${endpoint}`;

        console.log('[campaignService] Updating campaign:', url);

        const response = await authenticatedFetch(url, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CampaignFromAPI = await response.json();
        console.log('[campaignService] Campaign updated:', data.id);

        return mapCampaignFromAPI(data);
    } catch (error) {
        console.error('[campaignService] Error updating campaign:', error);
        throw error;
    }
}

/**
 * Eliminar campaña
 */
export async function deleteCampaign(id: number): Promise<void> {
    try {
        const endpoint = marketingConfig.endpoints.campaigns.delete.replace(':id', String(id));
        const url = endpoint.startsWith('http')
            ? endpoint
            : `${marketingConfig.apiUrl}/api${endpoint}`;

        console.log('[campaignService] Deleting campaign:', url);

        const response = await authenticatedFetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('[campaignService] Campaign deleted:', id);
    } catch (error) {
        console.error('[campaignService] Error deleting campaign:', error);
        throw error;
    }
}

// ============================================
// API FUNCTIONS - METRICS
// ============================================

/**
 * Obtener métricas de una campaña
 */
export async function fetchCampaignMetrics(campaignId: number): Promise<CampaignMetricsForUI> {
    try {
        const endpoint = marketingConfig.endpoints.campaigns.metrics.replace(':id', String(campaignId));
        const url = endpoint.startsWith('http')
            ? endpoint
            : `${marketingConfig.apiUrl}/api${endpoint}`;

        console.log('[campaignService] Fetching metrics for campaign:', campaignId);

        const response = await authenticatedFetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CampaignMetricsFromAPI = await response.json();
        console.log('[campaignService] Metrics fetched for campaign:', campaignId);

        return mapCampaignMetricsFromAPI(data);
    } catch (error) {
        console.error('[campaignService] Error fetching campaign metrics:', error);
        throw error;
    }
}

// ============================================
// API FUNCTIONS - POSTS
// ============================================

/**
 * Obtener posts de una campaña
 */
export async function fetchCampaignPosts(campaignId: number): Promise<PostForUI[]> {
    try {
        const endpoint = marketingConfig.endpoints.campaigns.posts.replace(':id', String(campaignId));
        const url = endpoint.startsWith('http')
            ? endpoint
            : `${marketingConfig.apiUrl}/api${endpoint}`;

        console.log('[campaignService] Fetching posts for campaign:', campaignId);

        const response = await authenticatedFetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PostFromAPI[] = await response.json();
        console.log('[campaignService] Posts fetched:', data.length);

        return data.map(mapPostFromAPI);
    } catch (error) {
        console.error('[campaignService] Error fetching campaign posts:', error);
        throw error;
    }
}