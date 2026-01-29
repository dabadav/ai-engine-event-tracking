using System;
using System.Collections.Generic;
using UnityEngine;

namespace AnalyticsSchema
{
    #region 1. Core Shared Models
    [Serializable]
    public class AppInfo {
        public string app_id = "ar_memorial_explorer";
        public string platform = "ar";
        public string build = "0.2.3";
    }

    [Serializable]
    public class UserPosition {
        public float lat;
        public float lon;
        public float alt;
        public float yaw;
        public float pitch;
        public float roll;
    }

    [Serializable]
    public class Entrypoint {
        public string entrypoint_type; // search | filter | menu | map | recommendation
        public string entrypoint_id;
        public string lookup_event_id;
    }

    [Serializable]
    public class Candidate {
        public string content_id;
        public string content_type;
        public int content_rank;
        public float content_visibility;
    }
    #endregion

    #region 2. Event Payloads
    
    // Base class for all events to ensure 'event' and 'app' keys exist
    [Serializable]
    public abstract class BaseEvent {
        public string @event;
        public AppInfo app = new AppInfo();
    }

    // --- SESSION & GLOBAL ---
    [Serializable]
    public class GlobalProperties : BaseEvent {
        public Details details;
        [Serializable] public class Details { public string reason; }
    }

    [Serializable]
    public class SessionStartedProperties : BaseEvent {
        public State state;
        [Serializable] public class State {
            public string language;
            public MapState map;
            public UIState ui;
            public UserPosition initial_position;
        }
        [Serializable] public class MapState { public string time_period; }
        [Serializable] public class UIState { public TopBar top_bar; }
        [Serializable] public class TopBar { public bool randomized; public List<string> visible; }
    }

    [Serializable]
    public class SessionStateChangedProperties : BaseEvent {
        public State state;
        [Serializable] public class State {
            public string state_id;
            public string state_key;
            public string state_value_prev;
            public string state_value_new;
            public string state_trigger;
        }
    }

    // --- SURVEY ---
    [Serializable]
    public class SurveyProperties : BaseEvent {
        public SurveyInfo survey;
        public AnswerInfo answer; // Only for SURVEY_ANSWERED
        public Details details;   // Only for SURVEY_DISMISSED
        
        [Serializable] public class SurveyInfo {
            public string survey_id;
            public string survey_type;
            public int survey_version;
            public string language;
        }
        [Serializable] public class AnswerInfo {
            public string question_id;
            public string question_type;
            public string answer_id;
            public string answer_value;
        }
        [Serializable] public class Details { public string reason; }
    }

    // --- CONTENT & PANEL ---
    [Serializable]
    public class ContentProperties : BaseEvent {
        public CollectionInfo collection; // For Collection events
        public ContentInfo content;       // For Content events
        public PanelInfo panel;           // For Panel events
        public Context context;
        public Details details;

        [Serializable] public class CollectionInfo { public string collection_id; public string collection_type; }
        [Serializable] public class ContentInfo { public string content_id; public string content_type; }
        [Serializable] public class PanelInfo { public string panel_id; public string panel_type; public string panel_name; }
        [Serializable] public class Context { 
            public Entrypoint entrypoint; 
            public UserPosition user_position; 
            public List<Candidate> candidates; 
        }
        [Serializable] public class Details { public string reason; }
    }

    // --- INPUT & LOOKUP ---
    [Serializable]
    public class LookupProperties : BaseEvent {
        public Context context;
        public Details details;

        [Serializable] public class Context { public UserPosition user_position; }
        [Serializable] public class Details {
            public string search_type;
            public string ui_surface;
            public string ui_element;
            public string query_text;
            public object query_struct; // Generic object for flexible structures
            public List<string> filters;
            public string clicked_id;
            public string clicked_label;
            public ChoiceSet choice_set;
        }
        [Serializable] public class ChoiceSet { public string type; public List<string> visible; }
    }

    // --- POSITION ---
    [Serializable]
    public class PositionProperties : BaseEvent {
        public UserPosition user_position;
        public Details details;
        [Serializable] public class Details {
            public int sampling_rate_ms;
            public string input_source;
            public string input_method;
        }
    }
    #endregion

    #region 3. ScriptableObject
    [CreateAssetMenu(fileName = "NewAnalyticsEvent", menuName = "Analytics/Event Configuration")]
    public class AnalyticsEventSO : ScriptableObject
    {
        [Tooltip("Match the event string from the schema (e.g. GLOBAL_STARTED)")]
        public string eventName;
        
        [Header("Contextual Defaults")]
        public string uiSurface;
        public string uiElement;
        
        [Header("ID Mapping")]
        public string id;
        public string label;

        public void Trigger() {
            // Log logic would be handled by your AnalyticsManager
            Debug.Log($"Event {eventName} triggered via ScriptableObject");
        }
    }
    #endregion
}
