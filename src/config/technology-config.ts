/**
 * @abstract Config file
 * @description Este archivo contiene la configuracion de la aplicacion.
 * para esto, se ha creado un objeto config que contiene la url de la api y los endpoints.
 **/

export const config = {
  //apiUrl:"https://instituto.cetivirgendelapuerta.com/procesostecnologicos/backend/public/api",
  apiUrl: "http://127.0.0.1:8001/api",
  environment: "development",
  endpoints: {
    // Authentication
    auth: {
      register: "/auth/register",
      login: "/auth/login",
      logout: "/auth/logout",
      me: "/auth/me",
      profile: "/auth/profile",
      forgotPassword: "/auth/forgot-password",
      resetPassword: "/auth/reset-password",
    },

    // Recovery Email
    recoveryEmail: {
      add: "/auth/recovery-email/add",
      verify: "/auth/recovery-email/verify",
      resendCode: "/auth/recovery-email/resend-code",
      remove: "/auth/recovery-email/remove",
    },

    // Two-Factor Authentication (2FA)
    twoFactor: {
      enable: "/auth/2fa/enable",
      verify: "/auth/2fa/verify",
      verifyLogin: "/auth/2fa/verify-login",
      disable: "/auth/2fa/disable",
      regenerateRecoveryCodes: "/auth/2fa/recovery-codes/regenerate",
    },

    // Users Management
    users: {
      list: "/users",
      create: "/users",
      getById: "/users/:id",
      update: "/users/:id",
      delete: "/users/:id",
      assignRoles: "/users/:id/roles",
      assignPermissions: "/users/:id/permissions",
    },

    // Roles Management
    roles: {
      list: "/roles",
      create: "/roles",
      getById: "/roles/:id",
      update: "/roles/:id",
      delete: "/roles/:id",
      assignPermissions: "/roles/:id/permissions",
    },

    // Permissions Management
    permissions: {
      list: "/permissions",
      create: "/permissions",
      getById: "/permissions/:id",
      update: "/permissions/:id",
      delete: "/permissions/:id",
    },

    // Support Tickets Management
    support: {
      // Tickets
      tickets: {
        list: "/support/tickets",
        create: "/support/tickets",
        getById: "/support/tickets/:id",
        update: "/support/tickets/:id",
        close: "/support/tickets/:id/close",
        reopen: "/support/tickets/:id/reopen",
      },
      // Replies
      replies: {
        create: "/support/tickets/:ticketId/replies",
        update: "/support/tickets/:ticketId/replies/:replyId",
        delete: "/support/tickets/:ticketId/replies/:replyId",
      },
      // Attachments
      attachments: {
        download: "/support/attachments/:id/download",
        delete: "/support/attachments/:id",
      },
      // Statistics
      statistics: "/support/statistics",
    },
    // Security Module
    security: {
      // Dashboard
      dashboard: "/security/dashboard",

      // Sessions Management
      sessions: {
        list: "/security/sessions", // Mis sesiones o de un usuario (?user_id=X)
        all: "/security/sessions/all", // Todas las sesiones (solo admin)
        suspicious: "/security/sessions/suspicious", // Sesiones sospechosas
        terminate: "/security/sessions/:sessionId", // Terminar sesión específica
        terminateAll: "/security/sessions/terminate-all", // Terminar todas las sesiones
      },

      // Security Events
      events: {
        list: "/security/events", // Mis eventos (user normal) o de todos (admin)
        recent: "/security/events/recent", // Eventos recientes
        critical: "/security/events/critical", // Eventos críticos
        statistics: "/security/events/statistics", // Estadísticas de eventos
      },
    },

    // Developer Web Module
    developerWeb: {
      // Estadísticas generales
      stats: {
        overall: "/developer-web/stats/overall",
      },

      // News
      news: {
        index: "/developer-web/news",
        show: "/developer-web/news/:id",
        store: "/developer-web/news",
        update: "/developer-web/news/:id",
        destroy: "/developer-web/news/:id",
        published: "/developer-web/news/list/published",
        resetViews: "/developer-web/news/:id/reset-views",
        categories: "/developer-web/news/list/categories",
        stats: "/developer-web/news/stats/summary",
      },

      // Announcements
      announcements: {
        index: "/developer-web/announcements",
        show: "/developer-web/announcements/:id",
        store: "/developer-web/announcements",
        update: "/developer-web/announcements/:id",
        destroy: "/developer-web/announcements/:id",
        published: "/developer-web/announcements/list/published",
        resetViews: "/developer-web/announcements/:id/reset-views",
        stats: "/developer-web/announcements/stats/summary",
      },

      // Alerts
      alerts: {
        index: "/developer-web/alerts",
        show: "/developer-web/alerts/:id",
        store: "/developer-web/alerts",
        update: "/developer-web/alerts/:id",
        destroy: "/developer-web/alerts/:id",
        published: "/developer-web/alerts/list/published",
        stats: "/developer-web/alerts/stats/summary",
      },

      // Chatbot
      chatbot: {
        // Configuración del Chatbot
        config: {
          get: "/developer-web/chatbot/config",
          update: "/developer-web/chatbot/config",
          reset: "/developer-web/chatbot/config/reset",
        },
        // Analytics del Chatbot
        analytics: {
          summary: "/developer-web/chatbot/analytics/summary",
          conversationsByDay: "/developer-web/chatbot/analytics/conversations-by-day",
        },
        // FAQs del Chatbot
        faqs: {
          public: {
            index: "/developer-web/chatbot/faqs/public",
            show: "/developer-web/chatbot/faqs/public/:id",
          },
          categories: "/developer-web/chatbot/faqs/categories",
          index: "/developer-web/chatbot/faqs",
          show: "/developer-web/chatbot/faqs/:id",
          store: "/developer-web/chatbot/faqs",
          update: "/developer-web/chatbot/faqs/:id",
          destroy: "/developer-web/chatbot/faqs/:id",
          stats: "/developer-web/chatbot/faqs/stats/summary",
        },
      },
    },
  }
};