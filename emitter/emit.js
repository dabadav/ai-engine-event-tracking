// emit.js
export function emit(eventName, properties) {
  if (window.rudderanalytics) {
    window.rudderanalytics.track(eventName, properties);
    return;
  }
}
