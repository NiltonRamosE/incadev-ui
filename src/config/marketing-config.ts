/**
 * @abstract Config file
 * @description Configuración del módulo de marketing.
 */

export const config = {
  apiUrl: "http://127.0.0.1:8002",
  environment: "development",

  endpoints: {
    // Proposals
    proposals: {
      list: "/proposals",
      create: "/proposals",
      detail: "/proposals/:id",
      update: "/proposals/:id",
      delete: "/proposals/:id",
    },

    // Campaigns
    campaigns: {
      list: "/campaigns",
      create: "/campaigns",
      detail: "/campaigns/:id",
      update: "/campaigns/:id",
      delete: "/campaigns/:id",
      stats: "/campaigns/:id/stats",
    },

    // Chatbot
    chatbot: {
      conversaciones: "/chatbot/conversaciones",
      conversacionDetail: "/chatbot/conversaciones/:id",
      sendMessage: "/chatbot/conversaciones/:id/mensaje",
      estadisticas: "/chatbot/estadisticas",
      automatizaciones: "/chatbot/automatizaciones",
      canales: "/chatbot/canales",
      configurarCanal: "/chatbot/canales/:id/configurar",
      testCanal: "/chatbot/canales/:id/test",
    },

    // Posts
    posts: {
      list: "/posts",
      create: "/posts",
      detail: "/posts/:id",
      update: "/posts/:id",
      delete: "/posts/:id",
    },

    // Metrics
    metrics: {
      list: "/metrics",
      detail: "/metrics/:id",
    },

    // Cursos
    cursos: {
      list: "/cursos",
      detail: "/cursos/:id",
      proximos: "/cursos/proximos",
    },

    // Alumnos
    alumnos: {
      resumen: "/alumnos/resumen",
      stats: "/alumnos/stats",
    },
  },

  externalUrls: {
    webhook: {
      whatsapp: "https://instituto.cetivirgendelapuerta.com/api/webhook/wa",
      messenger: "https://instituto.cetivirgendelapuerta.com/api/webhook/messenger",
      instagram: "https://instituto.cetivirgendelapuerta.com/api/webhook/instagram",
      facebook: "https://instituto.cetivirgendelapuerta.com/api/webhook/facebook",
    },
    matricula: {
      base: "https://instituto.cetivirgendelapuerta.com/matricula",
      curso: "https://instituto.cetivirgendelapuerta.com/matricula/:slug",
    },
  },
};
