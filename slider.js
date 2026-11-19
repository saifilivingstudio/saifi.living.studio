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
