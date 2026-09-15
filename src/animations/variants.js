/**
 * Centralized Framer Motion Variants for Royal South Indian Tamil Wedding Invitation
 * Progressive Background Reveal & Cinematic Name Entrance
 */

export const cinematicEase = [0.16, 1, 0.3, 1];
export const springEase = [0.34, 1.56, 0.64, 1];

// Background Progressive Reveal (0.0s -> 2.5s)
// Starts blurred and dimmed, smoothly reveals into full luminous brightness & clarity
export const backgroundArtworkVariants = {
  hidden: {
    filter: 'blur(10px) brightness(0.38) saturate(0.85)',
    scale: 1
  },
  visible: {
    filter: 'blur(0px) brightness(1.05) saturate(1.02)',
    scale: 1,
    transition: {
      duration: 2.5,
      ease: cinematicEase
    }
  }
};

// Cinematic Soft Opening Veil over the Background (0.0s -> 2.5s)
export const backgroundVeilVariants = {
  hidden: {
    opacity: 1
  },
  visible: {
    opacity: 0,
    transition: {
      duration: 2.5,
      ease: cinematicEase
    }
  }
};

// Groom Name Entrance: Starts outside LEFT edge (0.3s -> 2.5s)
export const groomNameVariants = {
  hidden: {
    x: '-60vw',
    opacity: 0,
    filter: 'blur(6px)'
  },
  visible: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 2.2,
      ease: cinematicEase,
      delay: 0.3
    }
  }
};

// Bride Name Entrance: Starts outside RIGHT edge (0.3s -> 2.5s)
export const brideNameVariants = {
  hidden: {
    x: '60vw',
    opacity: 0,
    filter: 'blur(6px)'
  },
  visible: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 2.2,
      ease: cinematicEase,
      delay: 0.3
    }
  }
};

// "weds" script reveal (2.6s -> 3.2s)
export const wedsVariants = {
  hidden: {
    scale: 0.4,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: springEase,
      delay: 2.6
    }
  }
};

// Sacred Herald / Top Invocations (3.2s -> 4.0s)
export const heraldVariants = {
  hidden: {
    y: -18,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: cinematicEase,
      delay: 3.1
    }
  }
};

// Bottom Details / Lockup (3.2s -> 4.0s)
export const detailsVariants = {
  hidden: {
    y: 18,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: cinematicEase,
      delay: 3.3
    }
  }
};

// Scroll Reveal Section
export const scrollSectionVariants = {
  hidden: {
    opacity: 0,
    y: 28
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: cinematicEase
    }
  }
};
