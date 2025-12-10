import ServiceLayout from '@/components/layout/ServiceLayout';

const Marketing = () => {
    return (
        <ServiceLayout
            title="Marketing Digital 360°"
            subtitle="Estrategias que conectan, enganchan y convierten."
            icon="🚀"
            description="No basta con tener un gran sitio web; el mundo necesita encontrarlo. Nuestras estrategias integrales de marketing digital están diseñadas para aumentar tu visibilidad, atraer tráfico de calidad y fidelizar a tus clientes."
            features={[
                "SEO On-Page y Off-Page (Posicionamiento Orgánico)",
                "Campañas SEM (Google Ads, Meta Ads)",
                "Email Marketing y Automatización",
                "Gestión de Redes Sociales (Community Management)",
                "Estrategia de Contenidos (Inbound Marketing)",
                "Informes mensuales de rendimiento"
            ]}
            process={[
                { step: 1, title: "Auditoría", desc: "Análisis de tu presencia actual." },
                { step: 2, title: "Estrategia", desc: "Definición de canales y mensajes." },
                { step: 3, title: "Ejecución", desc: "Lanzamiento de campañas y contenidos." },
                { step: 4, title: "Optimización", desc: "Ajustes basados en métricas." }
            ]}
            pricing={[
                {
                    title: "Paquete Crecimiento",
                    price: "$800 / mes",
                    features: ["Gestión de 2 Redes", "SEO Básico", "1 Campaña de Ads", "Informe Mensual"]
                }
            ]}
        />
    );
};

export default Marketing;
