import React from "react";
import { AnimatedGradientTextDemo } from "./GradientText";
import { MarqueeDemo } from "./MarqueeLogin";


interface ShowcaseProps {
    tagline: string;
}

export function Showcase({ tagline }: ShowcaseProps) {
    return (
        <div className="showcase-panel">
            {/* Background gradient overlay */}
            <div className="showcase-bg" />

            {/* Content */}
            <div className="showcase-content">
                {/* Gradient badge */}
                <AnimatedGradientTextDemo />



                {/* Tagline */}
                <h1 className="showcase-tagline">{tagline}</h1>
            </div>

            {/* Marquee at bottom */}
            <div className="showcase-marquee">
                <MarqueeDemo />
            </div>
        </div>
    );
}
