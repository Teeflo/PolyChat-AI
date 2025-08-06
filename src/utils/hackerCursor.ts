// Effets de curseur hacker avancés
export class HackerCursor {
  private particles: HTMLElement[] = [];
  private isActive = false;
  private mouseX = 0;
  private mouseY = 0;
  private customCursor: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // Créer le curseur personnalisé
    this.createCustomCursor();
    
    // Écouter les mouvements de souris
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      
      // Mettre à jour la position du curseur personnalisé
      if (this.customCursor) {
        this.customCursor.style.left = `${e.clientX}px`;
        this.customCursor.style.top = `${e.clientY}px`;
      }
      
      if (this.isActive) {
        this.createParticle(e.clientX, e.clientY);
      }
    });

    // Gérer les éléments interactifs
    this.setupHoverEffects();

    // Activer par défaut
    this.activateEffects();
  }

  private createCustomCursor() {
    this.customCursor = document.createElement('div');
    this.customCursor.className = 'custom-cursor';
    document.body.appendChild(this.customCursor);
  }

  private setupHoverEffects() {
    // Ajouter des event listeners pour les éléments interactifs
    const updateHoverState = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
      
      interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
          if (this.customCursor) {
            this.customCursor.classList.add('hover');
          }
        });
        
        element.addEventListener('mouseleave', () => {
          if (this.customCursor) {
            this.customCursor.classList.remove('hover');
          }
        });
      });
    };

    // Mettre à jour au chargement et lors de changements DOM
    updateHoverState();
    
    // Observer les changements DOM pour les nouveaux éléments
    const observer = new MutationObserver(updateHoverState);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  private createParticle(x: number, y: number) {
    // Créer une particule de trace tous les 100ms seulement
    if (Math.random() < 0.3) {
      const particle = document.createElement('div');
      particle.className = 'hacker-cursor-trail';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      document.body.appendChild(particle);
      this.particles.push(particle);

      // Supprimer la particule après l'animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
        const index = this.particles.indexOf(particle);
        if (index > -1) {
          this.particles.splice(index, 1);
        }
      }, 500);
    }
  }

  private activateEffects() {
    this.isActive = true;
    document.body.classList.add('hacker-cursor-active');
    document.body.classList.add('hacker-cursor-custom');
    
    if (this.customCursor) {
      this.customCursor.style.display = 'block';
    }
    
    // Créer des effets de glitch occasionnels
    this.startGlitchEffect();
  }

  private startGlitchEffect() {
    setInterval(() => {
      if (this.isActive && Math.random() < 0.05) { // 5% de chance toutes les secondes
        this.createGlitchCursor();
      }
    }, 1000);
  }

  private createGlitchCursor() {
    const glitch = document.createElement('div');
    glitch.style.cssText = `
      position: fixed;
      left: ${this.mouseX + (Math.random() - 0.5) * 30}px;
      top: ${this.mouseY + (Math.random() - 0.5) * 30}px;
      width: 10px;
      height: 2px;
      background: #00ff41;
      pointer-events: none;
      z-index: 10001;
      animation: glitchFlicker 0.3s ease-out forwards;
      box-shadow: 0 0 5px #00ff41;
    `;
    
    document.body.appendChild(glitch);
    
    setTimeout(() => {
      if (glitch.parentNode) {
        glitch.parentNode.removeChild(glitch);
      }
    }, 300);
  }

  public toggle() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      document.body.classList.add('hacker-cursor-active');
      document.body.classList.add('hacker-cursor-custom');
      if (this.customCursor) {
        this.customCursor.style.display = 'block';
      }
    } else {
      document.body.classList.remove('hacker-cursor-active');
      document.body.classList.remove('hacker-cursor-custom');
      if (this.customCursor) {
        this.customCursor.style.display = 'none';
      }
      // Nettoyer les particules existantes
      this.particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      this.particles = [];
    }
  }

  public destroy() {
    this.isActive = false;
    document.body.classList.remove('hacker-cursor-active');
    document.body.classList.remove('hacker-cursor-custom');
    
    if (this.customCursor && this.customCursor.parentNode) {
      this.customCursor.parentNode.removeChild(this.customCursor);
      this.customCursor = null;
    }
    
    this.particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.particles = [];
  }
}

// Ajouter les animations CSS pour les effets de glitch
const glitchStyles = `
@keyframes glitchFlicker {
  0%, 100% { opacity: 1; transform: scale(1); }
  25% { opacity: 0.3; transform: scale(0.8) skew(2deg); }
  50% { opacity: 0.8; transform: scale(1.2) skew(-1deg); }
  75% { opacity: 0.5; transform: scale(0.9) skew(1deg); }
}

/* Curseur spécial pour le mode "hacking" */
.hacking-mode {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect x='0' y='0' width='32' height='32' fill='%23000000' stroke='%2300ff41' stroke-width='2'/%3E%3Cpath d='M4 8 L12 16 L4 24' stroke='%2300ff41' stroke-width='2' fill='none'/%3E%3Ctext x='16' y='20' font-family='monospace' font-size='10' fill='%2300ff41'%3E%24%3C/text%3E%3Ccircle cx='28' cy='4' r='2' fill='%23ff4757'%3E%3Canimate attributeName='fill' values='%23ff4757;%2300ff41;%23ff4757' dur='0.5s' repeatCount='indefinite'/%3E%3C/circle%3E%3Cpath d='M2 2 L6 2 M26 2 L30 2 M2 30 L6 30 M26 30 L30 30' stroke='%2300ff41' stroke-width='1'/%3E%3C/svg%3E"), auto !important;
}

/* Animation pour les coins de l'écran */
.screen-corners::before,
.screen-corners::after {
  content: '';
  position: fixed;
  width: 20px;
  height: 20px;
  border: 2px solid #00ff41;
  pointer-events: none;
  z-index: 9998;
  opacity: 0.3;
}

.screen-corners::before {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.screen-corners::after {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}
`;

// Injecter les styles
export function injectHackerCursorStyles() {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = glitchStyles;
  document.head.appendChild(styleSheet);
}

// Instance globale
let hackerCursorInstance: HackerCursor | null = null;

export function initHackerCursor() {
  if (!hackerCursorInstance) {
    injectHackerCursorStyles();
    hackerCursorInstance = new HackerCursor();
    
    // Ajouter les coins d'écran
    document.body.classList.add('screen-corners');
  }
  return hackerCursorInstance;
}

export function toggleHackerCursor() {
  if (hackerCursorInstance) {
    hackerCursorInstance.toggle();
  }
}

export function destroyHackerCursor() {
  if (hackerCursorInstance) {
    hackerCursorInstance.destroy();
    hackerCursorInstance = null;
    document.body.classList.remove('screen-corners');
  }
}
