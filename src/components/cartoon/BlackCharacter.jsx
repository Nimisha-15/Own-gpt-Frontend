import EyeBall from "./EyeBall";

const BlackCharacter = ({
  position,
  isTyping,
  showPassword,
  password,
  isBlinking,
  isLookingAtEachOther,
}) => {
  const bodySkew = position?.bodySkew || 0;
  const faceX = position?.faceX || 0;
  const faceY = position?.faceY || 0;

  const passwordMode = password.length > 0 && !showPassword;
  const revealMode = password.length > 0 && showPassword;

  return (
    <div
      className="absolute bottom-0 transition-all duration-700 ease-in-out"
      style={{
        left: "240px",
        width: "120px",
        height: "310px",
        background: "#2D2D2D",
        borderRadius: "8px 8px 0 0",
        zIndex: 2,

        transform: revealMode
          ? "skewX(0deg)"
          : isLookingAtEachOther
            ? `skewX(${bodySkew * 1.5 + 10}deg) translateX(20px)`
            : passwordMode
              ? `skewX(${bodySkew * 1.5}deg)`
              : `skewX(${bodySkew}deg)`,

        transformOrigin: "bottom center",
      }}
    >
      <div
        className="absolute flex gap-6 transition-all duration-500"
        style={{
          left: revealMode ? 10 : isLookingAtEachOther ? 32 : 26 + faceX,

          top: revealMode ? 28 : isLookingAtEachOther ? 12 : 32 + faceY,
        }}
      >
        <EyeBall
          size={16}
          pupilSize={6}
          maxDistance={4}
          eyeColor="white"
          pupilColor="#2D2D2D"
          isBlinking={isBlinking}
          forceLookX={revealMode ? -4 : isLookingAtEachOther ? 0 : undefined}
          forceLookY={revealMode ? -4 : isLookingAtEachOther ? -4 : undefined}
        />

        <EyeBall
          size={16}
          pupilSize={6}
          maxDistance={4}
          eyeColor="white"
          pupilColor="#2D2D2D"
          isBlinking={isBlinking}
          forceLookX={revealMode ? -4 : isLookingAtEachOther ? 0 : undefined}
          forceLookY={revealMode ? -4 : isLookingAtEachOther ? -4 : undefined}
        />
      </div>
    </div>
  );
};

export default BlackCharacter;
