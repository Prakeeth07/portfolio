/**
 * Interactive Particle Constellation Background
 * Elegant, subtle, performance-friendly constellation with mouse proximity connections.
 * Tailored for Royal Blue & Soft Blue developer portfolio aesthetic.
 */
(function () {
  'use strict';

  // Check reduced motion preference
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Get or dynamically inject canvas
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.className = 'bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var width = 0;
  var height = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var particles = [];
  var animationFrameId = null;
  var isTabActive = true;

  // Mouse tracking
  var mouse = {
    x: -9999,
    y: -9999,
    radius: 170, // Proximity radius where constellation crystallizes
    active: false
  };

  function isDarkTheme() {
    return document.documentElement.dataset.theme === 'dark';
  }

  // Particle Class
  function Particle(x, y) {
    this.x = x !== undefined ? x : Math.random() * width;
    this.y = y !== undefined ? y : Math.random() * height;
    this.baseX = this.x;
    this.baseY = this.y;
    // Gentle drift velocity
    var speed = 0.35;
    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
    // Visual properties
    this.radius = Math.random() * 1.2 + 1.2; // 1.2px - 2.4px
    this.baseAlpha = Math.random() * 0.35 + 0.35; // 0.35 - 0.70
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
    this.pulseAngle = Math.random() * Math.PI * 2;
  }

  Particle.prototype.update = function () {
    if (prefersReducedMotion) return;

    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges gently
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -1;
    } else if (this.x > width) {
      this.x = width;
      this.vx *= -1;
    }

    if (this.y < 0) {
      this.y = 0;
      this.vy *= -1;
    } else if (this.y > height) {
      this.y = height;
      this.vy *= -1;
    }

    // Subtle breathing pulse
    this.pulseAngle += this.pulseSpeed;

    // Mouse proximity gentle interaction
    if (mouse.active) {
      var dx = mouse.x - this.x;
      var dy = mouse.y - this.y;
      var dist = Math.hypot(dx, dy);

      if (dist < mouse.radius && dist > 0) {
        // Very subtle magnetic pull toward mouse
        var force = (1 - dist / mouse.radius) * 0.018;
        this.x += dx * force;
        this.y += dy * force;
      }
    }
  };

  Particle.prototype.draw = function (isDark) {
    var alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.15;
    alpha = Math.max(0.2, Math.min(0.9, alpha));

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    if (isDark) {
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(96, 165, 250, 0.7)';
      ctx.fillStyle = 'rgba(147, 197, 253, ' + alpha + ')';
    } else {
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(37, 99, 235, 0.45)';
      ctx.fillStyle = 'rgba(37, 99, 235, ' + alpha + ')';
    }

    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow for performance
  };

  function initParticles() {
    particles = [];
    // Calculate density based on viewport area (capping for optimal 60fps)
    var targetCount = Math.min(85, Math.max(32, Math.floor((width * height) / 16000)));
    for (var i = 0; i < targetCount; i++) {
      particles.push(new Particle());
    }
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    initParticles();
  }

  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 150);
  });

  // Track mouse coordinates
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', function () {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Support touch proximity
  window.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', function () {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Draw connections between particles and to mouse
  function drawConnections(isDark) {
    var maxDistance = 110;
    var mouseRadius = mouse.radius;

    // Palette values for dark vs light
    var r = isDark ? 96 : 37;
    var g = isDark ? 165 : 99;
    var b = isDark ? 250 : 235;

    var pCount = particles.length;

    for (var i = 0; i < pCount; i++) {
      var p1 = particles[i];

      // 1. Connection between particle and mouse (if cursor is nearby)
      if (mouse.active) {
        var dxm = mouse.x - p1.x;
        var dym = mouse.y - p1.y;
        var distM = Math.hypot(dxm, dym);

        if (distM < mouseRadius) {
          var mAlpha = (1 - distM / mouseRadius) * (isDark ? 0.42 : 0.32);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + mAlpha.toFixed(3) + ')';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }

      // 2. Inter-particle constellation connections
      for (var j = i + 1; j < pCount; j++) {
        var p2 = particles[j];
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        var dist = Math.hypot(dx, dy);

        // Check if either particle is close to the mouse cursor
        var nearMouse = false;
        var connectionThreshold = maxDistance;

        if (mouse.active) {
          var d1m = Math.hypot(mouse.x - p1.x, mouse.y - p1.y);
          var d2m = Math.hypot(mouse.x - p2.x, mouse.y - p2.y);
          if (d1m < mouseRadius || d2m < mouseRadius) {
            nearMouse = true;
            connectionThreshold = 145; // Expand constellation radius around mouse
          }
        }

        if (dist < connectionThreshold) {
          var lineAlpha;
          if (nearMouse) {
            // Brighter star-like geometric pattern near the cursor
            lineAlpha = (1 - dist / connectionThreshold) * (isDark ? 0.38 : 0.28);
          } else {
            // Very subtle ambient constellation web elsewhere
            lineAlpha = (1 - dist / connectionThreshold) * (isDark ? 0.12 : 0.08);
          }

          if (lineAlpha > 0.01) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + lineAlpha.toFixed(3) + ')';
            ctx.lineWidth = nearMouse ? 0.9 : 0.6;
            ctx.stroke();
          }
        }
      }
    }
  }

  // Animation Loop
  function render() {
    if (!isTabActive) return;

    ctx.clearRect(0, 0, width, height);

    var isDark = isDarkTheme();

    // Update & draw particles
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(isDark);
    }

    // Draw connecting constellation lines
    drawConnections(isDark);

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  // Pause when tab not visible to conserve battery & CPU
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      isTabActive = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      isTabActive = true;
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    }
  });

  // Start
  resizeCanvas();
  render();
})();
