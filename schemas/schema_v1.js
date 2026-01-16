export const schemaName = "Schema v1 – flat";

export function buildEvent({ action, card, session, user }) {
  return {
    event: action,
    anonymous_id: user.anonymousId,
    user_id: user.userId ?? null,
    session_id: session.id,
    properties: {
      content_id: card.id,
      title: card.title,
      tags: card.tags
    },
    timestamp: new Date().toISOString()
  };
}
