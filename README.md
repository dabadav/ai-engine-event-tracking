
# Jitsu Integration — HTML UI

This guide explains how to send events from a **simple HTML / JavaScript UI** to **Jitsu**, using a clean schema that feeds **ClickHouse → dwell views → AI**.

---

## What Jitsu Does

In this setup, **Jitsu is only an ingestion layer**:

* receives browser events
* assigns timestamps & anonymous IDs
* forwards data to ClickHouse

All analytics and AI logic happen **downstream**.

---

## Architecture

```text
HTML UI
  → Jitsu (p.js)
    → ClickHouse (events)
      → Materialized Views (dwell, projections)
        → AI engine
```

---

## 1. Include Jitsu

Add once, preferably in `<head>`:

```html
<script src="https://<project-id>.d.jitsu.com/p.js" defer></script>
```

Replace `<project-id>` with your Jitsu project ID
(self-hosted users should use their own URL).

---

## 2. Initialize App Context

Run once on page load:

```html
<script>
  window.jitsu = window.jitsu || function () {
    (window.jitsu.q = window.jitsu.q || []).push(arguments)
  }

  window.jitsu("set", {
    app_id: "html-ui",
    environment: "prod"
  })
</script>
```

---

## 3. Event Schema

### Required fields

| Field        | Description                 |
| ------------ | --------------------------- |
| `event`      | Event name                  |
| `app_id`     | Application identifier      |
| `session_id` | Client-generated session ID |

### Optional fields

| Field         | Description              |
| ------------- | ------------------------ |
| `item_id`     | Content / entity ID      |
| `user_id`     | Logged-in user ID        |
| `environment` | `dev`, `staging`, `prod` |

---

## 4. Session ID

Jitsu does **not** manage sessions.

Create one per page/session:

```html
<script>
  const SESSION_ID = crypto.randomUUID()
</script>
```

Reuse this ID for all events.

---

## 5. Send Events

### Basic event

```js
window.jitsu("track", "click", {
  session_id: SESSION_ID
})
```

---

### Start / End events (for dwell time)

```js
window.jitsu("track", "start", {
  session_id: SESSION_ID,
  item_id: "card-1"
})

window.jitsu("track", "end", {
  session_id: SESSION_ID,
  item_id: "card-1"
})
```

⚠️ Dwell time is computed **in ClickHouse**, not in the browser.

---

## 6. Example: Card Interaction

```html
<div class="card" data-id="card-1">Card 1</div>

<script>
  document.querySelectorAll(".card").forEach(card => {
    const id = card.dataset.id

    card.addEventListener("mouseenter", () => {
      window.jitsu("track", "start", {
        session_id: SESSION_ID,
        item_id: id
      })
    })

    card.addEventListener("mouseleave", () => {
      window.jitsu("track", "end", {
        session_id: SESSION_ID,
        item_id: id
      })
    })
  })
</script>
```

---

## 7. User Identity (Optional)

### After login

```js
window.jitsu("identify", {
  user_id: "user-123"
})
```

* anonymous ID remains
* future events include `user_id`
* enables cross-app joins

### On logout

```js
window.jitsu("reset")
```
