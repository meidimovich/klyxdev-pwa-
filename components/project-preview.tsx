"use client";

import Image from "next/image";
import { useState } from "react";

type ProjectPreviewProps = {
  category: string;
  image?: string;
};

export function ProjectPreview({ category, image }: ProjectPreviewProps) {
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const hasImage = Boolean(image && image !== failedImage);

  return (
    <div
      aria-hidden="true"
      className={`project-preview ${hasImage ? "project-preview-image" : ""}`}
    >
      {hasImage && image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 1023px) 78vw, 33vw"
          unoptimized
          className="project-preview-photo"
          onLoad={() => setLoadedImage(image)}
          onError={() => setFailedImage(image)}
        />
      ) : null}
      {(!hasImage || loadedImage !== image) ? (
        <div className="project-preview-window">
          <div className="project-preview-toolbar">
            <span className="project-preview-controls"><i /><i /><i /></span>
            <span className="project-preview-address" />
            <span className="project-preview-category">{category}</span>
          </div>
          <div className="project-preview-workspace">
            <div className="project-preview-rail"><i /><i /><i /><i /></div>
            <div className="project-preview-canvas">
              <span className="project-preview-kicker" />
              <span className="project-preview-heading" />
              <span className="project-preview-copy" />
              <div className="project-preview-panels">
                <i />
                <i />
                <i />
              </div>
              <div className="project-preview-footer"><i /><i /><i /></div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
