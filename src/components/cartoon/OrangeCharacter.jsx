import Pupil from "./Pupil";

const OrangeCharacter = ({ position, password, showPassword }) => {
  const faceX = position?.faceX || 0;
  const faceY = position?.faceY || 0;
  const bodySkew = position?.bodySkew || 0;

  const revealMode = password.length > 0 && showPassword;

  return (
    <div
      className="absolute bottom-0 transition-all duration-700 ease-in-out"
      style={{
        left: "0px",
        width: "240px",
        height: "200px",
        background: "#FF9B6B",

        borderRadius: "120px 120px 0 0",

        zIndex: 3,

        transform: revealMode ? "skewX(0deg)" : `skewX(${bodySkew}deg)`,

        transformOrigin: "bottom center",
      }}
    >
      <div
        className="absolute flex gap-8 transition-all duration-300"
        style={{
          left: revealMode ? 50 : 82 + faceX,

          top: revealMode ? 85 : 90 + faceY,
        }}
      >
        <Pupil
          size={12}
          maxDistance={5}
          pupilColor="#2D2D2D"
          forceLookX={revealMode ? -5 : undefined}
          forceLookY={revealMode ? -4 : undefined}
        />

        <Pupil
          size={12}
          maxDistance={5}
          pupilColor="#2D2D2D"
          forceLookX={revealMode ? -5 : undefined}
          forceLookY={revealMode ? -4 : undefined}
        />
      </div>
    </div>
  );
};

export default OrangeCharacter;
