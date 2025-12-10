import { useState } from 'react';
import { Send, User, Mail, Phone } from 'lucide-react';
import NovaAvatar from '../NovaAvatar';

interface StepContactProps {
    onSubmit: (data: { name: string; email: string; whatsapp: string }) => void;
    onBack: () => void;
}

const StepContact = ({ onSubmit, onBack }: StepContactProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isValid = formData.name && formData.email && formData.whatsapp;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <NovaAvatar size="sm" isThinking />
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Datos de Contacto</h2>
                    <p className="text-muted-foreground">Último paso para recibir tu Plan de Vuelo</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name field */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Tu nombre"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                    />
                </div>

                {/* Email field */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tu@email.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                    />
                </div>

                {/* WhatsApp field */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        WhatsApp
                    </label>
                    <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="+1 234 567 8900"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                    />
                </div>

                <div className="flex justify-between pt-6">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                        ← Atrás
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`group relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden ${isValid
                            ? 'bg-gradient-to-r from-primary to-secondary text-foreground glow-cyan hover:scale-105'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                    >
                        {isValid && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        )}
                        <span className="relative flex items-center gap-2">
                            Recibir Plan de Vuelo
                            <Send className="w-5 h-5" />
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StepContact;
