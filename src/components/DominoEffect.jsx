import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { MessageCircle, Users, Target, Award } from 'react-feather';
import styles from './DominoEffect.module.css';

const DOMINO_DATA = [
    {
        icon: MessageCircle,
        title: "Daily Communication",
        description: "Team starts with clear daily updates",
        color: "bg-violet-500"
    },
    {
        icon: Users,
        title: "Team Alignment",
        description: "Everyone understands their role",
        color: "bg-blue-500"
    },
    {
        icon: Target,
        title: "Focused Effort",
        description: "No wasted time on outdated tasks",
        color: "bg-cyan-500"
    },
    {
        icon: Award,
        title: "Research Success",
        description: "Projects completed efficiently",
        color: "bg-emerald-500"
    }
];

const DominoEffect = () => {
    const [positions, setPositions] = useState([0, 0, 0, 0]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const dominoRefs = useRef([]);
    const lastFallenIndex = useRef(-1);

    const handleArrowClick = (index, direction) => {
        const newPositions = [...positions];
        const newPosition = Math.max(-200, Math.min(200, positions[index] + (direction === 'up' ? -20 : 20)));
        newPositions[index] = newPosition;
        setPositions(newPositions);
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const triggerDominoEffect = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setShowResult(false);
        lastFallenIndex.current = -1;
        
        dominoRefs.current.forEach((domino, index) => {
            setTimeout(() => {
                if (!domino) return;

                if (index > 0) {
                    const prevPos = positions[index - 1];
                    const currentPos = positions[index];
                    const gap = Math.abs(prevPos - currentPos);
                    
                    if (gap >= 50) {
                        domino.style.transform = `translateY(${positions[index]}px) rotate(15deg)`;
                        lastFallenIndex.current = index - 1;
                        return;
                    }
                }

                domino.style.transform = `translateY(${positions[index]}px) rotate(90deg)`;
                lastFallenIndex.current = index;
            }, index * 300);
        });

        // Show result after animation completes
        setTimeout(() => {
            const isSuccess = lastFallenIndex.current === dominoRefs.current.length - 1;
            setShowResult(true);
            if (isSuccess) {
                triggerConfetti();
            }
            
            // Reset dominos after showing result
            setTimeout(() => {
                dominoRefs.current.forEach((domino, index) => {
                    if (domino) {
                        domino.style.transform = `translateY(${positions[index]}px)`;
                    }
                });
                setIsAnimating(false);
            }, 2000);
        }, (dominoRefs.current.length * 300) + 1000);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Interactive Domino Effect</h1>
            <p className={styles.description}>
                Adjust each domino's position using the arrows. Keep them close enough to maintain the chain reaction!
            </p>

            <div className={styles.dominoContainer}>
                {DOMINO_DATA.map((data, index) => (
                    <div key={index} className={styles.dominoWrapper}>
                        <div className={styles.controls}>
                            <div className={styles.arrowButtons}>
                                <button 
                                    className={styles.arrowButton} 
                                    onClick={() => handleArrowClick(index, 'up')}
                                    disabled={isAnimating}
                                >↑</button>
                                <button 
                                    className={styles.arrowButton} 
                                    onClick={() => handleArrowClick(index, 'down')}
                                    disabled={isAnimating}
                                >↓</button>
                            </div>
                            <div className={styles.positionText}>Position: {positions[index]}px</div>
                        </div>
                        <div 
                            ref={el => dominoRefs.current[index] = el}
                            className={`${styles.dominoCard} ${data.color}`}
                            style={{ transform: `translateY(${positions[index]}px)` }}
                        >
                            {React.createElement(data.icon, { 
                                className: styles.icon,
                                size: 24,
                                stroke: "currentColor"
                            })}
                            <div className={styles.dominoTitle}>{data.title}</div>
                            <div className={styles.dominoDescription}>{data.description}</div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                className={styles.triggerButton} 
                onClick={triggerDominoEffect}
                disabled={isAnimating}
            >
                <Target className={styles.icon} />
                Trigger Domino Effect
            </button>

            {showResult && (
                <div className={`${styles.statusMessage} ${lastFallenIndex.current < 3 ? styles.error : ''}`}>
                    {lastFallenIndex.current === 3 ? (
                        <>
                            <Award className={styles.icon} />
                            Project successfully completed!
                        </>
                    ) : (
                        <>
                            <MessageCircle className={styles.icon} />
                            Project failed because of bad communication
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default DominoEffect;