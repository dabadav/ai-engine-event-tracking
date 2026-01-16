export const schemaName = "Schema v2 — semantic";

export function view_start({ item_id, session, user }) {
  return {
    type: "interaction",
    action: "view_start",
    actor: {
      anonymous_id: user.anonymous_id,
      user_id: user.user_id
    },
    object: {
      id: item_id,
      type: "content"
    },
    context: {
      session_id: session.id,
      ts: Date.now()
    }
  };
}

export function view_end({ item_id, dwell_ms, session, user }) {
  return {
    type: "interaction",
    action: "view_end",
    actor: {
      anonymous_id: user.anonymous_id,
      user_id: user.user_id
    },
    object: {
      id: item_id,
      type: "content"
    },
    context: {
      session_id: session.id,
      dwell_ms,
      ts: Date.now()
    }
  };
}
