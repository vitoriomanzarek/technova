import type { ReactNode } from 'react';

interface WizardCardProps {
    children: ReactNode;
    className?: string; // Correctly typed as optional string
}

const WizardCard = ({ children, className = '' }: WizardCardProps) => {
    return (
        <div
            className={`glass-card border-gradient p-8 md:p-10 animate-slide-up ${className}`}
            style={{
                background: 'linear-gradient(135deg, hsl(240 15% 15% / 0.6) 0%, hsl(240 15% 10% / 0.8) 100%)',
                backdropFilter: 'blur(20px)',
            }}
        >
            {children}
        </div>
    );
};

export default WizardCard;
