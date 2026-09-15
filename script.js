/**
 * SOUTH INDIAN TAMIL NADU ROYAL WEDDING INVITATION CONTROLLER
 * Prithvi Raj ✦ Harshini — 28th January 2027
 * Inspired by suraj-libina.invitationmedia.in with persistent background & cinematic opening
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. REPLAY OPENING ANIMATION ENGINE
  // =========================================================================
  const replayBtn = document.getElementById('replayAnimBtn');
  const revealVeil = document.getElementById('revealVeil');
  const artworkLayer = document.getElementById('artworkLayer');
  const groomCapsule = document.querySelector('.groom-capsule');
  const brideCapsule = document.querySelector('.bride-capsule');
  const wedsCapsule = document.querySelector('.weds-capsule');
  const heraldBlock = document.querySelector('.opening-top-herald');
  const detailsBlock = document.querySelector('.opening-bottom-details');

  function triggerOpeningAnimation() {
    if (!groomCapsule || !brideCapsule || !wedsCapsule) return;

    // Reset animation classes
    if (revealVeil) revealVeil.classList.remove('anim-veil-reveal');
    if (artworkLayer) artworkLayer.classList.remove('anim-artwork-reveal');
    groomCapsule.classList.remove('anim-groom-slide');
    brideCapsule.classList.remove('anim-bride-slide');
    wedsCapsule.classList.remove('anim-weds-reveal');
    if (heraldBlock) heraldBlock.classList.remove('anim-herald');
    if (detailsBlock) detailsBlock.classList.remove('anim-details');

    // Force reflow
    void groomCapsule.offsetWidth;
    if (revealVeil) void revealVeil.offsetWidth;
    if (artworkLayer) void artworkLayer.offsetWidth;

    // Re-apply animation classes
    if (revealVeil) revealVeil.classList.add('anim-veil-reveal');
    if (artworkLayer) artworkLayer.classList.add('anim-artwork-reveal');
    groomCapsule.classList.add('anim-groom-slide');
    brideCapsule.classList.add('anim-bride-slide');
    wedsCapsule.classList.add('anim-weds-reveal');
    if (heraldBlock) heraldBlock.classList.add('anim-herald');
    if (detailsBlock) detailsBlock.classList.add('anim-details');
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', triggerOpeningAnimation);
  }

  // =========================================================================
  // 2. WEB AUDIO API SYNTHESIZER & AUDIO PLAYER ENGINE
  // =========================================================================
  const audioElement = document.getElementById('weddingAudio');
  const floatingMusicBtn = document.getElementById('floatingMusicBtn');
  let isPlayingMusic = false;
  let audioCtx = null;
  let synthInterval = null;

  // Authentic peaceful Indian classical drone synthesizer (Tambura drone in Sa-Pa-Sa)
  function startIndianDroneSynth() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Root Sa = C# (138.59 Hz), Pa = G# (207.65 Hz), High Sa = C# (277.18 Hz)
      const droneNotes = [138.59, 207.65, 277.18, 138.59];
      let noteIndex = 0;

      function playPluck() {
        if (!isPlayingMusic || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Warm harmonic tone
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(droneNotes[noteIndex], audioCtx.currentTime);

        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.5);

        noteIndex = (noteIndex + 1) % droneNotes.length;
      }

      playPluck();
      if (synthInterval) clearInterval(synthInterval);
      synthInterval = setInterval(playPluck, 1200);
    } catch (e) {
      console.warn('Synth error:', e);
    }
  }

  function stopIndianDroneSynth() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function tryPlayAudio() {
    isPlayingMusic = true;
    if (floatingMusicBtn) {
      floatingMusicBtn.classList.add('is-playing');
      floatingMusicBtn.setAttribute('aria-pressed', 'true');
    }

    if (audioElement && audioElement.src) {
      audioElement.play().catch(() => {
        // Built-in Indian ambient synthesizer fallback
        startIndianDroneSynth();
      });
    } else {
      startIndianDroneSynth();
    }
  }

  function toggleAudio() {
    if (isPlayingMusic) {
      isPlayingMusic = false;
      if (audioElement) audioElement.pause();
      stopIndianDroneSynth();
      if (floatingMusicBtn) {
        floatingMusicBtn.classList.remove('is-playing');
        floatingMusicBtn.setAttribute('aria-pressed', 'false');
      }
    } else {
      tryPlayAudio();
    }
  }

  if (floatingMusicBtn) {
    floatingMusicBtn.addEventListener('click', toggleAudio);
  }

  // =========================================================================
  // 3. SIGNATURE HTML5 CANVAS SCRATCH CARD
  // =========================================================================
  const canvas = document.getElementById('scratchCanvas');
  const cuePill = document.getElementById('scratchCuePill');
  let isScratching = false;
  let hasRevealed = false;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Draw luxury metallic gold cover on canvas
    function initCanvasCover() {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#d8aa50');
      grad.addColorStop(0.3, '#fbe39d');
      grad.addColorStop(0.7, '#c28b2e');
      grad.addColorStop(1, '#e2b761');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Gold shimmer borders & Kolam accents
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Text prompt on the scratch card
      ctx.fillStyle = '#4a0812';
      ctx.font = 'bold 15px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ SCRATCH TO REVEAL ✦', width / 2, height / 2 - 14);

      ctx.fillStyle = '#6a1824';
      ctx.font = 'italic 14px "Cormorant Garamond", Georgia, serif';
      ctx.fillText('Our Sacred Wedding Muhurtham Date', width / 2, height / 2 + 12);

      ctx.fillStyle = 'rgba(74, 8, 18, 0.6)';
      ctx.font = '11px "DM Sans", sans-serif';
      ctx.fillText('Swipe or drag across the card with finger / mouse', width / 2, height / 2 + 34);
    }

    initCanvasCover();

    function getCanvasPos(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    function scratch(e) {
      if (!isScratching || hasRevealed) return;
      const pos = getCanvasPos(e);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
      ctx.fill();

      if (cuePill) {
        cuePill.style.opacity = '0';
      }

      checkScratchedPercentage();
    }

    function checkScratchedPercentage() {
      if (hasRevealed) return;
      // Sample every 16th pixel to calculate scratched area
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        let transparentPixels = 0;
        const totalSampled = data.length / 16;

        for (let i = 3; i < data.length; i += 16) {
          if (data[i] === 0) {
            transparentPixels++;
          }
        }

        const percent = (transparentPixels / totalSampled) * 100;
        if (percent > 40) {
          hasRevealed = true;
          canvas.style.transition = 'opacity 0.6s ease';
          canvas.style.opacity = '0';
          setTimeout(() => {
            canvas.style.display = 'none';
          }, 600);
        }
      } catch (err) {
        // Fallback for security contexts
      }
    }

    // Mouse Events
    canvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      scratch(e);
    });
    window.addEventListener('mousemove', (e) => {
      if (isScratching) scratch(e);
    });
    window.addEventListener('mouseup', () => {
      isScratching = false;
    });

    // Touch Events for Mobile
    canvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      scratch(e);
      e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchmove', (e) => {
      if (isScratching) {
        scratch(e);
        e.preventDefault();
      }
    }, { passive: false });
    window.addEventListener('touchend', () => {
      isScratching = false;
    });
  }

  // =========================================================================
  // 4. OUR STORY — POLAROID PHOTO CAROUSEL
  // =========================================================================
  const track = document.getElementById('polaroidTrack');
  const slides = document.querySelectorAll('.polaroid-slide');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  const dotBtns = document.querySelectorAll('.dot-tab');
  let currentSlide = 0;
  const totalSlides = slides.length;

  function updateCarousel(index) {
    if (index < 0) currentSlide = totalSlides - 1;
    else if (index >= totalSlides) currentSlide = 0;
    else currentSlide = index;

    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    dotBtns.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateCarousel(currentSlide - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateCarousel(currentSlide + 1));
  }

  dotBtns.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      updateCarousel(idx);
    });
  });

  // Touch Swipe for Story Carousel
  let startX = 0;
  let endX = 0;
  if (track) {
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      if (diffX > 45) {
        updateCarousel(currentSlide + 1);
      } else if (diffX < -45) {
        updateCarousel(currentSlide - 1);
      }
    }, { passive: true });
  }

  // =========================================================================
  // 5. LIVE MUHURTHAM COUNTDOWN (28th January 2027, 09:00 AM IST)
  // =========================================================================
  const weddingDate = new Date('2027-01-28T09:00:00+05:30').getTime();

  function updateCountdown() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const daysEl = document.getElementById('c-days');
      const hoursEl = document.getElementById('c-hours');
      const minutesEl = document.getElementById('c-minutes');
      const secondsEl = document.getElementById('c-seconds');

      if (daysEl) daysEl.textContent = String(days).padStart(3, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // =========================================================================
  // 6. ADD TO CALENDAR (.ICS) DOWNLOAD
  // =========================================================================
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Prithvi Raj & Harshini Wedding Invitation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:prithvi-harshini-wedding-20270128@tamilwedding.com',
        'DTSTAMP:20260914T000000Z',
        'DTSTART:20270128T033000Z', // 9:00 AM IST
        'DTEND:20270128T050000Z',   // 10:30 AM IST
        'SUMMARY:Prithvi Raj weds Harshini — Sacred Wedding Muhurtham',
        'LOCATION:Shri Umadri Mahal, Chennai',
        'DESCRIPTION:Join us to celebrate the sacred wedding Muhurtham of Prithvi Raj & Harshini.',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Prithvi-Raj-weds-Harshini-Wedding.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // =========================================================================
  // 7. RSVP FORM & DYNAMIC WHATSAPP LINK GENERATOR
  // =========================================================================
  const attendButtons = document.querySelectorAll('.attend-btn');
  let selectedStatus = 'Joyfully Accept';

  attendButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      attendButtons.forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      selectedStatus = btn.getAttribute('data-value');
    });
  });

  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpFeedback = document.getElementById('rsvpFeedback');
  const whatsappLink = document.getElementById('whatsappDirectLink');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('fullName').value.trim();
      const phoneNumber = document.getElementById('phoneNumber').value.trim();
      const guestCount = document.getElementById('guestCount').value;
      const mealPreference = document.getElementById('mealPreference').value;
      const eventsAttending = document.getElementById('eventsAttending').value;
      const wishesMessage = document.getElementById('wishesMessage').value.trim();

      if (!fullName || !phoneNumber) {
        rsvpFeedback.textContent = 'Please enter both your full name and phone number.';
        rsvpFeedback.style.color = '#a51824';
        return;
      }

      rsvpFeedback.textContent = `Thank you, ${fullName}! Your RSVP has been received with warm love and gratitude.`;
      rsvpFeedback.style.color = '#144929';

      let waText = `*Wedding RSVP — Prithvi Raj & Harshini*\nName: ${fullName}\nPhone: ${phoneNumber}\nStatus: ${selectedStatus}\nGuests: ${guestCount}\nEvents: ${eventsAttending}\nFeast: ${mealPreference}`;
      if (wishesMessage) waText += `\nWishes: ${wishesMessage}`;

      if (whatsappLink) {
        whatsappLink.href = `https://wa.me/919876543210?text=${encodeURIComponent(waText)}`;
      }

      // Open WhatsApp automatically
      window.open(`https://wa.me/919876543210?text=${encodeURIComponent(waText)}`, '_blank');

      setTimeout(() => {
        rsvpForm.reset();
        attendButtons[0].click();
      }, 4000);
    });
  }

  // =========================================================================
  // 8. GALLERY LIGHTBOX MODAL
  // =========================================================================
  const galleryItems = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-img');
        const caption = item.getAttribute('data-caption');
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // =========================================================================
  // 9. MOBILE MENU & HEADER SCROLLSPY
  // =========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const headerNav = document.getElementById('headerNav');
  const navLinks = document.querySelectorAll('.header-nav .nav-link');

  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener('click', () => {
      headerNav.classList.toggle('mobile-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        headerNav.classList.remove('mobile-open');
      });
    });
  }

  // Scrollspy active state
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => navObserver.observe(sec));

  // =========================================================================
  // 10. SCROLL REVEAL VIA INTERSECTION OBSERVER
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));
});
