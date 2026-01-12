import React, { useEffect, useState } from 'react';
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from '../../lib/utils';

export const TextGenerateEffect = ({
    words,
    className,
    filter = true,
    duration = 0.5,
}) => {
    const [scope, animate] = useAnimate();
    const wordsArray = words.split(" ");

    useEffect(() => {
        animate(
            "span",
            {
                opacity: 1,
                filter: filter ? "blur(0px)" : "none",
            },
            {
                duration: duration,
                delay: stagger(0.1),
            }
        );
    }, [scope, animate, filter, duration]);

    return (
        <motion.div ref={scope} className={cn("font-bold", className)}>
            {wordsArray.map((word, idx) => (
                <motion.span
                    key={word + idx}
                    className="opacity-0"
                    style={{
                        filter: filter ? "blur(10px)" : "none",
                    }}
                >
                    {word}{" "}
                </motion.span>
            ))}
        </motion.div>
    );
};

export const TypewriterEffect = ({ words, className, cursorClassName }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[currentWordIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayedText.length < currentWord.length) {
                    setDisplayedText(currentWord.slice(0, displayedText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (displayedText.length > 0) {
                    setDisplayedText(currentWord.slice(0, displayedText.length - 1));
                } else {
                    setIsDeleting(false);
                    setCurrentWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentWordIndex, words]);

    return (
        <span className={cn("inline-block", className)}>
            {displayedText}
            <motion.span
                className={cn("inline-block w-[4px] h-[1em] bg-cyan-500 ml-1", cursorClassName)}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            />
        </span>
    );
};

export const GradientText = ({ children, className }) => {
    return (
        <span
            className={cn(
                "bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent",
                className
            )}
        >
            {children}
        </span>
    );
};

export const AnimatedHeading = ({ children, className, as: Component = "h1" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        >
            <Component className={className}>{children}</Component>
        </motion.div>
    );
};

export default TextGenerateEffect;
