import React from "react";
import { ISocial_Media_Props } from "@/lib/types";

const Pinterest: React.FC<ISocial_Media_Props> = ({
    className,
    color = "currentColor",
    width = 24,
    style,
}) => {
    const aspectRatio = 24 / 24;
    const height = width * aspectRatio;

    return (
        <span className={className}>
            <svg
                width={width}
                height={height}
                viewBox="0 0 24 24"
                fill="none"
                style={{ width, height, ...style }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="12" r="12" fill={color} opacity="0.1"/>
                <path
                    d="M12 2C6.476 2 2 6.477 2 12c0 4.19 2.666 7.754 6.398 8.86-.088-.753-.168-1.91.035-2.733.183-.752 1.177-4.788 1.177-4.788s-.299-.599-.299-1.486c0-1.393.808-2.433 1.813-2.433.855 0 1.267.641 1.267 1.409 0 .858-.547 2.142-.829 3.334-.236.991.501 1.799 1.484 1.799 1.781 0 3.15-1.877 3.15-4.585 0-2.401-1.729-4.075-4.2-4.075-2.864 0-4.542 2.152-4.542 4.383 0 .868.333 1.802.749 2.309.083.101.094.189.069.29-.075.319-.244 1.01-.277 1.149-.044.186-.144.225-.334.137-1.253-.519-2.031-2.143-2.031-3.451 0-2.811 2.036-5.397 6.102-5.397 3.201 0 5.692 2.279 5.692 5.317 0 3.19-2.008 5.756-4.792 5.756-1.024 0-1.988-.553-2.315-1.176l-.629 2.398c-.188.717-.556 1.616-.828 2.167.624.193 1.285.297 1.974.297 5.523 0 10-4.478 10-10S17.523 2 12 2z"
                    fill={color}
                />
            </svg>
        </span>
    );
};

export default Pinterest;
