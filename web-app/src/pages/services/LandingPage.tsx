import ServiceLayout from '@/components/layout/ServiceLayout';

const LandingPage = () => {
    return (
        <ServiceLayout
            title="Landing Pages de Alto Impacto"
            subtitle="Diseñadas para convertir visitantes en clientes potenciales."
            icon="📄"
            description="Nuestras Landing Pages están optimizadas para la conversión. Combinamos diseño persuasivo, copy estratégico y velocidad de carga para maximizar tus resultados."
            features={[
                "Diseño UX/UI personalizado y responsivo",
                "Redacción persuasiva (Copywriting)",
                "Integración con herramientas de Email Marketing",
                "Formularios de contacto optimizados",
                "Prueba Social (Testimonios y Logos)",
                "Llamadas a la acción (CTAs) claras"
            ]}
            process={[
                { step: 1, title: "Briefing", desc: "Definimos tu objetivo y público." },
                { step: 2, title: "Wireframe", desc: "Estructuramos el contenido." },
                { step: 3, title: "Diseño & Copy", desc: "Creamos la identidad visual y textos." },
                { step: 4, title: "Desarrollo", desc: "Codificamos y optimizamos." }
            ]}
            pricing={[
                {
                    title: "Paquete Estándar",
                    price: "$400 - $800",
                    features: ["Diseño de una sola página", "Formulario de contacto", "Integración básica", "Entrega en 1-2 semanas"]
                }
            ]}
        />
    );
};

export default LandingPage;
