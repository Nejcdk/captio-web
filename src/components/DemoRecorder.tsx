'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const IDLE_PHRASES = [
  { lang: 'English',      text: 'Live captions will appear here...' },
  { lang: '中文',          text: '实时字幕将在此处显示...' },
  { lang: 'हिन्दी',       text: 'लाइव कैप्शन यहाँ दिखाई देंगे...' },
  { lang: 'Español',      text: 'Los subtítulos en vivo aparecerán aquí...' },
  { lang: 'العربية',       text: 'ستظهر التعليقات المباشرة هنا...' },
  { lang: 'বাংলা',         text: 'লাইভ ক্যাপশন এখানে দেখা যাবে...' },
  { lang: 'Português',    text: 'As legendas ao vivo aparecerão aqui...' },
  { lang: 'Русский',      text: 'Субтитры в реальном времени появятся здесь...' },
  { lang: 'اردو',          text: 'لائیو کیپشن یہاں ظاہر ہوں گے...' },
  { lang: 'Indonesia',    text: 'Teks langsung akan muncul di sini...' },
  { lang: 'Deutsch',      text: 'Live-Untertitel erscheinen hier...' },
  { lang: '日本語',         text: 'ライブキャプションがここに表示されます...' },
  { lang: 'Kiswahili',    text: 'Manukuu ya moja kwa moja yataonekana hapa...' },
  { lang: 'मराठी',         text: 'लाइव्ह कॅप्शन येथे दिसतील...' },
  { lang: 'తెలుగు',        text: 'లైవ్ క్యాప్షన్లు ఇక్కడ కనిపిస్తాయి...' },
  { lang: 'Türkçe',       text: 'Canlı altyazılar burada görünecek...' },
  { lang: 'Tiếng Việt',   text: 'Phụ đề trực tiếp sẽ xuất hiện ở đây...' },
  { lang: '한국어',         text: '라이브 자막이 여기에 표시됩니다...' },
  { lang: 'Français',     text: 'Les sous-titres en direct apparaîtront ici...' },
  { lang: 'Italiano',     text: 'I sottotitoli in diretta appariranno qui...' },
  { lang: 'தமிழ்',         text: 'நேரலை தலைப்புகள் இங்கு தோன்றும்...' },
  { lang: 'فارسی',         text: 'زیرنویس زنده اینجا ظاهر می‌شود...' },
  { lang: 'ਪੰਜਾਬੀ',       text: 'ਲਾਈਵ ਕੈਪਸ਼ਨ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ...' },
  { lang: 'ગુજરાતી',       text: 'લાઇવ કૅપ્શન અહીં દેખાશે...' },
  { lang: 'ภาษาไทย',      text: 'คำบรรยายสดจะปรากฏที่นี่...' },
  { lang: 'Polski',       text: 'Napisy na żywo pojawią się tutaj...' },
  { lang: 'Українська',   text: "Субтитри в реальному часі з'являться тут..." },
  { lang: 'Melayu',       text: 'Kapsyen langsung akan muncul di sini...' },
  { lang: 'മലയാളം',       text: 'ലൈവ് ക്യാപ്ഷനുകൾ ഇവിടെ ദൃശ്യമാകും...' },
  { lang: 'ಕನ್ನಡ',         text: 'ಲೈವ್ ಕ್ಯಾಪ್ಷನ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ...' },
  { lang: 'Tagalog',      text: 'Ang mga live na caption ay lilitaw dito...' },
  { lang: 'Azərbaycan',   text: 'Canlı başlıqlar burada görünəcək...' },
  { lang: 'Nederlands',   text: 'Live ondertitels verschijnen hier...' },
  { lang: 'Română',       text: 'Subtitrările live vor apărea aici...' },
  { lang: 'Қазақша',      text: 'Тікелей субтитрлер мұнда пайда болады...' },
  { lang: 'Čeština',      text: 'Živé titulky se zobrazí zde...' },
  { lang: 'Magyar',       text: 'Az élő feliratok itt jelennek meg...' },
  { lang: 'Ελληνικά',     text: 'Οι ζωντανοί υπότιτλοι θα εμφανιστούν εδώ...' },
  { lang: 'Svenska',      text: 'Direkttextning visas här...' },
  { lang: 'עברית',         text: 'כתוביות חיות יופיעו כאן...' },
  { lang: 'Български',    text: 'Субтитрите на живо ще се появят тук...' },
  { lang: 'Srpski',       text: 'Директни титлови ће се приказати овде...' },
  { lang: 'Dansk',        text: 'Direkte undertekster vises her...' },
  { lang: 'Shqip',        text: 'Titrat e drejtpërdrejta do të shfaqen këtu...' },
  { lang: 'Afrikaans',    text: 'Regstreekse onderskrifte verskyn hier...' },
  { lang: 'Беларуская',   text: "Субтытры ў рэжыме рэальнага часу з'явяцца тут..." },
  { lang: 'Suomi',        text: 'Suoratekstitys ilmestyy tähän...' },
  { lang: 'Slovenčina',   text: 'Živé titulky sa zobrazia tu...' },
  { lang: 'Hrvatski',     text: 'Prijevodi uživo pojavit će se ovdje...' },
  { lang: 'Norsk',        text: 'Direkteteksting vises her...' },
  { lang: 'Català',       text: 'Els subtítols en directe apareixeran aquí...' },
  { lang: 'Lietuvių',     text: 'Tiesioginiai titrai pasirodys čia...' },
  { lang: 'Bosanski',     text: 'Titlovi uživo će se pojaviti ovdje...' },
  { lang: 'Galego',       text: 'Os subtítulos en directo aparecerán aquí...' },
  { lang: 'Македонски',   text: 'Живите субтитли ќе се појават тука...' },
  { lang: 'Slovenščina',  text: 'Napisi v živo se bodo prikazali tukaj...' },
  { lang: 'Latviešu',     text: 'Tiešraidē teksti parādīsies šeit...' },
  { lang: 'Eesti',        text: 'Reaalajas subtiitrid ilmuvad siia...' },
  { lang: 'Cymraeg',      text: 'Bydd capsiynau byw yn ymddangos yma...' },
  { lang: 'Euskara',      text: 'Zuzeneko azpitituluak hemen agertuko dira...' },
];

const SPEAKER_PALETTE = [
  '#1C49F5',
  '#7C3AED',
  '#059669',
  '#D97706',
  '#DC2626',
  '#0891B2',
  '#BE185D',
];

function speakerColor(speaker: string): string {
  const n = parseInt(speaker, 10);
  const idx = isNaN(n) ? 0 : Math.max(0, n - 1);
  return SPEAKER_PALETTE[idx % SPEAKER_PALETTE.length];
}

interface Token {
  text: string;
  is_final: boolean;
  speaker?: string;
  language?: string;
}

interface TranscribeMessage {
  tokens?: Token[];
  finished?: boolean;
  error_type?: string;
  error_message?: string;
}

interface Segment {
  id: number;
  speaker?: string;
  language?: string;
  text: string;
}

const ERRORS: Record<string, string> = {
  unauthenticated: 'Authentication failed. The demo credentials may have expired.',
  insufficient_credits: 'Demo quota reached. Please try again later.',
  rate_limit_exceeded: 'Too many requests. Please wait a moment and try again.',
};

export default function DemoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [nonFinalText, setNonFinalText] = useState('');
  const [nonFinalSpeaker, setNonFinalSpeaker] = useState<string | undefined>();
  const [nonFinalLanguage, setNonFinalLanguage] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const segIdRef = useRef(0);
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null);
  const abortCtrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isRecording) return;
    const id = setInterval(() => {
      setPhraseIndex(i => (i + 1) % IDLE_PHRASES.length);
    }, 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [segments, nonFinalText]);

  const cleanup = useCallback(() => {
    activeRef.current = false;

    processorRef.current?.disconnect();
    processorRef.current = null;

    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;

    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;

    // Close writer — signals end of audio stream to the server
    writerRef.current?.close().catch(() => {});
    writerRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    cleanup();
    setIsRecording(false);
    setNonFinalText('');
    setNonFinalSpeaker(undefined);
    setNonFinalLanguage(undefined);
  }, [cleanup]);

  useEffect(() => () => {
    cleanup();
    abortCtrlRef.current?.abort();
    abortCtrlRef.current = null;
  }, [cleanup]);

  const startRecording = useCallback(async () => {
    setError(null);
    setSegments([]);
    setNonFinalText('');
    setNonFinalSpeaker(undefined);
    setNonFinalLanguage(undefined);
    segIdRef.current = 0;

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Your browser does not support microphone access. Try Chrome or Safari.');
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (e) {
      if (e instanceof Error) {
        if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
          setError('Microphone access denied. Allow microphone access in your browser settings and try again.');
        } else if (e.name === 'NotFoundError') {
          setError('No microphone found. Connect a microphone and try again.');
        } else {
          setError('Could not access microphone: ' + e.message);
        }
      } else {
        setError('Could not access microphone.');
      }
      return;
    }

    let audioCtx: AudioContext;
    try {
      audioCtx = new AudioContext({ sampleRate: 16000 });
    } catch {
      audioCtx = new AudioContext();
    }
    const sampleRate = audioCtx.sampleRate;

    const source = audioCtx.createMediaStreamSource(stream);
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const processor = audioCtx.createScriptProcessor(2048, 1, 1);
    const silencer = audioCtx.createGain();
    silencer.gain.value = 0;
    processor.connect(silencer);
    silencer.connect(audioCtx.destination);

    streamRef.current = stream;
    audioCtxRef.current = audioCtx;
    processorRef.current = processor;

    // Create a transform stream — audio chunks flow in, get forwarded to the server
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();
    writerRef.current = writer;

    const abortCtrl = new AbortController();
    abortCtrlRef.current = abortCtrl;

    // Connect audio processor to the writer
    source.connect(processor);
    processor.onaudioprocess = (e) => {
      if (!activeRef.current) return;
      const float32 = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(float32.length);
      for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      writer.write(new Uint8Array(int16.buffer)).catch(() => {});
    };

    activeRef.current = true;
    setIsRecording(true);

    // Stream audio to server; receive transcription results as SSE
    let res: Response;
    try {
      res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'x-sample-rate': String(sampleRate),
        },
        body: readable,
        // @ts-expect-error — duplex not yet in TS lib types
        duplex: 'half',
        signal: abortCtrl.signal,
      });
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setError('Connection error. Check your internet connection and try again.');
      }
      cleanup();
      setIsRecording(false);
      return;
    }

    if (!res.ok || !res.body) {
      setError('Demo not available right now. Please try again later.');
      cleanup();
      setIsRecording(false);
      return;
    }

    // Parse the SSE response stream
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    const handleMessage = (msg: TranscribeMessage) => {
      if (msg.error_type) {
        setError(ERRORS[msg.error_type] ?? `Transcription error: ${msg.error_type}`);
        stopRecording();
        return;
      }

      if (msg.finished) {
        stopRecording();
        return;
      }

      if (!msg.tokens?.length) return;

      const finalTokens = msg.tokens.filter(t => t.is_final && t.text !== '<end>');
      const nfTokens = msg.tokens.filter(t => !t.is_final && t.text !== '<end>');

      if (finalTokens.length > 0) {
        setSegments(prev => {
          const next = [...prev];
          for (const token of finalTokens) {
            const last = next[next.length - 1];
            if (last && last.speaker === token.speaker) {
              next[next.length - 1] = { ...last, text: last.text + token.text };
            } else {
              next.push({
                id: segIdRef.current++,
                speaker: token.speaker,
                language: token.language,
                text: token.text,
              });
            }
          }
          return next;
        });
      }

      setNonFinalText(nfTokens.map(t => t.text).join(''));
      setNonFinalSpeaker(nfTokens[0]?.speaker);
      setNonFinalLanguage(nfTokens[0]?.language);
    };

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split('\n\n');
        buf = parts.pop() ?? '';
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data: ')) continue;
          try {
            handleMessage(JSON.parse(line.slice(6)) as TranscribeMessage);
          } catch { /* malformed JSON — skip */ }
        }
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setError('Connection closed unexpectedly. Please try again.');
      }
    } finally {
      stopRecording();
    }
  }, [cleanup, stopRecording]);

  const handleToggle = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const hasContent = segments.length > 0 || nonFinalText.length > 0;
  const phrase = IDLE_PHRASES[phraseIndex];

  return (
    <div className="bg-white border-2 border-gray-300 rounded-3xl min-h-[480px] sm:min-h-[380px] flex flex-col">
      <div
        ref={transcriptRef}
        className="flex-1 min-h-0 overflow-y-auto px-6 pt-6 pb-3"
      >
        {!hasContent ? (
          <div className="h-full min-h-[180px] flex items-center justify-center">
            <p key={phraseIndex} className="text-gray-300 text-[17px] font-medium text-center leading-relaxed">
              {phrase.text}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-2">
            {segments.map(seg => (
              <div key={seg.id}>
                {(seg.speaker || seg.language) && (
                  <div className="flex items-center gap-2 mb-1">
                    {seg.speaker && (
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: speakerColor(seg.speaker) + '18',
                          color: speakerColor(seg.speaker),
                        }}
                      >
                        Speaker {seg.speaker}
                      </span>
                    )}
                    {seg.language && (
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        {seg.language}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-gray-900 text-base leading-relaxed">{seg.text}</p>
              </div>
            ))}

            {nonFinalText && (
              <div>
                {(nonFinalSpeaker || nonFinalLanguage) && (
                  <div className="flex items-center gap-2 mb-1">
                    {nonFinalSpeaker && (
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: speakerColor(nonFinalSpeaker) + '18',
                          color: speakerColor(nonFinalSpeaker),
                        }}
                      >
                        Speaker {nonFinalSpeaker}
                      </span>
                    )}
                    {nonFinalLanguage && (
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        {nonFinalLanguage}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-gray-300 text-base leading-relaxed">{nonFinalText}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mx-5 mb-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}

      <div className="shrink-0 pb-6 pt-2 flex flex-col items-center gap-2">
        <p className="text-[12px] text-gray-400 font-medium h-4">
          {isRecording ? 'Tap to stop' : ''}
        </p>
        <button
          onClick={handleToggle}
          className="w-[106px] h-[106px] rounded-[24px] border-2 border-gray-200 bg-white flex items-center justify-center"
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          <div
            className={`w-[84px] h-[84px] rounded-[12px] flex items-center justify-center transition-colors duration-200 ${
              isRecording ? 'bg-red-500' : 'bg-brand'
            }`}
          >
            {isRecording ? (
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
                <path d="M8 5v14" stroke="white" strokeWidth={4} />
                <path d="M16 5v14" stroke="white" strokeWidth={4} />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[34px] h-[34px]">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <path d="M12 19v4" />
                <path d="M8 23h8" />
              </svg>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
