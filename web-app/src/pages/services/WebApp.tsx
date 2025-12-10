import ServiceLayout from '@/components/layout/ServiceLayout';

const WebApp = () => {
    return (
        <ServiceLayout
            title="Aplicaciones Web a Medida"
            subtitle="Software potente accesible desde cualquier navegador."
            icon="💻"
            description="Desarrollamos soluciones de software complejas adaptadas 100% a tus reglas de negocio. Dashboards, CRMs internos, sistemas de reservas o cualquier herramienta que tu empresa necesite para operar eficientemente."
            features={[
                "Desarrollo Frontend (React) y Backend (Node.js/Python)",
                "Bases de datos seguras y escalables",
                "Autenticación avanzada de usuarios",
                "Paneles de administración (Dashboards)",
                "APIs RESTful o GraphQL",
                "Despliegue en la nube (AWS, Vercel, etc.)"
            ]}
            process={[
                { step: 1, title: "Discovery", desc: "Análisis profundo de requerimientos." },
                { step: 2, title: "Prototipado", desc: "Diseño de UX y flujo de datos." },
                { step: 3, title: "Desarrollo Ágil", desc: "Sprints de desarrollo con demos." },
                { step: 4, title: "QA & Deploy", desc: "Pruebas exhaustivas y lanzamiento." }
            ]}
            pricing={[
                {
                    title: "Proyecto a Medida",
                    price: "Desde $3,000",
                    features: ["Arquitectura escalable", "Código propiedad del cliente", "Documentación técnica", "Garantía de soporte"]
                }
            ]}
        />
    );
};

export default WebApp;
