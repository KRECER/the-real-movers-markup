function now() {
  return new Date().getTime();
}

export default function throttle(func, wait, options = {}, ...argsRest) {
  let timeout;
  let context = null;
  let args = argsRest;
  let result;
  let previous = 0;

  const later = function later() {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) {
      context = null;
      args = null;
    }
  };

  const throttled = function throttled() {
    const at = now();
    if (!previous && options.leading === false) previous = at;
    const remaining = wait - (at - previous);
    context = this;
    // args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = at;
      result = func.apply(context, args);
      if (!timeout) {
        context = null;
        args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
    context = null;
    args = null;
  };

  return throttled;
}
