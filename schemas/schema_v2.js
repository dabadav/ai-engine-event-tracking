export const schemaName = "Schema v2 – nested";

export function buildEvent({ action, card, session, user }) {
  return {
    type: "interaction",
    action,
    actor: {
      anonymous_id: user.anonymousId,
      user_id: user.userId ?? null
    },
    object: {
      id: card.id,
      type: "content",
      tags: card.tags
    },
    context: {
      session_id: session.id,
      ts: Date.now()
    }
  };
}
