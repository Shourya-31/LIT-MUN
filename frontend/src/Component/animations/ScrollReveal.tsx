import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    className = '',
    delay = 0,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {

                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px',
            }
        );
        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return (
        <div
            ref={domRef}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible
                ? 'opacity-100 translate-y-0 filter-none'
                : 'opacity-0 translate-y-10 blur-[3px]'
                } ${className}`}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
