import { authenticatedFetch } from './authService';
import { config as marketingConfig } from '../../config/marketing-config';
import type { ProposalFromAPI, ProposalForUI, CreateProposalDTO, UpdateProposalDTO } from './types';

// ============================================
// MAPPER
// ============================================

/**
 * Mapea los datos de propuesta de la API a la estructura que necesita la UI
 */
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
// API FUNCTIONS
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

        console.log('[proposalService] Fetching proposals from:', url);

        const response = await authenticatedFetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProposalFromAPI[] = await response.json();
        console.log('[proposalService] Proposals fetched:', data.length);

        return data.map(mapProposalFromAPI);
    } catch (error) {
        console.error('[proposalService] Error fetching proposals:', error);
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

        console.log('[proposalService] Fetching proposal by ID:', url);

        const response = await authenticatedFetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProposalFromAPI = await response.json();
        return mapProposalFromAPI(data);
    } catch (error) {
        console.error('[proposalService] Error fetching proposal:', error);
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

        console.log('[proposalService] Creating proposal:', url);

        const response = await authenticatedFetch(url, {
            method: 'POST',
            body: JSON.stringify(proposal)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProposalFromAPI = await response.json();
        console.log('[proposalService] Proposal created:', data.id);

        return mapProposalFromAPI(data);
    } catch (error) {
        console.error('[proposalService] Error creating proposal:', error);
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

        console.log('[proposalService] Updating proposal:', url);

        const response = await authenticatedFetch(url, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProposalFromAPI = await response.json();
        console.log('[proposalService] Proposal updated:', data.id);

        return mapProposalFromAPI(data);
    } catch (error) {
        console.error('[proposalService] Error updating proposal:', error);
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

        console.log('[proposalService] Deleting proposal:', url);

        const response = await authenticatedFetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('[proposalService] Proposal deleted:', id);
    } catch (error) {
        console.error('[proposalService] Error deleting proposal:', error);
        throw error;
    }
}