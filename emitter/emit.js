export function emit(event) {
  console.log("EMIT", event);

  // Later:
  // rudderanalytics.track(...)
  // or
  // fetch(JITSU_ENDPOINT, ...)
}
