export type AnalyticsEventName =
  | "quiz_created"
  | "quiz_opened"
  | "quiz_started"
  | "quiz_completed"
  | "result_shared"
  | "own_quiz_created_after_completion"
  | "leaderboard_viewed"
  | "preset_question_added";

export interface AnalyticsEvent {
  event: AnalyticsEventName;
  properties?: Record<string, string | number | boolean | undefined>;
  timestamp: string;
}

export function trackEvent(
  event: AnalyticsEventName,
  properties?: Record<string, string | number | boolean | undefined>
) {
  const payload: AnalyticsEvent = {
    event,
    properties,
    timestamp: new Date().toISOString(),
  };

  // 1. Console log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[KnowMe Analytics] 📊 ${event}`, properties);
  }

  // 2. Dispatch via fetch beacon or async POST if available
  if (typeof window !== "undefined") {
    try {
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics", body);
      } else {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-blocking
    }
  }
}
