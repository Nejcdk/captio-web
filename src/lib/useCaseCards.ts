// The use case cards on the home page and on /organizations, in this order.
// Their words are home.useCases.<slug> in src/i18n/messages/<code>.json, so
// both pages show them in every language.
export const USE_CASE_CARDS = [
  { slug: "everyday-conversations", icon: "💬" },
  { slug: "deaf-hoh-communication", icon: "🤟" },
  { slug: "meetings", icon: "💼" },
  { slug: "lectures", icon: "🎓" },
  { slug: "doctor-appointments", icon: "🏥" },
  { slug: "job-interviews", icon: "🤝" },
  { slug: "phone-video-calls", icon: "📱" },
  { slug: "group-settings", icon: "👥" },
  { slug: "restaurants", icon: "🍽️" },
  { slug: "traveling", icon: "✈️" },
  { slug: "conferences", icon: "🎤" },
  { slug: "tv-media", icon: "📺" },
] as const;
