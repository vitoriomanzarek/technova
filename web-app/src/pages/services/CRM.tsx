import ServiceLayout from '@/components/layout/ServiceLayout';

const CRM = () => {
    return (
        <ServiceLayout
            title="Implementación de CRM"
            subtitle="Gestiona tus relaciones con clientes como un experto."
            icon="🤝"
            description="Centraliza toda la información de tus clientes en un solo lugar. Implementamos y configuramos sistemas CRM (como HubSpot o Salesforce) para que tu equipo de ventas cierre más tratos y tu equipo de soporte sea más eficiente."
            features={[
                "Configuración inicial de CRM (HubSpot, Zoho, Salesforce)",
                "Migración de bases de datos de clientes",
                "Automatización de flujos de ventas (Pipelines)",
                "Integración con Email y Sitio Web",
                "Segmentación de clientes",
                "Capacitación para tu equipo"
            ]}
            pricing={[
                {
                    title: "Implementación Starter",
                    price: "Desde $1,000",
                    features: ["Configuración cuenta", "Importación contactos", "1 Pipeline de Ventas", "Integración Web"]
                }
            ]}
        />
    );
};

export default CRM;
