import EyeBall from "./EyeBall";

const PurpleCharacter = ({
  position,
  isTyping,
  showPassword,
  password,
  isBlinking,
  isLookingAtEachOther,
  isPeeking,
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
        left: "70px",
        width: "180px",
        height: passwordMode || isTyping ? "440px" : "400px",
        background: "#6C3FF5",
        borderRadius: "12px 12px 0 0",
        zIndex: 1,

        transform: revealMode
          ? "skewX(0deg)"
          : passwordMode
            ? `skewX(${bodySkew - 12}deg) translateX(40px)`
            : `skewX(${bodySkew}deg)`,

        transformOrigin: "bottom center",
      }}
    >
      <div
        className="absolute flex gap-8 transition-all duration-500"
        style={{
          left: revealMode ? 20 : isLookingAtEachOther ? 55 : 45 + faceX,

          top: revealMode ? 35 : isLookingAtEachOther ? 65 : 40 + faceY,
        }}
      >
        <EyeBall
          size={18}
          pupilSize={7}
          maxDistance={5}
          eyeColor="white"
          pupilColor="#2D2D2D"
          isBlinking={isBlinking}
          forceLookX={
            revealMode
              ? isPeeking
                ? 4
                : -4
              : isLookingAtEachOther
                ? 3
                : undefined
          }
          forceLookY={
            revealMode
              ? isPeeking
                ? 5
                : -4
              : isLookingAtEachOther
                ? 4
                : undefined
          }
        />

        <EyeBall
          size={18}
          pupilSize={7}
          maxDistance={5}
          eyeColor="white"
          pupilColor="#2D2D2D"
          isBlinking={isBlinking}
          forceLookX={
            revealMode
              ? isPeeking
                ? 4
                : -4
              : isLookingAtEachOther
                ? 3
                : undefined
          }
          forceLookY={
            revealMode
              ? isPeeking
                ? 5
                : -4
              : isLookingAtEachOther
                ? 4
                : undefined
          }
        />
      </div>
    </div>
  );
};

export default PurpleCharacter;
