/* Video sliders: arrows scroll the track, one video plays at a time. */
document.querySelectorAll('[data-slider]').forEach(function (root) {
  var track = root.querySelector('.vtrack');
  var prev = root.querySelector('[data-dir="-1"]'), next = root.querySelector('[data-dir="1"]');
  function update() {
    var max = track.scrollWidth - track.clientWidth - 4;
    if (prev) prev.disabled = track.scrollLeft <= 4;
    if (next) next.disabled = track.scrollLeft >= max;
  }
  root.querySelectorAll('.arr').forEach(function (b) {
    b.addEventListener('click', function () {
      track.scrollBy({ left: Number(b.dataset.dir) * track.clientWidth * 0.85, behavior: 'smooth' });
    });
  });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});
document.addEventListener('play', function (e) {
  if (e.target.tagName !== 'VIDEO') return;
  document.querySelectorAll('video').forEach(function (v) { if (v !== e.target) v.pause(); });
}, true);

/* Video posters load only when their slider comes near the screen, so they don't slow the first view. */
(function () {
  var vids = [].slice.call(document.querySelectorAll('video[data-poster]'));
  if (!vids.length) return;
  function show(v) { v.poster = v.getAttribute('data-poster'); v.removeAttribute('data-poster'); }
  if (!('IntersectionObserver' in window)) { vids.forEach(show); return; }
  var groups = new Map();
  vids.forEach(function (v) {
    var g = v.closest('[data-slider]') || v;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(v);
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      groups.get(e.target).forEach(show);
    });
  }, { rootMargin: '600px 0px' });
  groups.forEach(function (_, g) { io.observe(g); });
})();
