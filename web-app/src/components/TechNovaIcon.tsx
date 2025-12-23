const TechNovaIcon = ({ className = "w-16 h-16" }) => {
    return (
        <svg
            viewBox="0 0 120 120"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Top-Left to Center Diagonal Arm */}
            <path
                d="M 20 10 
                   C 10 10, 5 15, 10 25
                   L 35 50
                   C 40 55, 45 55, 50 50
                   L 60 40
                   C 65 35, 60 25, 50 20
                   L 30 15
                   C 25 12, 22 10, 20 10 Z"
                fill="url(#gradient1)"
            />

            {/* Top-Right to Center Diagonal Arm */}
            <path
                d="M 100 10
                   C 110 10, 115 15, 110 25
                   L 85 50
                   C 80 55, 75 55, 70 50
                   L 60 40
                   C 55 35, 60 25, 70 20
                   L 90 15
                   C 95 12, 98 10, 100 10 Z"
                fill="url(#gradient2)"
            />

            {/* Bottom-Left to Center Diagonal Arm */}
            <path
                d="M 20 110
                   C 10 110, 5 105, 10 95
                   L 35 70
                   C 40 65, 45 65, 50 70
                   L 60 80
                   C 65 85, 60 95, 50 100
                   L 30 105
                   C 25 108, 22 110, 20 110 Z"
                fill="url(#gradient3)"
            />

            {/* Bottom-Right to Center Diagonal Arm */}
            <path
                d="M 100 110
                   C 110 110, 115 105, 110 95
                   L 85 70
                   C 80 65, 75 65, 70 70
                   L 60 80
                   C 55 85, 60 95, 70 100
                   L 90 105
                   C 95 108, 98 110, 100 110 Z"
                fill="url(#gradient4)"
            />

            {/* Gradients */}
            <defs>
                <linearGradient id="gradient1" x1="10%" y1="10%" x2="60%" y2="60%">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
                <linearGradient id="gradient2" x1="90%" y1="10%" x2="40%" y2="60%">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
                <linearGradient id="gradient3" x1="10%" y1="90%" x2="60%" y2="40%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#00E5FF" />
                </linearGradient>
                <linearGradient id="gradient4" x1="90%" y1="90%" x2="40%" y2="40%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#00E5FF" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default TechNovaIcon;
