import ServiceLayout from '@/components/layout/ServiceLayout';

const Chatbot = () => {
    return (
        <ServiceLayout
            title="Chatbots con IA"
            subtitle="Atención al cliente instantánea, 24/7."
            icon="🤖"
            description="Mejora la experiencia de usuario y reduce la carga operativa con asistentes virtuales inteligentes. Nuestros chatbots pueden calificar leads, responder preguntas frecuentes y agendar citas automáticamente."
            features={[
                "Diseño de flujos conversacionales",
                "Integración con ChatGPT / OpenAI API",
                "Conexión con WhatsApp, Messenger y Web",
                "Entrenamiento con la información de tu negocio",
                "Escalado a humano cuando es necesario",
                "Análisis de conversaciones"
            ]}
            pricing={[
                {
                    title: "Asistente Virtual",
                    price: "Desde $1,200",
                    features: ["Flujo de bienvenida", "Respuestas FAQ", "Integración Web", "1 Mes de soporte"]
                }
            ]}
        />
    );
};

export default Chatbot;
