/**
 * CINEMATIC SOUTH INDIAN TAMIL HINDU WEDDING INVITATION CONTROLLER
 * Prithvi Raj & Harshini — 28th January 2027
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. REVEAL / SCRATCH FUNCTIONALITY
  const heroPanel = document.getElementById('panel1');
  const revealButton = document.getElementById('revealButton');

  if (revealButton && heroPanel) {
    revealButton.addEventListener('click', () => {
      heroPanel.classList.add('is-revealed');
      revealButton.setAttribute('aria-expanded', 'true');
      
      // Trigger traditional ambient sound gently if not already playing
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!isAudioPlaying) {
        toggleAmbienceAudio();
      }
    });
  }

  // 2. LIVE COUNTDOWN TIMER (28th January 2027, 09:00 AM IST)
  const weddingDate = new Date('2027-01-28T09:00:00+05:30').getTime();

  function updateCountdown() {
    const now = Date.now();
    const difference = weddingDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Main schedule panel clock
      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');

      if (daysEl) daysEl.textContent = String(days).padStart(3, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

      // Hero mini badge
      const hDays = document.getElementById('h-days');
      const hHours = document.getElementById('h-hours');
      const hMins = document.getElementById('h-mins');
      const hSecs = document.getElementById('h-secs');

      if (hDays) hDays.textContent = String(days).padStart(2, '0');
      if (hHours) hHours.textContent = String(hours).padStart(2, '0');
      if (hMins) hMins.textContent = String(minutes).padStart(2, '0');
      if (hSecs) hSecs.textContent = String(seconds).padStart(2, '0');
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 3. STORY GALLERY CAROUSEL
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let currentSlideIndex = 0;
  let carouselInterval;

  function goToSlide(index) {
    if (slides.length === 0) return;
    slides[currentSlideIndex].classList.remove('active');
    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.remove('active');

    currentSlideIndex = (index + slides.length) % slides.length;

    slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex - 1);
      resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex + 1);
      resetAutoPlay();
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        goToSlide(index);
        resetAutoPlay();
      });
    });

    function startAutoPlay() {
      carouselInterval = setInterval(() => {
        goToSlide(currentSlideIndex + 1);
      }, 5000);
    }

    function resetAutoPlay() {
      clearInterval(carouselInterval);
      startAutoPlay();
    }

    startAutoPlay();
  }

  // 4. RSVP INTERACTION & WHATSAPP GENERATION
  const attendButtons = document.querySelectorAll('.attend-btn');
  let selectedAttendance = 'attending';

  attendButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      attendButtons.forEach((b) => {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      selectedAttendance = btn.getAttribute('data-value');
    });
  });

  const rsvpForm = document.getElementById('rsvpForm');
  const formMessage = document.getElementById('formMessage');
  const whatsappBtn = document.getElementById('whatsappRsvp');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('fullName').value.trim();
      const guestCount = document.getElementById('guestCount').value;
      const mealType = document.getElementById('mealType').value;
      const wishes = document.getElementById('wishes').value.trim();

      if (!fullName) {
        formMessage.textContent = 'Please enter your full name.';
        formMessage.style.color = '#a31d24';
        return;
      }

      formMessage.textContent = `Thank you, ${fullName}! Your RSVP has been received with warm love.`;
      formMessage.style.color = '#1b4b2c';

      // Update WhatsApp link with filled form details
      const statusText = selectedAttendance === 'attending' ? 'Joyfully Accepting' : 'Regretfully Declining';
      let waMsg = `*Wedding RSVP — Prithvi Raj & Harshini*\nName: ${fullName}\nStatus: ${statusText}\nGuests: ${guestCount}\nMeal: ${mealType}`;
      if (wishes) waMsg += `\nWishes: ${wishes}`;

      if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/919876543210?text=${encodeURIComponent(waMsg)}`;
      }

      setTimeout(() => {
        rsvpForm.reset();
        attendButtons[0].click();
      }, 4000);
    });
  }

  // 5. CALENDAR FILE (.ICS) DOWNLOAD
  const calendarButton = document.getElementById('calendarButton');
  if (calendarButton) {
    calendarButton.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Prithvi Raj & Harshini Wedding//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:prithvi-harshini-wedding-20270128@tamilwedding.com',
        'DTSTAMP:20260913T120000Z',
        'DTSTART:20270128T033000Z', // 9:00 AM IST
        'DTEND:20270128T050000Z',   // 10:30 AM IST
        'SUMMARY:Prithvi Raj weds Harshini — Sacred Wedding Muhurtham',
        'LOCATION:Shri Umadri Mahal, Chennai',
        'DESCRIPTION:Join us to celebrate the sacred wedding ceremony of Prithvi Raj & Harshini.',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Prithvi-Raj-weds-Harshini-Wedding.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // 6. VIEW SWITCHER (GRID vs BOOKLET)
  const gridBtn = document.getElementById('gridBtn');
  const bookletBtn = document.getElementById('bookletBtn');
  const invitationGrid = document.getElementById('invitationGrid');

  if (gridBtn && bookletBtn && invitationGrid) {
    gridBtn.addEventListener('click', () => {
      invitationGrid.classList.remove('booklet-view');
      gridBtn.classList.add('active');
      bookletBtn.classList.remove('active');
    });

    bookletBtn.addEventListener('click', () => {
      invitationGrid.classList.add('booklet-view');
      bookletBtn.classList.add('active');
      gridBtn.classList.remove('active');
    });
  }

  // 7. WEBAUDIO SYNTHESIZER: TRADITIONAL TEMPLE TANPURA & VEENA HARMONIC DRONE
  let audioCtx = null;
  let isAudioPlaying = false;
  let synthNodes = [];
  const audioToggle = document.getElementById('audioToggle');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function startIndianAmbience() {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 3);
    masterGain.connect(audioCtx.destination);

    // Tanpura Root Frequencies (Sa: C#3 ~ 138.59Hz, Pa: G#3 ~ 207.65Hz, Sa high: 277.18Hz)
    const baseFreqs = [138.59, 207.65, 277.18, 415.30];
    
    baseFreqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Gentle LFO for warm organic beating
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.2 + i * 0.1, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600 + i * 150, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04 / (i + 1), audioCtx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start();

      synthNodes.push(osc, lfo, gain, filter);
    });

    synthNodes.push(masterGain);
    isAudioPlaying = true;
  }

  function stopIndianAmbience() {
    if (audioCtx && synthNodes.length > 0) {
      const master = synthNodes[synthNodes.length - 1];
      if (master && master.gain) {
        master.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      }
      setTimeout(() => {
        synthNodes.forEach((node) => {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        });
        synthNodes = [];
        isAudioPlaying = false;
      }, 1000);
    } else {
      isAudioPlaying = false;
    }
  }

  function toggleAmbienceAudio() {
    if (isAudioPlaying) {
      stopIndianAmbience();
      if (audioToggle) {
        audioToggle.classList.remove('is-playing');
        audioToggle.setAttribute('aria-pressed', 'false');
      }
    } else {
      startIndianAmbience();
      if (audioToggle) {
        audioToggle.classList.add('is-playing');
        audioToggle.setAttribute('aria-pressed', 'true');
      }
    }
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', toggleAmbienceAudio);
  }
});
