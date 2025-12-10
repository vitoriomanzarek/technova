import { useEffect, useState } from 'react';

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
}

const StarBackground = () => {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        const generateStars = () => {
            const newStars: Star[] = [];
            for (let i = 0; i < 200; i++) {
                newStars.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2.5 + 1.5, // Larger stars
                    delay: Math.random() * 5,
                    duration: Math.random() * 3 + 2,
                });
            }
            setStars(newStars);
        };
        generateStars();
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Nebula gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(ellipse at 20% 20%, hsl(274 89% 37% / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, hsl(189 100% 50% / 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, hsl(230 61% 27% / 0.3) 0%, transparent 70%)
          `
                }}
            />

            {/* Stars */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-foreground animate-twinkle animate-drift"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                        boxShadow: star.size > 1.5
                            ? '0 0 8px hsl(189 100% 50% / 0.8)'
                            : '0 0 4px hsl(0 0% 100% / 0.8)',
                    }}
                />
            ))}

            {/* Shooting star effect */}
            <div className="absolute w-1 h-1 bg-primary rounded-full animate-pulse opacity-50"
                style={{
                    left: '30%',
                    top: '20%',
                    boxShadow: '0 0 10px hsl(189 100% 50%), 0 0 20px hsl(189 100% 50% / 0.5)',
                }}
            />
        </div>
    );
};

export default StarBackground;
