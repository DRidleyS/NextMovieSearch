"use client";

import { useEffect, useState } from "react";

export default function BackgroundVideo() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            zIndex: -2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            pointerEvents: "none",
            backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
              radial-gradient(2px 2px at 60% 70%, white, transparent),
              radial-gradient(1px 1px at 50% 50%, white, transparent),
              radial-gradient(1px 1px at 80% 10%, white, transparent),
              radial-gradient(2px 2px at 90% 60%, white, transparent),
              radial-gradient(1px 1px at 33% 80%, white, transparent),
              radial-gradient(2px 2px at 15% 60%, white, transparent),
              radial-gradient(1px 1px at 70% 40%, white, transparent)`,
            backgroundSize: "200% 200%",
            backgroundPosition:
              "0% 0%, 40% 40%, 80% 80%, 30% 70%, 50% 10%, 90% 30%, 10% 90%, 60% 20%",
          }}
        />
      </>
    );
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
          pointerEvents: "none",
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/k87vvMrrlBo?autoplay=1&mute=1&loop=1&playlist=k87vvMrrlBo&controls=0&showinfo=0&modestbranding=1&playsinline=1"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vw",
            height: "56.25vw",
            minHeight: "100vh",
            minWidth: "177.77vh",
            transform: "translate(-50%, -50%)",
          }}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
