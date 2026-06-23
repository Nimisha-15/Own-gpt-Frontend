import React from "react";
import styled from "styled-components";

/* ─────────────────────────────────────────────────────────────
   Full-screen glass-morphism overlay loader
   – position: fixed so it always covers the entire viewport
   – backdrop-filter: blur for the frosted-glass effect
   – the existing 3D box animation is preserved exactly
───────────────────────────────────────────────────────────── */
const Loader = () => {
  return (
    <StyledWrapper>
      {/* Glass overlay */}
      <div className="glass-overlay">
        {/* 3-D boxes */}
        <div className="boxes">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="box">
              <div />
              <div />
              <div />
              <div />
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* ── Full-screen fixed overlay ── */
  .glass-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;

    /* Frosted-glass background */
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
  }

  /* ── Loading label ── */
  .label {
    color: rgba(255, 255, 255, 0.75);
    font-size: 14px;
    font-family: sans-serif;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  /* ── 3-D boxes (unchanged logic) ── */
  .boxes {
    --size: 32px;
    --duration: 800ms;
    height: calc(var(--size) * 2);
    width: calc(var(--size) * 3);
    position: relative;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    margin-top: calc(var(--size) * 1.5 * -1);
    transform: rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px);
  }

  .boxes .box {
    width: var(--size);
    height: var(--size);
    top: 0;
    left: 0;
    position: absolute;
    transform-style: preserve-3d;
  }

  .boxes .box:nth-child(1) {
    transform: translate(100%, 0);
    animation: box1 var(--duration) linear infinite;
  }
  .boxes .box:nth-child(2) {
    transform: translate(0, 100%);
    animation: box2 var(--duration) linear infinite;
  }
  .boxes .box:nth-child(3) {
    transform: translate(100%, 100%);
    animation: box3 var(--duration) linear infinite;
  }
  .boxes .box:nth-child(4) {
    transform: translate(200%, 0);
    animation: box4 var(--duration) linear infinite;
  }

  .boxes .box > div {
    --background: #5c8df6;
    --top: auto;
    --right: auto;
    --bottom: auto;
    --left: auto;
    --translateZ: calc(var(--size) / 2);
    --rotateY: 0deg;
    --rotateX: 0deg;
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--background);
    top: var(--top);
    right: var(--right);
    bottom: var(--bottom);
    left: var(--left);
    transform: rotateY(var(--rotateY)) rotateX(var(--rotateX))
      translateZ(var(--translateZ));
  }

  .boxes .box > div:nth-child(1) {
    --top: 0;
    --left: 0;
  }
  .boxes .box > div:nth-child(2) {
    --background: #145af2;
    --right: 0;
    --rotateY: 90deg;
  }
  .boxes .box > div:nth-child(3) {
    --background: #447cf5;
    --rotateX: -90deg;
  }
  .boxes .box > div:nth-child(4) {
    --background: #dbe3f4;
    --top: 0;
    --left: 0;
    --translateZ: calc(var(--size) * 3 * -1);
  }

  /* ── Keyframes (unchanged) ── */
  @keyframes box1 {
    0%,
    50% {
      transform: translate(100%, 0);
    }
    100% {
      transform: translate(200%, 0);
    }
  }
  @keyframes box2 {
    0% {
      transform: translate(0, 100%);
    }
    50% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(100%, 0);
    }
  }
  @keyframes box3 {
    0%,
    50% {
      transform: translate(100%, 100%);
    }
    100% {
      transform: translate(0, 100%);
    }
  }
  @keyframes box4 {
    0% {
      transform: translate(200%, 0);
    }
    50% {
      transform: translate(200%, 100%);
    }
    100% {
      transform: translate(100%, 100%);
    }
  }
`;

export default Loader;
