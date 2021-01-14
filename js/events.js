let cookieValue
let pageEventId
let maxScrollY = 0
let pauseScrolling = false
let sentExit = false

export function sendEvent ({
  type,
  version = '1.0.0',
  page_render_duration,
  exit_page_id,
  exit_first_paint,
  exit_dom_interactive,
  exit_dom_complete,
  exit_visit_duration,
  exit_scroll_length,
  link_url,
  search_query,
  search_context,
  navigate_label,
  survey_vote,
  survey_comment,
  survey_email,
  experiment_name,
  experiment_variation,
  experiment_success,
  clipboard_operation
}) {
  const body = {
    _csrf: getCsrf(),

    type, // One of page, exit, link, search, navigate, survey, experiment

    context: {
      // Primitives
      event_id: uuidv4(),
      user: getUserEventsId(),
      version,
      created: new Date().toISOString(),

      // Content information
      path: location.pathname,
      referrer: document.referrer,
      search: location.search,
      href: location.href,
      site_language: location.pathname.split('/')[1],

      // Device information
      // os, os_version, browser, browser_version:
      ...parseUserAgent(),
      viewport_width: document.documentElement.clientWidth,
      viewport_height: document.documentElement.clientHeight,

      // Location information
      timezone: new Date().getTimezoneOffset() / -60,
      user_language: navigator.language
    },

    // Page event
    page_render_duration,

    // Exit event
    exit_page_id,
    exit_first_paint,
    exit_dom_interactive,
    exit_dom_complete,
    exit_visit_duration,
    exit_scroll_length,

    // Link event
    link_url,

    // Search event
    search_query,
    search_context,

    // Navigate event
    navigate_label,

    // Survey event
    survey_vote,
    survey_comment,
    survey_email,

    // Experiment event
    experiment_name,
    experiment_variation,
    experiment_success,

    // Clipboard event
    clipboard_operation
  }
  const blob = new Blob([JSON.stringify(body)], { type: 'application/json' })
  navigator.sendBeacon('/events', blob)
  return body
}
