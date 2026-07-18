"use client";

import type { PointerEvent } from "react";

interface ProjectPreviewProps {
  alt: string;
  height: number;
  src: string;
  width: number;
}

const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--project-focus-x",
    `${event.clientX - bounds.left}px`
  );
  event.currentTarget.style.setProperty(
    "--project-focus-y",
    `${event.clientY - bounds.top}px`
  );
};

export const ProjectPreview = ({
  alt,
  height,
  src,
  width,
}: ProjectPreviewProps) => (
  <div className="project-preview" onPointerMove={handlePointerMove}>
    <img
      alt={alt}
      className="project-preview-base"
      height={height}
      loading="lazy"
      src={src}
      width={width}
    />
    <img
      alt=""
      aria-hidden="true"
      className="project-preview-focus"
      height={height}
      loading="lazy"
      src={src}
      width={width}
    />
  </div>
);
