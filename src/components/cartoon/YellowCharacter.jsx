import Pupil from "./Pupil";

const YellowCharacter = ({ position, password, showPassword }) => {
  const faceX = position?.faceX || 0;
  const faceY = position?.faceY || 0;
  const bodySkew = position?.bodySkew || 0;

  const revealMode = password.length > 0 && showPassword;

  return (
    <div
      className="absolute bottom-0 transition-all duration-700 ease-in-out"
      style={{
        left: "310px",

        width: "140px",

        height: "230px",

        background: "#E8D754",

        borderRadius: "70px 70px 0 0",

        zIndex: 4,

        transform: revealMode ? "skewX(0deg)" : `skewX(${bodySkew}deg)`,

        transformOrigin: "bottom center",
      }}
    >
      <div
        className="absolute flex gap-6 transition-all duration-300"
        style={{
          left: revealMode ? 20 : 52 + faceX,

          top: revealMode ? 35 : 40 + faceY,
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

      {/* Mouth */}

      <div
        className="absolute h-[4px] w-20 rounded-full bg-[#2D2D2D] transition-all duration-300"
        style={{
          left: revealMode ? 10 : 40 + faceX,

          top: revealMode ? 88 : 88 + faceY,
        }}
      />
    </div>
  );
};

export default YellowCharacter;
