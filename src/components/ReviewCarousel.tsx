"use client";

const reviews = [
  {
    name: "Sarah",
    email: "sarah.m***@gmail.com",
    detail: "Hard of hearing since birth",
    quote: "Captio AI changed how I navigate everyday life. I can follow conversations at work, at restaurants, everywhere — without asking people to repeat themselves.",
  },
  {
    name: "James",
    email: "james.l***@gmail.com",
    detail: "University student, deaf",
    quote: "I use it in every lecture. The captions are fast enough that I don't fall behind. My professors don't even need to know.",
  },
  {
    name: "Anna",
    email: "anna.k***@gmail.com",
    detail: "Hard of hearing, Germany",
    quote: "Finally an app that works in German too. I was using English tools with poor accuracy. Captio AI is accurate and instant.",
  },
  {
    name: "Marcus",
    email: "marcus.t***@gmail.com",
    detail: "Deaf since age 7, USA",
    quote: "Doctor appointments used to be the most stressful part of my week. Now I just place my phone on the desk and read everything the doctor says. Game changer.",
  },
  {
    name: "Priya",
    email: "priya.s***@gmail.com",
    detail: "Hard of hearing, India",
    quote: "It works in Hindi and I can't believe how accurate it is. I use it every day at work — my colleagues don't even know I'm using it.",
  },
  {
    name: "Tom",
    email: "tom.w***@gmail.com",
    detail: "Progressive hearing loss, UK",
    quote: "I started losing my hearing two years ago and Captio AI has made the transition so much easier. Meetings at work are no longer something I dread.",
  },
  {
    name: "Yuki",
    email: "yuki.n***@gmail.com",
    detail: "Hard of hearing, Japan",
    quote: "The Japanese support is excellent. I can follow TV programmes and conversations that I couldn't follow before. Very impressed.",
  },
  {
    name: "Elena",
    email: "elena.v***@gmail.com",
    detail: "Deaf, Spain",
    quote: "I use the Live Translator to follow conversations in English when I'm at international events. It translates into Spanish in real time. Incredible.",
  },
  {
    name: "David",
    email: "david.r***@gmail.com",
    detail: "Hard of hearing, Canada",
    quote: "The audio transcription feature is brilliant. I record my university lectures and get a full transcript I can study from. Saves so much time.",
  },
  {
    name: "Fatima",
    email: "fatima.a***@gmail.com",
    detail: "HoH, UAE",
    quote: "Arabic support works very well. I was worried it wouldn't handle our dialect but it does. I recommend it to everyone in my community.",
  },
];

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M4 4h16s2 0 2 2v12s0 2-2 2H4s-2 0-2-2V6s0-2 2-2" strokeWidth="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeWidth="2" />
  </svg>
);

export default function ReviewCarousel() {
  const doubled = [...reviews, ...reviews];

  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-5"
        style={{
          animation: "scroll-left 80s linear infinite",
          width: `max-content`,
        }}
      >
        {doubled.map((r, i) => (
          <div
            key={i}
            className="w-[300px] shrink-0 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col gap-4 relative"
          >
            <div className="absolute top-5 right-5 text-gray-300">
              <MailIcon />
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => <StarIcon key={j} />)}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed flex-1">"{r.quote}"</p>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
              <div className="text-gray-400 text-xs mt-0.5">{r.email}</div>
              <div className="text-gray-400 text-xs mt-0.5">{r.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
