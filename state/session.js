let session = null;

export function getSession() {
  if (!session) {
    session = {
      id: crypto.randomUUID(),
      started_at: Date.now()
    };
  }
  return session;
}
