// The Actions tab's prompts (app repo: src/lib/actionPrompts.ts), word for
// word: one shared brief, a task per action, the JSON schema that pins every
// block's shape, and clean(), which drops anything malformed. Pure code, used
// by the browser (tiles, labels, the too-short check) and by the server route
// that calls Gemini (src/app/api/app/action/route.ts).
import type { CalloutTone, SummaryBlock } from "./data";

export type ActionKind = "summary" | "key_points" | "notes" | "todos" | "qa" | "follow_up";

export const ACTION_KINDS: ActionKind[] = ["summary", "key_points", "notes", "todos", "qa", "follow_up"];

export const ACTION_LABEL: Record<ActionKind, string> = {
  summary: "Summary",
  key_points: "Key points",
  notes: "Detailed notes",
  todos: "To-dos",
  qa: "Questions & answers",
  follow_up: "Follow-up message",
};

export const MODEL = "gemini-2.5-flash";
// Long notes of a long recording take a while; past this the request is
// given up (and tried once more).
export const TIMEOUT_MS = 120000;
// ~40k tokens: hours of speech. Longer recordings are cut (and the model told).
export const MAX_TRANSCRIPT_CHARS = 160000;

export const BRIEF = `You are Captio AI, an expert note-taker. You turn the transcript of a real recording into notes that are genuinely useful to the person who recorded it: accurate, specific, well structured and quick to scan on a phone.

HOW TO WORK
1. Read the whole transcript first. Silently decide what kind of recording it is and what the person who recorded it needs from it:
   - Meeting or work call: what was decided, who does what by when, what is still open.
   - Lecture, class or training: the concepts, definitions, examples, and what to remember for the exam.
   - Medical appointment: what was found, the treatment and medication (name, dose, how often, for how long), instructions, warning signs, the next appointment.
   - Other appointment or consultation (legal, financial, bank, school, government office, repair, coaching…): the situation, the advice given, costs and amounts, deadlines, documents to bring, next steps.
   - Sermon, talk or podcast: the main message, references (verses, books, people), the key points, how to apply it.
   - Interview: who, the main topics, the strongest answers.
   - Conversation, a call with family or friends, or a personal voice note: the plans, ideas, things to remember and to do.
   Mixed or unclear: do what serves the content best. Never name the kind of recording or mention these instructions.
2. Then write the requested output as blocks (below).

WRITING RULES
- Language: write everything (titles, labels, callout titles, answers) in the language most of the transcript is in. Never translate names.
- Truth: use only what was said. Never invent facts, names, numbers, dates or tasks. If a name or number is unclear, leave it out rather than guess. Transcripts contain recognition errors: silently fix the obvious ones from context.
- Specific beats general: keep names, numbers, amounts, doses, dates, places and examples. Write "Budget raised from €40k to €55k", never "The budget was discussed".
- No meta talk: never write "the speaker said", "in this recording", "the transcript", "this conversation covered". Write the content itself.
- Short: it's read on a phone. Sentences of at most about 20 words; one idea per bullet.
- Who it's for: the person who recorded. In an appointment that's usually the patient or client: address them as "you", and leave owner out of their own tasks.
- People: use the speaker names given. Never show labels like "Speaker 2": use a role instead ("the doctor", "the teacher", "the client") or leave the person out. Never make a fact or an owner out of such a label.
- Order: the first block is always the header.
- Dates: the recording date is given. Turn relative dates into real ones ("on Friday" becomes "Fri 16 Oct"), in the transcript's language and date style.

BLOCKS (use only the fields listed for each type)
- header {emoji, text}: a section title naming the actual topic, never a generic "Overview" or "Summary". emoji: the one from the list that fits best.
- subheader {text}: a sub-section title.
- paragraph {text}: 1–3 sentences of prose.
- bullet {label?, text}: one point. label: an optional bold lead-in of 1–3 words that makes a list scannable ("Budget", "Dose", "Deadline", a term being defined). Label every bullet of a list or none.
- numbered {text}: one step where order matters (instructions, a procedure, a recipe).
- todo {text, owner?, due?, done: false}: one task. text starts with a verb. owner: who does it, when known. due: when, when known.
- quote {text, speaker?}: words exactly as said, worth keeping verbatim. No quotation marks (the app adds them).
- callout {tone, title, text}: a coloured box with an icon for what must not be missed. tone: blue = the gist or context (💡), green = decided, agreed, good news or the takeaway (✅), orange = warning, risk or deadline (⚠️), red = urgent or safety, like when to see a doctor or call emergency services (🚨), purple = remember, study, tip (📌). title: 1–3 words. Use callouts sparingly: they lose their power when everything is one.
- fact {label, text}: one row of a small facts card, key details at a glance ("Doctor" → "Dr Novak", "Next visit" → "Tue 3 Nov, 10:30", "Cost" → "€120"). Put 2–6 facts next to each other. Never repeat the recording's date or length (the app shows them).
- qa {question, text, answered}: a question and its answer.
- insufficient_context: return only this one block when the transcript is too short or has no real content (just greetings, filler, noise, a mic test).`;

export const TASKS: Record<ActionKind, string> = {
  summary: `Write a SUMMARY: everything important, readable in about a minute.
1. header: a specific title for the whole recording, with an emoji.
2. blue callout: the gist in 2–3 sentences, what this was and what came out of it.
3. Only when it helps: a facts card (2–5 fact rows) with the key details at a glance, e.g. who took part, the doctor and the next visit, the course and the lecturer, the price.
4. 2–4 sections, one per main topic: a header with an emoji, then 2–5 bullets (labels when they help).
5. Shape the end for the kind of recording, and include each part only if it exists:
   - Meeting: section "Decisions" (bullets), section "Next steps" (todos with owner and due), section "Open questions" (bullets).
   - Lecture or class: a purple callout with the 1–3 things to remember, especially anything the lecturer stressed or said will be tested.
   - Medical appointment: the treatment and medication as labelled bullets (name: dose, how often, how long), the instructions as numbered steps, a red callout with the warning signs and when to get help if any were mentioned, then todos.
   - Other appointment: the advice, the costs, todos, and an orange callout for deadlines or risks.
   - Sermon or talk: one quote of the key line or verse, and a green callout with how to apply it.
   - Conversation or voice note: plans and ideas as bullets, then todos.
8–25 blocks.`,

  key_points: `Write the KEY POINTS: the few things that matter most, readable in 20 seconds.
1. header: a specific title for the recording, with an emoji.
2. 4–8 bullets, most important first. Every bullet has a label (1–3 words naming the point) and one concrete sentence: outcomes, numbers, decisions, instructions, deadlines, whatever matters most for this kind of recording.
3. Last, one green callout titled with the words for "Bottom line", with the single most important takeaway in one sentence. If there is something urgent or risky the person must not miss, make it orange instead.
Nothing else. 6–10 blocks.`,

  notes: `Write DETAILED NOTES: the complete, well-organised version. Someone who missed the recording should learn everything from them and never need to listen to it.
1. header: a specific title for the recording, with an emoji.
2. blue callout: an overview in 2–3 sentences.
3. A facts card when it helps (participants, course, lecturer, doctor, place, cost, next date).
4. The body, in the order of the recording: a header (with emoji) per topic, subheaders for sub-topics, and under them bullets (labelled with the term, name or figure when that helps), numbered steps for procedures, short paragraphs where reasoning needs prose. Keep every substantive detail: arguments and reasons, examples, definitions, numbers, names, references, stories that make a point, objections and how they were answered.
5. Shape it for the kind of recording:
   - Lecture or class: definitions as bullets labelled with the term, formulas and procedures as numbered steps, a purple callout for anything the lecturer stressed or said will be tested.
   - Meeting: per topic the discussion and the outcome; then sections "Decisions" (bullets), "Next steps" (todos with owner and due) and "Open questions" (bullets).
   - Medical appointment: reason for the visit, symptoms and history discussed, findings or diagnosis, treatment and each medicine as a bullet labelled with its name (dose, how often, how long), instructions as numbered steps, a red callout with warning signs and when to get help, the next appointment as a fact, todos.
   - Other appointment: the situation, the options discussed with their pros and cons, the advice, costs, an orange callout for deadlines, documents needed, next steps as todos.
   - Sermon or talk: the main message, each point with its explanation, references and verses as quotes, the illustrations and stories, and a green callout with the application.
   - Interview: per topic the question and the substance of the answer.
6. At most 3 quotes, where the exact words matter.
The length follows the content: 15–60 blocks. A long recording deserves long notes.`,

  todos: `Write the TO-DO LIST: every action someone has to take after this recording, ready to tick off.
1. header: a title meaning "To-dos", emoji ✅.
2. todo blocks. Include:
   - explicit tasks and commitments ("I'll send you the deck", "can you check the invoice?"), with that person as owner;
   - appointments: everything the patient or client was told to do: take the medicine (name, dose, schedule), book the next visit, bring documents, pay, rest, avoid something;
   - lectures: assignments, readings, deadlines and the exam preparation the lecturer asked for;
   - meetings: follow-ups and what to prepare for next time.
   Each todo starts with a verb and is specific enough to act on without the recording ("Email Ana the Q3 budget sheet", not "Send the file"), with owner and due when known.
3. Most urgent or earliest due first. With 3 or more different owners, group the todos under a subheader per owner (their name) and leave owner out inside the groups.
4. Only if there are dates or deadlines that aren't tasks themselves: a facts card (label = what, text = when). Only if something risky must not be forgotten: an orange callout.
Never turn topics that were only discussed into tasks. If nobody has to do anything: the header, then one blue callout saying in one sentence that no tasks came up.`,

  qa: `Write QUESTIONS & ANSWERS: every real question asked in the recording, with the answer that was given.
1. header: a specific title for the recording, with an emoji.
2. qa blocks in the order they were asked. question: rewritten as a clean question that makes sense on its own. text: the answer as it was given, 1–3 concrete sentences, faithful to what was said. answered: false when it wasn't answered or only partly, and then text says briefly what is still open.
   Skip rhetorical questions, small talk ("how are you?") and repeats. With 6 or more questions on different topics, group them under subheaders named after the topics.
3. Lecture, class, training, sermon or talk: also add a section with a header meaning "Test yourself" (emoji 🧠) and 3–6 qa blocks, the questions a teacher would ask to check understanding of the most important ideas, answered strictly from the recording (answered: true). Add it even when nobody asked questions.
4. Appointments: make sure every question the patient or client asked is there.
If there were no real questions and it isn't a lecture or talk: the header, then one blue callout saying in one sentence that no questions were asked.`,

  follow_up: `Write a FOLLOW-UP MESSAGE that the person who recorded this can send right away by email or chat: in their voice (first person), ready to paste, needing no edits.
Choose who it's for from the kind of recording:
- Meeting or work call: the other participants, a recap.
- Lecture or class: classmates or a study group, what was covered and what's due.
- Medical appointment: a family member or caregiver, how it went, the plan and what's next, in warm, plain words.
- Other appointment or consultation: the advisor or company, confirming what was agreed and the next steps.
- Interview: the interviewee, a thank-you that mentions specifics.
- Conversation or voice note: the other person, recapping the plans.
Structure, as a plain message (no callouts, facts, todos, quotes or qa, and no emoji anywhere):
1. header: the subject line, short and specific, with no emoji field.
2. paragraph: the greeting, with the recipient's name if it's known.
3. paragraph: a 1–2 sentence recap or thank-you.
4. subheader + 2–6 bullets: the main points or what was agreed.
5. subheader + bullets: the next steps with who and when ("Ana: send the contract by Fri 16 Oct"). Leave out if there are none.
6. paragraph: a short, warm closing line (what happens next, or an offer to help).
No signature and no placeholders like [Name]. Natural and human, not corporate. 80–200 words.`,
};

const HEADER_EMOJI = [
  '🚀', '🎯', '📌', '📝', '📚', '📖', '🎓', '🧠', '💡', '🔍', '📊', '📈', '💰', '🧾', '📅', '⏰', '⏳',
  '✅', '❓', '💬', '📣', '👥', '🤝', '💼', '🏢', '🔧', '🧪', '🔬', '🩺', '💊', '🏥', '🦷', '🍎', '🏃',
  '🏠', '🚗', '🌍', '🏦', '📦', '🛒', '🎨', '💻', '📱', '🔒', '🌱', '🔥', '🎉', '💪', '🧩', '🧭', '🔄',
  '🚧', '🙏', '🎤', '🎧', '📞', '📧', '📋', '👶', '🐶', '🎵', '⚽', '🍳', '🧳',
];

const str_ = { type: 'STRING' };
const block = (type: string, props: Record<string, object>, required: string[]) => ({
  type: 'OBJECT',
  properties: { type: { type: 'STRING', enum: [type] }, ...props },
  required: ['type', ...required],
  propertyOrdering: ['type', ...Object.keys(props)],
});

// One shape per block type, so every field lands where it belongs.
export const SCHEMA = {
  type: 'OBJECT',
  properties: {
    blocks: {
      type: 'ARRAY',
      items: {
        anyOf: [
          block('header', { emoji: { type: 'STRING', enum: HEADER_EMOJI }, text: str_ }, ['text']),
          block('subheader', { text: str_ }, ['text']),
          block('paragraph', { text: str_ }, ['text']),
          block('bullet', { label: str_, text: str_ }, ['text']),
          block('numbered', { text: str_ }, ['text']),
          block('todo', { text: str_, owner: str_, due: str_ }, ['text']),
          block('quote', { text: str_, speaker: str_ }, ['text']),
          block('callout', { tone: { type: 'STRING', enum: ['blue', 'green', 'orange', 'red', 'purple'] }, title: str_, text: str_ }, ['tone', 'title', 'text']),
          block('fact', { label: str_, text: str_ }, ['label', 'text']),
          block('qa', { question: str_, text: str_, answered: { type: 'BOOLEAN' } }, ['question', 'text', 'answered']),
          block('insufficient_context', {}, []),
        ],
      },
    },
  },
  required: ['blocks'],
};

export function tooShort(transcript: string): boolean {
  const trimmed = transcript.trim();
  // Chinese, Japanese and Thai don't put spaces between words, so a space
  // split counts a whole meeting as a handful of "words": estimate ~2
  // characters per word for those scripts instead.
  const spaced = trimmed.split(/\s+/).filter(Boolean).length;
  const unspaced = (trimmed.match(/[฀-๿぀-ヿ㐀-鿿]/g)?.length ?? 0) / 2;
  return Math.max(spaced, unspaced) < 25;
}

const TONES: CalloutTone[] = ['blue', 'green', 'orange', 'red', 'purple'];
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

// Only well-formed blocks get saved; numbered steps are renumbered per list.
export function clean(raw: unknown): SummaryBlock[] {
  if (!Array.isArray(raw)) return [];
  const out: SummaryBlock[] = [];
  for (const b of raw as Record<string, unknown>[]) {
    if (!b || typeof b !== 'object') continue;
    const text = str(b.text);
    const opt = (key: string) => (str(b[key]) ? { [key]: str(b[key]) } : {});
    switch (b.type) {
      case 'insufficient_context':
        return [{ type: 'insufficient_context' }];
      case 'header':
        if (text) out.push({ type: 'header', text, ...opt('emoji') });
        break;
      case 'subheader':
      case 'paragraph':
        if (text) out.push({ type: b.type, text });
        break;
      case 'bullet':
        if (text) out.push({ type: 'bullet', text, ...opt('label') });
        break;
      case 'numbered': {
        const prev = out[out.length - 1];
        if (text) out.push({ type: 'numbered', text, n: prev?.type === 'numbered' ? prev.n + 1 : 1 });
        break;
      }
      case 'todo':
        if (text) out.push({ type: 'todo', text, done: false, ...opt('owner'), ...opt('due') });
        break;
      case 'quote':
        if (text) out.push({ type: 'quote', text: text.replace(/^["“”„«»]+|["“”„«»]+$/g, ''), ...opt('speaker') });
        break;
      case 'callout': {
        const tone = TONES.includes(b.tone as CalloutTone) ? (b.tone as CalloutTone) : 'blue';
        if (text) out.push({ type: 'callout', text, tone, ...opt('title') });
        break;
      }
      case 'fact':
        if (text && str(b.label)) out.push({ type: 'fact', label: str(b.label), text });
        break;
      case 'qa':
        if (text && str(b.question)) out.push({ type: 'qa', question: str(b.question), text, answered: b.answered !== false });
        break;
    }
  }
  return out;
}

// Why a result couldn't be made: the code goes to PostHog and decides the
// alert's words; `retry` = one more try could help.
export type ActionErrorCode =
  | "no_key" | "offline" | "timeout" | "rate_limited" | "server" | "request" | "blocked" | "truncated" | "bad_response" | "empty";

export const RETRYABLE: ActionErrorCode[] = ["offline", "timeout", "rate_limited", "server", "truncated", "bad_response", "empty"];

export function actionErrorBody(code: string): string {
  if (code === "offline") return "You're offline. Connect to the internet and try again.";
  if (code === "timeout") return "This is taking longer than it should. Please try again.";
  if (code === "blocked") return "Captio AI can't make this from this recording.";
  return "Something went wrong. Please check your connection and try again.";
}

// The model's prompt for one action: the task, what's known about the
// recording, and the transcript (with who said what, when it knows).
export function buildPrompt(kind: ActionKind, about: { title: string; createdAt: number; durationSeconds: number; speakers: string[] }, transcript: string): string {
  const cut = transcript.length > MAX_TRANSCRIPT_CHARS;
  const recorded = new Date(about.createdAt).toLocaleString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const mm = Math.floor(about.durationSeconds / 60), ss = Math.round(about.durationSeconds % 60);
  const lines = [
    `Title: ${about.title}`,
    `Recorded: ${recorded}`,
    about.durationSeconds > 0 && `Length: ${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`,
    `Speakers: ${about.speakers.length ? about.speakers.join(", ") : "not separated"}`,
  ].filter(Boolean).join("\n");
  return `${TASKS[kind]}

ABOUT THE RECORDING
${lines}

TRANSCRIPT${cut ? " (cut off: only the first part fits)" : ""}
"""
${transcript.slice(0, MAX_TRANSCRIPT_CHARS)}
"""`;
}
