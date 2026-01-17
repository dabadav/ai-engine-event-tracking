export const schemaName = "Schema v1";
export const schemaVersion = 1;

export function view_start({ item_id, session, user }) {
  return {
    event: "view_start",
    version: schemaVersion,
    properties: {
      item_id
    },
    context: {
      session,
      user
    },
    timestamp: new Date().toISOString()
  };
}

export function view_end({ item_id, dwell_ms, session, user }) {
  return {
    event: "view_end",
    version: schemaVersion,
    properties: {
      item_id,
      dwell_ms
    },
    context: {
      session,
      user
    },
    timestamp: new Date().toISOString()
  };
}
