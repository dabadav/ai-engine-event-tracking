
How to know when a session starts and end?
How to know when a item is being viewed?
How to know which items appear on screen as possibilities, to know if one was preferred over the other?
How to know where in the virtual space am I?
How to know how did I arrive to a specific item?

---

Event = verb
Entities = things acted upon
Context = shared state

---

SURVEY_PRESENTED
SURVEY_STARTED
SURVEY_ANSWERED
SURVEY_SUBMITTED
SURVEY_DISMISSED

SESSION_STARTED
SESSION_ENDED

EXHIBITION_STARTED
EXHIBITION_ENDED

ITEM_VIEW_STARTED
ITEM_VIEW_ENDED
ITEM_EXPOSED

FILTER_APPLIED
FILTER_REMOVED
SEARCH_EXECUTED

AVATAR_POSITION_UPDATED
AVATAR_MOVEMENT_STARTED
AVATAR_MOVEMENT_STOPPED

---

{
  "event": "SURVEY_PRESENTED",
  "object": {
    "object_type": "survey",
    "object_id": "srv_001"
  },
  "context": {
    "surface": "modal | sidebar | end_of_session",
    "trigger": "ITEM_VIEW_ENDED | SESSION_ENDED | manual"
  }
}

{
  "event": "SURVEY_ANSWERED",
  "object": {
    "object_type": "survey",
    "object_id": "srv_001"
  },
  "properties": {
    "question_id": "q_03",
    "answer_type": "rating",
    "answer_value": 4
  }
}

{
  "event": "ITEM_VIEW_STARTED",
  "object": {
    "object_id": "itm_987",
    "object_type": "item"
  },
  "entry_context": {
    "source_type": "search | filter | exhibition | movement | recommendation | direct | external",
    "source_id": "srch_abc123",
    "source_event": "AVATAR_MOVEMENT_STOPPED"
  },
  "coordinates": {
    "position": {
      "x": 18.9,
      "y": 1.8,
      "z": -9.3
    },
    "input_method": "joystick | keyboard | teleport"
  }
  "screen_context": {
    "surface": "viewport",
    "candidates": [
      { "object_id": "itm_987", "rank": 1, "visibility_ratio": 0.62 },
      { "object_id": "itm_654", "rank": 2, "visibility_ratio": 0.62 }
    ]
  }
}

>> DISTANCE TO OBJECT, ZONES (SUBCAMPS,...)
>> ITEM EXPOSED IN SCREEN

{
  "event": "ITEM_EXPOSED",
  "object": {
    "object_type": "item",
    "object_id": "itm_123"
  },
  "context": {
    "surface": "viewport",
    "exhibition_id": "exh_01"
  },
  "properties": {
    "rank": 3,
    "visibility_ratio": 0.62
  }
}

---

SESSION_START
  First user activity
  Or app open / scene load
  Or resume after inactivity > T (e.g. 30 min)

SESSION_ENDED
  Explicit exit / app close
  Or inactivity timeout
  Or crash / disconnect (best-effort)

ITEM_VIEW_STARTED
  “Viewed” means the item is the primary focus, not merely visible.
  Focus achieved

ITEM_VIEW_ENDED
  focus lost / movement / timeout

