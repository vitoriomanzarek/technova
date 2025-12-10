import ServiceLayout from '@/components/layout/ServiceLayout';

const DataAnalysis = () => {
    return (
        <ServiceLayout
            title="Análisis de Datos e Inteligencia"
            subtitle="Convierte datos en decisiones estratégicas."
            icon="📊"
            description="Lo que no se mide, no se puede mejorar. Implementamos sistemas de analítica avanzada para rastrear el comportamiento de tus usuarios, medir el retorno de inversión (ROI) y descubrir nuevas oportunidades de negocio."
            features={[
                "Configuración de Google Analytics 4 (GA4)",
                "Implementación de Google Tag Manager (GTM)",
                "Dashboards personalizados (Looker Studio)",
                "Análisis de embudos de conversión",
                "Mapas de calor y grabación de sesiones",
                "Auditorías de datos"
            ]}
            pricing={[
                {
                    title: "Setup de Analítica",
                    price: "$500 (Pago único)",
                    features: ["Configuración GA4 + GTM", "Definición de KPIs", "1 Dashboard", "Capacitación básica"]
                }
            ]}
        />
    );
};

export default DataAnalysis;
