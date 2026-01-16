export const schemaName = "Schema v1 — flat";

export function view_start({ item_id, session, user }) {
  return {
    event: "item_view_start",
    anonymous_id: user.anonymous_id,
    user_id: user.user_id,
    session_id: session.id,
    properties: { item_id },
    timestamp: new Date().toISOString()
  };
}

export function view_end({ item_id, dwell_ms, session, user }) {
  return {
    event: "item_view_end",
    anonymous_id: user.anonymous_id,
    user_id: user.user_id,
    session_id: session.id,
    properties: { item_id },
    timestamp: new Date().toISOString()
  };
}
