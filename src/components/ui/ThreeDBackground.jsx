import { useEffect, useRef } from "react";

const ThreeDBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const sphereRadius = Math.min(canvas.width, canvas.height) / 3;

    // Particle system for sphere
    const particles = [];
    const particleCount = 120;

    class Particle {
      constructor() {
        // Generate particles on sphere surface
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        this.baseX = centerX + sphereRadius * Math.sin(phi) * Math.cos(theta);
        this.baseY = centerY + sphereRadius * Math.sin(phi) * Math.sin(theta);
        this.baseZ = sphereRadius * Math.cos(phi);
        
        this.x = this.baseX;
        this.y = this.baseY;
        this.z = this.baseZ;
        
        this.theta = theta;
        this.phi = phi;
        this.radius = Math.random() * 1.5 + 0.8;
        this.opacity = Math.random() * 0.4 + 0.5;
        this.speed = Math.random() * 0.01 + 0.005;
      }

      update(time) {
        // Rotate sphere smoothly
        this.theta += this.speed;
        
        this.x = centerX + sphereRadius * Math.sin(this.phi) * Math.cos(this.theta);
        this.y = centerY + sphereRadius * Math.sin(this.phi) * Math.sin(this.theta);
        this.z = sphereRadius * Math.cos(this.phi);
      }

      draw() {
        // Brightness based on z-depth
        const depthFade = (this.z + sphereRadius) / (2 * sphereRadius);
        const finalOpacity = this.opacity * (0.4 + depthFade * 0.6);
        
        ctx.fillStyle = `rgba(99, 102, 241, ${finalOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Draw connections on sphere surface
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const depthFade = ((particles[i].z + particles[j].z) / 2 + sphereRadius) / (2 * sphereRadius);
            const lineOpacity = 0.15 * (1 - distance / 120) * (0.3 + depthFade * 0.7);
            
            ctx.strokeStyle = `rgba(167, 139, 250, ${lineOpacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    let animationId;
    let time = 0;
    
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "rgba(15, 15, 31, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(time);
      });

      // Sort particles by z-depth (back to front)
      particles.sort((a, b) => a.z - b.z);

      // Draw connections first
      drawConnections();

      // Draw particles
      particles.forEach((particle) => {
        particle.draw();
      });

      time++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newRect = canvas.parentElement.getBoundingClientRect();
      canvas.width = newRect.width;
      canvas.height = newRect.height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 rounded-3xl"
      style={{ background: "radial-gradient(circle at 50% 50%, #1f1f3f 0%, #0f0f1f 100%)" }}
    />
  );
};

export default ThreeDBackground;
