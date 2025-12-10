import ServiceLayout from '@/components/layout/ServiceLayout';

const Ecommerce = () => {
    return (
        <ServiceLayout
            title="Tiendas en Línea (eCommerce)"
            subtitle="Vende tus productos al mundo 24/7."
            icon="🛒"
            description="Desarrollamos tiendas online robustas, seguras y fáciles de administrar. Ya sea que vendas productos físicos o digitales, creamos la plataforma perfecta para tu negocio."
            features={[
                "Catálogo de productos autoadministrable",
                "Pasarelas de pago (Stripe, PayPal, MercadoPago)",
                "Gestión de inventario y pedidos",
                "Cálculo de envíos automático",
                "Diseño optimizado para móviles (Mobile First)",
                "Panel de administración intuitivo"
            ]}
            process={[
                { step: 1, title: "Planificación", desc: "Inventario y estructura de categorías." },
                { step: 2, title: "Configuración", desc: "Setup de CMS o desarrollo a medida." },
                { step: 3, title: "Carga", desc: "Subida de productos iniciales." },
                { step: 4, title: "Pagos y Envíos", desc: "Pruebas de transacciones." }
            ]}
            pricing={[
                {
                    title: "Tienda Completa",
                    price: "$1,500 - $3,000",
                    features: ["Hasta 50 productos (carga inicial)", "Pagos y Envíos configurados", "Capacitación de uso", "Entrega en 3-5 semanas"]
                }
            ]}
        />
    );
};

export default Ecommerce;
