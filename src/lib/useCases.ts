export type UseCase = {
  slug: string;
  label: string;
  description: string;
};

export const useCases: UseCase[] = [
  {
    slug: "face-to-face",
    label: "Face-to-Face Conversations",
    description: "One-on-one conversations in real time",
  },
  {
    slug: "group-settings",
    label: "Group Settings",
    description: "Social gatherings, dinners, and group discussions",
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
    slug: "traveling",
    label: "Traveling",
    description: "Airports, hotels, restaurants, and tourist situations",
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
