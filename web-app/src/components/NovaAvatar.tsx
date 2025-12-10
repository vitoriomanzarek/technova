import novaLogo from '@/assets/nova-logo.png';

interface NovaAvatarProps {
    size?: 'sm' | 'md' | 'lg';
    isThinking?: boolean;
}

const NovaAvatar = ({ size = 'md', isThinking = false }: NovaAvatarProps) => {
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-20 h-20',
        lg: 'w-28 h-28',
    };

    return (
        <div className="relative flex items-center justify-center">
            {/* Outer glow ring */}
            <div
                className={`absolute ${sizeClasses[size]} rounded-full ${isThinking ? 'animate-pulse-glow' : ''}`}
                style={{
                    background: 'linear-gradient(135deg, hsl(189 100% 50% / 0.2), hsl(274 89% 37% / 0.2))',
                    filter: 'blur(10px)',
                    transform: 'scale(1.5)',
                }}
            />

            {/* Inner glow */}
            <div
                className={`absolute ${sizeClasses[size]} rounded-full`}
                style={{
                    background: 'radial-gradient(circle, hsl(189 100% 50% / 0.3) 0%, transparent 70%)',
                    transform: 'scale(1.3)',
                }}
            />

            {/* Logo container */}
            <div
                className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center glass-card border-gradient ${isThinking ? 'animate-float' : ''}`}
                style={{
                    boxShadow: '0 0 30px hsl(189 100% 50% / 0.3), inset 0 0 20px hsl(189 100% 50% / 0.1)',
                }}
            >
                <img
                    src={novaLogo}
                    alt="NOVA AI"
                    className="w-3/4 h-3/4 object-contain drop-shadow-lg"
                    style={{
                        filter: 'drop-shadow(0 0 10px hsl(189 100% 50% / 0.5))',
                    }}
                />
            </div>

            {/* Orbiting dot */}
            {isThinking && (
                <div
                    className="absolute w-2 h-2 bg-primary rounded-full animate-spin"
                    style={{
                        animation: 'spin 3s linear infinite',
                        transformOrigin: 'center',
                        transform: 'translateX(50px)',
                        boxShadow: '0 0 10px hsl(189 100% 50%)',
                    }}
                />
            )}
        </div>
    );
};

export default NovaAvatar;
