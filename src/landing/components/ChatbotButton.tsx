import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Minimize2, Bot, Sparkles, Loader2, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { config } from "@/config/technology-config";
import { toast } from "sonner";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  source?: "faq" | "gemini" | "fallback";
  faqId?: number;
}

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Animación de apertura e iniciar conversación
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);

      // Iniciar conversación solo si no existe una activa
      if (!conversationId) {
        startConversation();
      }

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // FAQs rápidas del chatbot
  const quickQuestions = [
    "¿Cómo me inscribo?",
    "¿Cuáles son los precios?",
    "¿Tienen certificación?",
    "¿Modalidad de clases?"
  ];

  /**
   * Inicia una nueva conversación con el chatbot
   */
  const startConversation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}${config.endpoints.developerWeb.chatbot.conversation.start}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      // La respuesta puede venir como { success, data: { conversation_id, ... } }
      // o como { success, conversation_id, ... }
      const conversationData = result.data || result;

      if (result.success && conversationData.conversation_id) {
        setConversationId(conversationData.conversation_id);

        // Agregar mensaje de bienvenida
        setMessages([{
          id: 1,
          type: "bot",
          content: conversationData.welcome_message || "¡Hola! Soy el asistente virtual de INCADEV. ¿En qué puedo ayudarte hoy?",
          timestamp: new Date()
        }]);
      } else {
        // Si no hay conversation_id, reintentar o mostrar error
        console.error("No conversation_id received:", result);
        toast.error("No se pudo iniciar la conversación. Intenta de nuevo.");
        setMessages([{
          id: 1,
          type: "bot",
          content: "Lo siento, no pude conectarme. Por favor, cierra y vuelve a abrir el chat.",
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Error de conexión con el chatbot");

      // Mensaje de error - sin conversationId el chat estará deshabilitado
      setMessages([{
        id: 1,
        type: "bot",
        content: "Lo siento, no pude conectarme al servidor. Por favor, cierra y vuelve a abrir el chat.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Envía un mensaje al chatbot y recibe la respuesta
   */
  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId || isTyping) return;

    const userMessage = message.trim();
    const newUserMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch(`${config.apiUrl}${config.endpoints.developerWeb.chatbot.conversation.message}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: userMessage
        })
      });

      const result = await response.json();

      if (result.success && result.data) {
        const botData = result.data;

        // Simular delay de typing si existe
        if (botData.response_delay) {
          await new Promise(resolve => setTimeout(resolve, botData.response_delay));
        }

        const botResponse: Message = {
          id: messages.length + 2,
          type: "bot",
          content: botData.response,
          timestamp: new Date(),
          source: botData.source,
          faqId: botData.faq_id
        };

        setMessages(prev => [...prev, botResponse]);
      } else {
        // Mensaje de fallback
        const fallbackResponse: Message = {
          id: messages.length + 2,
          type: "bot",
          content: result.data?.response || "Lo siento, estoy teniendo dificultades técnicas. ¿Podrías reformular tu pregunta?",
          timestamp: new Date(),
          source: "fallback"
        };
        setMessages(prev => [...prev, fallbackResponse]);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      const errorResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente.",
        timestamp: new Date(),
        source: "fallback"
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Finaliza la conversación actual con feedback
   */
  const endConversation = async (sendFeedback: boolean = false) => {
    if (!conversationId) return;

    try {
      const feedbackData = sendFeedback ? {
        rating: rating || undefined,
        comment: feedbackComment || undefined,
        resolved: true
      } : undefined;

      await fetch(`${config.apiUrl}${config.endpoints.developerWeb.chatbot.conversation.end}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          feedback: feedbackData
        })
      });

      if (sendFeedback) {
        toast.success("¡Gracias por tu feedback!");
      }
    } catch (error) {
      console.error("Error ending conversation:", error);
    } finally {
      // Limpiar estado
      setConversationId(null);
      setMessages([]);
      setShowFeedback(false);
      setRating(0);
      setFeedbackComment("");
    }
  };

  /**
   * Maneja el cierre del chatbot
   */
  const handleClose = () => {
    if (messages.length > 1) {
      setShowFeedback(true);
    } else {
      setIsOpen(false);
      endConversation(false);
    }
  };

  /**
   * Cierra sin feedback
   */
  const handleCloseWithoutFeedback = () => {
    setIsOpen(false);
    endConversation(false);
  };

  /**
   * Envía feedback y cierra
   */
  const handleSubmitFeedback = () => {
    setIsOpen(false);
    endConversation(true);
  };

  /**
   * Envía una pregunta rápida
   */
  const handleQuickQuestion = async (question: string) => {
    if (!conversationId || isTyping) return;

    const userMessage = question.trim();
    const newUserMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    try {
      const response = await fetch(`${config.apiUrl}${config.endpoints.developerWeb.chatbot.conversation.message}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: userMessage
        })
      });

      const result = await response.json();

      if (result.success && result.data) {
        const botData = result.data;

        if (botData.response_delay) {
          await new Promise(resolve => setTimeout(resolve, botData.response_delay));
        }

        const botResponse: Message = {
          id: messages.length + 2,
          type: "bot",
          content: botData.response,
          timestamp: new Date(),
          source: botData.source,
          faqId: botData.faq_id
        };

        setMessages(prev => [...prev, botResponse]);
      } else {
        const fallbackResponse: Message = {
          id: messages.length + 2,
          type: "bot",
          content: result.data?.response || "Lo siento, estoy teniendo dificultades técnicas. ¿Podrías reformular tu pregunta?",
          timestamp: new Date(),
          source: "fallback"
        };
        setMessages(prev => [...prev, fallbackResponse]);
      }
    } catch (error) {
      console.error("Error sending quick question:", error);

      const errorResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente.",
        timestamp: new Date(),
        source: "fallback"
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card
          className={`fixed inset-x-2 bottom-20 sm:bottom-24 sm:right-4 sm:left-auto sm:w-96 h-[75vh] sm:h-[550px] max-h-[calc(100vh-6rem)] shadow-2xl z-50 border overflow-hidden flex flex-col
            ${isAnimating ? 'animate-in slide-in-from-bottom-5 fade-in duration-300' : ''}`}
        >
          {/* Feedback Modal */}
          {showFeedback && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
              <div className="text-center space-y-4 max-w-sm">
                <h3 className="text-lg font-semibold">¿Cómo fue tu experiencia?</h3>
                <p className="text-sm text-muted-foreground">Tu opinión nos ayuda a mejorar</p>

                {/* Rating Stars */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Comment */}
                <Textarea
                  placeholder="Comentarios (opcional)"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="min-h-20"
                />

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCloseWithoutFeedback}
                  >
                    Omitir
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmitFeedback}
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-base font-semibold">Asistente INCADEV</CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>En línea</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 bg-muted/30 flex-1 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-3 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      {msg.type === "bot" && (
                        <Avatar className="h-8 w-8 mr-2 mt-1 shrink-0 border">
                          <AvatarFallback className="bg-primary/10">
                            <Bot className="h-4 w-4 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col max-w-[80%]">
                        <div
                          className={`rounded-2xl px-4 py-2.5 ${
                            msg.type === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md shadow-sm"
                              : "bg-background border border-border rounded-bl-md shadow-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <span className={`text-xs mt-1.5 block ${msg.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {/* Source Badge */}
                        {msg.type === "bot" && msg.source && msg.source !== "fallback" && (
                          <Badge variant="outline" className="text-xs mt-1 ml-2 w-fit">
                            {msg.source === "faq" && "📚 Pregunta frecuente"}
                            {msg.source === "gemini" && "✨ Respuesta IA"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <Avatar className="h-8 w-8 mr-2 mt-1 shrink-0 border">
                        <AvatarFallback className="bg-primary/10">
                          <Bot className="h-4 w-4 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-background border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && !isTyping && (
              <div className="mb-3 p-3 bg-background rounded-lg border shrink-0">
                <div className="flex items-center gap-2 mb-2.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold">Preguntas frecuentes</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs px-3 py-1"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2 items-end shrink-0 bg-background p-3 rounded-lg border">
              {!conversationId && !isLoading ? (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={startConversation}
                >
                  <Loader2 className="h-4 w-4 mr-2" />
                  Reintentar conexión
                </Button>
              ) : (
                <>
                  <Input
                    placeholder={isLoading ? "Conectando..." : "Escribe tu mensaje..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && !isTyping) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={isTyping || isLoading || !conversationId}
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm disabled:opacity-50"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isTyping || isLoading || !message.trim() || !conversationId}
                    className="rounded-lg h-9 w-9 shrink-0"
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Footer Info */}
            <div className="mt-3 pt-3 border-t shrink-0">
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>Powered by Gemini AI</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          size="lg"
          className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6 sm:h-7 sm:w-7" />
          ) : (
            <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
          )}
        </Button>

        {/* Notification badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-green-500 rounded-full flex items-center justify-center shadow-md animate-pulse">
            <Bot className="h-3 w-3 text-white" />
          </span>
        )}
      </div>
    </>
  );
}
