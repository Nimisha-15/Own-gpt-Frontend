import { useEffect, useRef, useState } from "react";

import PurpleCharacter from "./PurpleCharacter";
import BlackCharacter from "./BlackCharacter";
import OrangeCharacter from "./OrangeCharacter";
import YellowCharacter from "./YellowCharacter";

const CartoonScene = ({
  password,
  showPassword,
  emailFocused,
  passwordFocused,
}) => {
  // ==============================
  // Mouse Position
  // ==============================

  const [mouse, setMouse] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  // ==============================
  // Animation States
  // ==============================

  const [purpleBlink, setPurpleBlink] = useState(false);
  const [blackBlink, setBlackBlink] = useState(false);

  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);

  const [purplePeeking, setPurplePeeking] = useState(false);

  // ==============================
  // Character Refs
  // ==============================

  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const orangeRef = useRef(null);
  const yellowRef = useRef(null);

  // ==============================
  // Mouse Tracking
  // ==============================

  useEffect(() => {
    const handleMove = (e) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  // ==============================
  // Purple Blink
  // ==============================

  useEffect(() => {
    let timeout;

    const blink = () => {
      timeout = setTimeout(
        () => {
          setPurpleBlink(true);

          setTimeout(() => {
            setPurpleBlink(false);

            blink();
          }, 150);
        },
        Math.random() * 4000 + 3000,
      );
    };

    blink();

    return () => clearTimeout(timeout);
  }, []);

  // ==============================
  // Black Blink
  // ==============================

  useEffect(() => {
    let timeout;

    const blink = () => {
      timeout = setTimeout(
        () => {
          setBlackBlink(true);

          setTimeout(() => {
            setBlackBlink(false);

            blink();
          }, 150);
        },
        Math.random() * 4000 + 3000,
      );
    };

    blink();

    return () => clearTimeout(timeout);
  }, []);

  // ==============================
  // Look At Each Other
  // ==============================

  useEffect(() => {
    if (!emailFocused && !passwordFocused) {
      setIsLookingAtEachOther(false);
      return;
    }

    setIsLookingAtEachOther(true);

    const timer = setTimeout(() => {
      setIsLookingAtEachOther(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [emailFocused, passwordFocused]);

  // ==============================
  // Purple Sneaky Peek
  // ==============================

  useEffect(() => {
    if (!(showPassword && password.length > 0)) {
      setPurplePeeking(false);
      return;
    }

    let timeout;

    const peek = () => {
      timeout = setTimeout(
        () => {
          setPurplePeeking(true);

          setTimeout(() => {
            setPurplePeeking(false);

            peek();
          }, 800);
        },
        Math.random() * 3000 + 2000,
      );
    };

    peek();

    return () => clearTimeout(timeout);
  }, [showPassword, password]);

  // =====================================
  // Calculate Character Position
  // =====================================

  const calculatePosition = (ref) => {
    if (!ref.current) {
      return {
        faceX: 0,
        faceY: 0,
        bodySkew: 0,
      };
    }

    const rect = ref.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;

    const deltaX = mouse.x - centerX;
    const deltaY = mouse.y - centerY;

    // Face movement
    const faceX = Math.max(-15, Math.min(15, deltaX / 20));

    const faceY = Math.max(-10, Math.min(10, deltaY / 30));

    // Body leaning
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

    return {
      faceX,
      faceY,
      bodySkew,
    };
  };

  // =====================================
  // Character Positions
  // =====================================

  const purplePosition = calculatePosition(purpleRef);

  const blackPosition = calculatePosition(blackRef);

  const orangePosition = calculatePosition(orangeRef);

  const yellowPosition = calculatePosition(yellowRef);

  // =====================================
  // Helpers
  // =====================================

  const isTyping = emailFocused || passwordFocused;

  const passwordMode = password.length > 0 && !showPassword;

  const revealMode = password.length > 0 && showPassword;

  return (
    <div className="relative mx-auto flex h-[500px] w-[550px] items-end justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent blur-sm" />

      {/* Purple Character */}
      <div ref={purpleRef}>
        <PurpleCharacter
          position={purplePosition}
          isTyping={isTyping}
          showPassword={showPassword}
          password={password}
          isBlinking={purpleBlink}
          isLookingAtEachOther={isLookingAtEachOther}
          isPeeking={purplePeeking}
        />
      </div>

      {/* Black Character */}
      <div ref={blackRef}>
        <BlackCharacter
          position={blackPosition}
          isTyping={isTyping}
          showPassword={showPassword}
          password={password}
          isBlinking={blackBlink}
          isLookingAtEachOther={isLookingAtEachOther}
        />
      </div>

      {/* Orange Character */}
      <div ref={orangeRef}>
        <OrangeCharacter
          position={orangePosition}
          password={password}
          showPassword={showPassword}
        />
      </div>

      {/* Yellow Character */}
      <div ref={yellowRef}>
        <YellowCharacter
          position={yellowPosition}
          password={password}
          showPassword={showPassword}
        />
      </div>

      {/* Ground Shadow */}
      <div className="absolute bottom-0 left-1/2 h-3 w-80 -translate-x-1/2 rounded-full bg-black/20 blur-xl" />
    </div>
  );
};

export default CartoonScene;
