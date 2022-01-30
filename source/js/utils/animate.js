export default function animate(_ref) {
  const { timing } = _ref;
  const { draw } = _ref;
  const { duration } = _ref;
  const start = performance.now();
  // eslint-disable-next-line no-shadow
  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    const progress = timing(timeFraction);
    draw(progress);
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}
