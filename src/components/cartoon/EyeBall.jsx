import { useEffect, useRef, useState } from "react";

const EyeBall = ({
  size = 40,
  pupilSize = 14,
  maxDistance = 8,

  eyeColor = "#fff",
  pupilColor = "#2D2D2D",

  isBlinking = false,

  forceLookX,
  forceLookY,
}) => {
  const eyeRef = useRef(null);

  const [mouse, setMouse] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  useEffect(() => {
    const handleMove = (e) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMove);

    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const getPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };

    if (forceLookX !== undefined && forceLookY !== undefined) {
      return {
        x: forceLookX,
        y: forceLookY,
      };
    }

    const rect = eyeRef.current.getBoundingClientRect();

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = mouse.x - cx;
    const dy = mouse.y - cy;

    const angle = Math.atan2(dy, dx);

    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  };

  const pos = getPosition();

  return (
    <div
      ref={eyeRef}
      className="flex items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: isBlinking ? 3 : size,
        background: eyeColor,
        transition: "height .12s ease, transform .25s ease",
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: pupilSize,
            height: pupilSize,
            background: pupilColor,
            transform: `translate(${pos.x}px,${pos.y}px)`,
            transition: "transform .18s cubic-bezier(.22,.61,.36,1)",
          }}
        />
      )}
    </div>
  );
};

export default EyeBall;
