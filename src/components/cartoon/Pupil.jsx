import { useEffect, useRef, useState } from "react";

const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = "#2D2D2D",
  forceLookX,
  forceLookY,
}) => {
  const pupilRef = useRef(null);

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
    if (!pupilRef.current) return { x: 0, y: 0 };

    if (forceLookX !== undefined && forceLookY !== undefined) {
      return {
        x: forceLookX,
        y: forceLookY,
      };
    }

    const rect = pupilRef.current.getBoundingClientRect();

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
      ref={pupilRef}
      className="rounded-full will-change-transform"
      style={{
        width: size,
        height: size,
        background: pupilColor,
        transform: `translate(${pos.x}px,${pos.y}px)`,
        transition: "transform .18s cubic-bezier(.22,.61,.36,1)",
      }}
    />
  );
};

export default Pupil;
