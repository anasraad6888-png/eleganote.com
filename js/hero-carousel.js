(function () {
  const root = document.getElementById('heroCarousel');
  if (!root) return;

  const slides = root.querySelectorAll('.hero-slide');
  const dots = root.querySelectorAll('.hero-carousel-dot');
  if (slides.length < 2) return;

  const intervalMs = 4500;
  let index = 0;
  let timer = null;

  function show(next) {
    slides[index].classList.remove('is-active');
    dots[index]?.classList.remove('is-active');
    index = (next + slides.length) % slides.length;
    slides[index].classList.add('is-active');
    dots[index]?.classList.add('is-active');
  }

  function start() {
    stop();
    timer = window.setInterval(() => show(index + 1), intervalMs);
  }

  function stop() {
    if (timer != null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      start();
    });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  start();
})();
