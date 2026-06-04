export type UseCase = {
  slug: string;
  label: string;
  description: string;
};

export const useCases: UseCase[] = [
  {
    slug: "everyday-conversations",
    label: "Everyday Conversations",
    description: "One-on-one conversations in daily life",
  },
  {
    slug: "deaf-hoh-communication",
    label: "Communicating with Deaf & HoH",
    description: "Help hearing people follow and respond to deaf or HoH individuals",
  },
  {
    slug: "meetings",
    label: "Meetings",
    description: "Work meetings, video calls, and team standups",
  },
  {
    slug: "lectures",
    label: "Lectures",
    description: "University lectures, classes, and educational events",
  },
  {
    slug: "doctor-appointments",
    label: "Doctor Appointments",
    description: "Medical consultations and healthcare visits",
  },
  {
    slug: "job-interviews",
    label: "Job Interviews",
    description: "In-person and remote job interviews",
  },
  {
    slug: "phone-video-calls",
    label: "Phone & Video Calls",
    description: "Speakerphone calls, FaceTime, Zoom, and remote conversations",
  },
  {
    slug: "group-settings",
    label: "Group Settings",
    description: "Social gatherings, dinners, and group discussions",
  },
  {
    slug: "restaurants",
    label: "Restaurants & Cafes",
    description: "Ordering food, talking to staff, and dining conversations",
  },
  {
    slug: "traveling",
    label: "Traveling",
    description: "Airports, hotels, transit, and tourist situations",
  },
  {
    slug: "conferences",
    label: "Conferences & Events",
    description: "Talks, panels, keynotes, and networking events",
  },
  {
    slug: "tv-media",
    label: "TV & Media",
    description: "Television, streaming, podcasts, and online videos",
  },
];

export function getUseCaseBySlug(slug: string): UseCase | undefined {
  return useCases.find((uc) => uc.slug === slug);
}
