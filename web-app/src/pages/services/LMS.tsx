import ServiceLayout from '@/components/layout/ServiceLayout';

const LMS = () => {
    return (
        <ServiceLayout
            title="Plataformas LMS (E-Learning)"
            subtitle="Comparte tu conocimiento y monetiza tus cursos."
            icon="🎓"
            description="Sistemas de Gestión de Aprendizaje (LMS) personalizados para escuelas, expertos e instituciones. Ofrece cursos online con seguimiento de progreso, cuestionarios y certificados."
            features={[
                "Gestión de cursos y lecciones (Video, Texto, PDF)",
                "Perfiles de estudiantes e instructores",
                "Cuestionarios y evaluaciones automáticas",
                "Certificados al completar cursos",
                "Pasarela de pago para venta de cursos",
                "Foros de discusión y comunidad"
            ]}
            process={[
                { step: 1, title: "Arquitectura", desc: "Definición de roles y estructura de cursos." },
                { step: 2, title: "Plataforma", desc: "Instalación y configuración del LMS." },
                { step: 3, title: "Contenido", desc: "Estructura para carga de materiales." },
                { step: 4, title: "Gamificación", desc: "Configuración de logros y certificados." }
            ]}
            pricing={[
                {
                    title: "Plataforma Educativa",
                    price: "$2,000 - $4,000",
                    features: ["Usuarios ilimitados", "Cursos ilimitados", "Sistema de pagos", "Soporte técnico inicial"]
                }
            ]}
        />
    );
};

export default LMS;
