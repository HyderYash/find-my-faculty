export default function CustomLoader() {
    return (
        <div className="loader-container">
            <div className="loader-content">
                {/* Logo with rings and icon */}
                <div className="loader-logo">
                    <div className="loader-ring loader-ring-outer" />
                    <div className="loader-ring loader-ring-inner" />

                    {/* Center icon */}
                    <div className="loader-icon">
                        <div className="loader-icon-bg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-[#0284c7]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Animated dots */}
                    <div className="loader-dots-container">
                        {[...Array(8)].map((_, i) => {
                            const angle = (i * 45) * (Math.PI / 180);
                            const x = Math.cos(angle) * 32;
                            const y = Math.sin(angle) * 32;

                            return (
                                <div
                                    key={i}
                                    className="loader-dot"
                                    style={{
                                        transform: `translate(${x}px, ${y}px)`,
                                        animation: `ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite`,
                                        animationDelay: `${i * 0.15}s`
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Text content */}
                <div className="loader-text">
                    <h2 className="loader-title">
                        <span className="loader-title-gradient">Find My Faculty</span>
                    </h2>
                    <div className="loader-subtitle">
                        {['L', 'o', 'a', 'd', 'i', 'n', 'g'].map((letter, index) => (
                            <span
                                key={index}
                                className="loading-letter"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animationDuration: '1s'
                                }}
                            >
                                {letter}
                            </span>
                        ))}
                        {['.', '.', '.'].map((dot, index) => (
                            <span
                                key={`dot-${index}`}
                                className="loading-dot"
                                style={{
                                    animationDelay: `${(index + 7) * 0.1}s`,
                                    animationDuration: '1s'
                                }}
                            >
                                {dot}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="loader-progress">
                    <div className="loader-progress-bar" />
                </div>
            </div>
        </div>
    );
} 