// Utility helpers
function select(selector, parent = document) {
  return parent.querySelector(selector);
}
function selectAll(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

// Header small behavior: update year
select('#year').textContent = new Date().getFullYear();

// Video play/pause with overlay icon that reflects state
(function initVideo() {
  const video = select('#productVideo');
  const overlayButton = select('#videoOverlay');
  if (!video || !overlayButton) return;

  function syncOverlay() {
    // Show play icon when paused, pause icon when playing
    const isPaused = video.paused;
    overlayButton.querySelector('.play-icon').style.display = isPaused ? 'block' : 'none';
    overlayButton.querySelector('.pause-icon').style.display = isPaused ? 'none' : 'block';
    // Show overlay only when paused, hide when playing (still clickable for pause)
    overlayButton.style.opacity = isPaused ? '1' : '0';
    overlayButton.style.pointerEvents = isPaused ? 'auto' : 'none';
  }

  function togglePlayback() {
    if (video.paused) video.play();
    else video.pause();
  }

  overlayButton.addEventListener('click', togglePlayback);
  video.addEventListener('click', togglePlayback);
  video.addEventListener('play', syncOverlay);
  video.addEventListener('pause', syncOverlay);
  video.addEventListener('ended', syncOverlay);
  syncOverlay();
})();

// Testimonial slider with dots and auto-slide every 5s
(function initTestimonials() {
  const track = select('#testimonialSlides');
  if (!track) return;
  const slides = selectAll('.slide', track);
  const dots = selectAll('.dot');
  let currentIndex = 0;
  let timerId = null;

  function goTo(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === currentIndex)));
  }

  function next() { goTo(currentIndex + 1); }

  function startAuto() {
    stopAuto();
    timerId = setInterval(next, 5000);
  }
  function stopAuto() { if (timerId) clearInterval(timerId); }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAuto();
    });
  });

  // Init
  goTo(0);
  startAuto();

  // Pause auto-rotate while user is hovering
  const slider = track.parentElement;
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
})();

// Contact form -> open success modal, lock scroll, provide close options
(function initContactForm() {
  const form = select('#contactForm');
  const modal = select('#successModal');
  if (!form || !modal) return;

  function openModal() {
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Use built-in HTML validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    openModal();
    form.reset();
  });

  selectAll('[data-close-modal]', modal).forEach((el) => {
    el.addEventListener('click', closeModal);
  });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();