// ============================================
// RE-EXPORT ALL TYPES
// ============================================
export type {
    // Students
    StudentProfile,
    StudentFromAPI,
    StudentForUI,

    // Proposals
    ProposalFromAPI,
    ProposalForUI,
    CreateProposalDTO,
    UpdateProposalDTO,

    // Courses
    CourseFromAPI,
    CourseForUI,
    CourseVersionFromAPI,
    CourseVersionForUI,

    // Campaigns
    CampaignFromAPI,
    CampaignForUI,
    CreateCampaignDTO,
    UpdateCampaignDTO,

    // Campaign Metrics
    PostMetricFromAPI,
    CampaignMetricsFromAPI,
    CampaignMetricsForUI,

    // Posts
    PostFromAPI,
    PostForUI
} from './types';

// ============================================
// RE-EXPORT ALL FUNCTIONS
// ============================================

// Students
export { fetchStudents } from './studentService';

// Proposals
export {
    fetchProposals,
    fetchProposalById,
    createProposal,
    updateProposal,
    deleteProposal
} from './proposalService';

// Courses
export {
    fetchCourses,
    fetchVersions
} from './courseService';

// Campaigns
export {
    fetchCampaignsByProposal,
    fetchCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    fetchCampaignMetrics,
    fetchCampaignPosts
} from './campaignService';