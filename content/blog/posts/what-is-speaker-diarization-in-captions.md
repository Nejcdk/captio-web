---
title: "What is speaker identification in captions, and how accurate is it?"
description: "Speaker diarization splits captions by voice. In hard recordings it still misses overlapping speech: the overlapped-speech error was 10.76% in one test."
category: explainers
published: 2026-10-27
updated: 2026-10-27
author: nate
tags: [speaker diarization, speaker identification captions, speaker labels, who is speaking captions, diarization accuracy]
answer: "Speaker identification in captions has two parts. Speaker diarization works out who spoke when and labels each voice, such as Speaker 1. Recognizing a known voice shows a name. Accuracy depends on the setting: in a 2026 vendor test on DIHARD III, the best system's error ranged from 4.2% on audiobooks to 54.4% in restaurants [5]. Overlapping speech is a main source of errors [2]."
keyFacts:
  - value: "10.76%"
    label: "overlapped-speech error in the DIHARD II development set, a hard diarization test"
    source: 2
  - value: "54.4%"
    label: "diarization error rate in restaurant recordings for the best system in a 2026 pyannoteAI test on DIHARD III"
    source: 5
  - value: "speaker #1"
    label: "the label captioning standards use for a speaker whose name is not yet known"
    source: 1
faqs:
  - q: "What is the difference between speaker diarization and speaker recognition?"
    a: "Speaker diarization separates a recording into turns and labels each voice, for example Speaker 1 and Speaker 2, without knowing who they are. Recognizing a known voice compares a voice with one you saved, so the caption can show a name. In Captio AI on iPhone, saved voices give names; other voices stay Speaker N."
  - q: "Why do speaker labels go wrong when people talk over each other in a meeting?"
    a: "Overlapping speech is a main source of diarization errors. A system can detect only one of two people talking at once, which the pyannoteAI benchmark counts as a missed detection [3]. In a team meeting, the interrupting person's words may be attributed to the wrong speaker or missed."
  - q: "Are speaker labels reliable at a restaurant or family dinner?"
    a: "Less than in a quiet one-to-one chat. In one DIHARD II team's report, overlapped-speech error was 10.76% overall and much higher in meeting, restaurant and web video recordings [2]. A 2026 vendor test found a DER of 54.4% for restaurant recordings, the highest of the types it listed [5]. At a dinner table, treat labels as a guide and check the words."
  - q: "What do captioning standards say about naming speakers in a doctor's appointment video?"
    a: "The Captioning Key says to identify a speaker with the same information a hearing viewer has, and gives (speaker #1) as an example for an unnamed speaker [1]. A doctor's appointment is one place this applies, when the clinician's name has not been said aloud."
  - q: "Can I fix a wrong speaker name in a lecture or meeting recording?"
    a: "In Captio AI on iPhone you can tap a speaker's tag in a saved recording and say who it is, and the names also show in exports and AI actions. Captio AI Plus allows more saved people than the free plan, which covers your own voice plus one other person."
  - q: "Does Captio AI recognize voices in every language?"
    a: "Captio AI captions 60 languages. How well saved voices match in each language is not documented, so test it with the people you talk to. Each speaker tag also shows the flag of the language being spoken, on iPhone since version 1.1.3."
sources:
  - title: "Captioning Key: Speaker Identification"
    publisher: "Described and Captioned Media Program (DCMP)"
    url: "https://dcmp.org/learn/603"
    year: 2026
  - title: "DIHARD II is Still Hard: Experimental Results and Discussions from the DKU-LENOVO Team"
    publisher: "arXiv (Lin et al.)"
    url: "https://arxiv.org/abs/2002.12761"
    year: 2020
  - title: "Speaker diarization benchmark"
    publisher: "pyannoteAI"
    url: "https://www.pyannote.ai/benchmark"
    year: 2026
  - title: "USTC-NELSLIP System Description for DIHARD-III Challenge"
    publisher: "arXiv"
    url: "https://arxiv.org/abs/2103.10661"
    year: 2021
  - title: "Streaming diarization benchmark"
    publisher: "pyannoteAI"
    url: "https://www.pyannote.ai/blog/streaming-diarization-benchmark"
    year: 2026
  - title: "The Third DIHARD Diarization Challenge"
    publisher: "arXiv (Ryant et al.)"
    url: "https://arxiv.org/abs/2012.01477"
    year: 2021
---
Speaker identification in captions means the text tells you who said what. It comes in two levels. The first, speaker diarization, only tells voices apart: "Speaker 1" says this, "Speaker 2" says that. The second, recognizing a known voice, puts a name on the voice. Both are less reliable when people talk at the same time.

## What is speaker diarization?

Speaker diarization is the step that splits a recording into turns and groups the turns by voice. It does not know who anyone is, so the labels are generic. Captioning standards expect this: the Captioning Key says to identify a speaker with the same information a hearing viewer has, and gives "(speaker #1)" as a correct label for an unnamed speaker [1].

For a deaf or hard of hearing person at a [group dinner](/use-cases/group-settings) or in a [meeting](/use-cases/meetings), the label does real work. Without it, a stream of words has no owner, and you cannot tell whether the question was aimed at you.

## How is the accuracy of speaker identification measured?

Diarization is scored with the diarization error rate (DER). The pyannoteAI benchmark defines it as the aggregate duration of all three error types divided by the total duration of speech in the recording [3]. The three errors are:

| Error | What it means | Source |
|---|---|---|
| Speaker confusion | A speech turn is given to the wrong speaker, or two speakers are merged or one is split in two | [3] |
| Missed detection | A turn, or part of it, is missed, including when only one of two overlapping speakers is detected | [3] |
| False alarm | The system finds a speech turn where there is none | [3] |

A lower DER is better. The number says nothing about names: it measures whether the voices were separated correctly, not whether a person was recognized.

## Why is overlapping speech the hard part?

Overlapping speech is hard because the system has to place two voices in the same moment, and it often detects only one. In the DIHARD II challenge, a research test built from difficult recordings, one team's system report gave an overall overlapped error of 10.76% in the development set, and "in specific domains such as meeting, restaurant and webvideo, the error is much higher" [2]. The same team's overlap detection recovered less than a tenth of the overlapped speech and cut the DER by only 0.38% to 0.69% [2].

One more team, working on the telephone-conversation part of the DIHARD III data, where each call has 2 speakers, found that missed speech was the largest part of its first system's 16.22% DER, and that this suggested a traditional method could not handle overlapped speech well. Adding speech separation steps brought its DER down to 8.31% [4]. That is a large gain on one test, but overlap remains a known weak point.

In pyannoteAI's own benchmark data, overlap speech makes up 9.3% of its 259 recordings [3]; that figure describes that set, not speech in general.

## How accurate is speaker diarization today?

Accuracy depends heavily on the setting. In October 2026, pyannoteAI, a speaker diarization vendor, published a test of streaming diarization on DIHARD III, a research set of 11 types of recording. Its own system scored a DER of 19.8% across all languages, ahead of three other commercial systems tested, at 31.3% to 39.2% [5]. The vendor ran the test itself, so read it as one company's measurement, not an independent ranking. These are figures for streaming systems from pyannoteAI and other vendors, not for Captio AI. The results by recording type show the spread:

| Recording type (DIHARD III) | DER of the best-scoring system | Source |
|---|---|---|
| Audiobooks | 4.2% | [5] |
| Conversational telephone speech | 10.3% | [5] |
| Clinical | 19.8% | [5] |
| Meeting | 44.6% | [5] |
| Web video | 44.9% | [5] |
| Restaurant | 54.4% | [5] |

For a deaf or hard of hearing reader, the pattern is the point. DIHARD's clinical interviews, which are not the same as a real [doctor's appointment](/use-cases/doctor-appointments), scored 19.8%. Meetings and restaurants, the settings of a [team meeting](/use-cases/meetings) and a [dinner out](/use-cases/restaurants), scored 44.6% and 54.4%. Even the best system in the test had a DER above 50% for restaurants. The challenge organisers say web video "remains far from solved" [6].

## How does recognizing a known voice differ?

Recognizing a known voice gives the caption a name instead of a number. The app needs a sample of the person talking, compares each new turn with it, and uses the saved name when the voice matches.

Captio AI, a live captioning app for deaf and hard of hearing people, does this on iPhone since version 1.1.3 with its Recognize voices feature. You save a voice by recording about 20 seconds of the person talking, or by choosing a file, and captions then show their name instead of "Speaker 2", live and in saved recordings. Voices are made and kept on the phone, and the feature works with Separate Speakers turned on. The free plan recognizes your own voice plus one other person, and Captio AI Plus allows more.

If a voice is not saved, it stays "Speaker N". The app can also ask who an unknown speaker is, and every answer improves recognition. In a saved recording of a [doctor's appointment](/use-cases/doctor-appointments) or a [lecture](/use-cases/lectures), you tap a speaker's tag and say who it is. For more on how apps compare here, see [how to see who is talking in live captions](/blog/how-to-see-who-is-talking-in-live-captions).

## Which situations should you trust speaker labels in?

The figures above suggest speaker labels are more reliable for an interview than in meetings and restaurants, though a real appointment may differ. Be careful wherever voices overlap, as in a [group setting](/use-cases/group-settings) at a dinner or a [meeting](/use-cases/meetings).

| Situation | What to expect from labels |
|---|---|
| Doctor's appointment | No figure for appointments; clinical interviews scored a DER of 19.8% in one 2026 test [5] |
| Team meeting | DER 44.6% in the same test [5]; interruptions create overlap, a main error source [2] |
| Restaurant | DER 54.4% in the same test [5]; overlapped error is much higher than average in restaurant recordings [2] |

In every case the words matter more than the label. If a label looks wrong, read the sentence for who it makes sense for, and correct the name afterward if the app lets you.

## Where can you learn more?

The Captioning Key from the Described and Captioned Media Program sets out how speakers should be identified in captions [1]. For the research side, the DIHARD challenge papers (individual teams' system reports, not the organisers' overview) show where diarization stands and where it still fails [2][4].
