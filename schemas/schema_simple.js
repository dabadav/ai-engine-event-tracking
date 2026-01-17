export const schemaName = "Schema v1 — simple";

export function view_start({ item_id }) {
  return {
    event: "item_view_start",
    properties: { item_id },
    timestamp: new Date().toISOString()
  };
}

export function view_end({ item_id, dwell_ms, session, user }) {
  return {
    event: "item_view_end",
    properties: { item_id },
    timestamp: new Date().toISOString()
  };
}
