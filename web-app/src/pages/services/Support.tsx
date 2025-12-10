import ServiceLayout from '@/components/layout/ServiceLayout';

const Support = () => {
    return (
        <ServiceLayout
            title="Soporte Técnico y Mantenimiento"
            subtitle="Tu tranquilidad tecnológica garantizada."
            icon="🛠️"
            description="La tecnología requiere cuidado constante. Nuestro servicio de soporte asegura que tus sistemas, sitio web o aplicación funcionen siempre a la perfección, previniendo fallos y resolviendo incidencias rápidamente."
            features={[
                "Monitoreo 24/7 de disponibilidad (Uptime)",
                "Actualizaciones de seguridad y plugins",
                "Copias de seguridad diarias (Backups)",
                "Optimización de velocidad continua",
                "Resolución de incidencias críticas",
                "Asesoría técnica prioritaria"
            ]}
            pricing={[
                {
                    title: "Mantenimiento Mensual",
                    price: "$150 / mes",
                    features: ["Soporte por Ticket", "Backups Diarios", "Actualizaciones CMS", "Informe de Estado"]
                }
            ]}
        />
    );
};

export default Support;
