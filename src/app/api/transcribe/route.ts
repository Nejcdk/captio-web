import { NextRequest } from 'next/server';
import WebSocket from 'ws';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.SONIOX_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Demo not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sampleRate = parseInt(req.headers.get('x-sample-rate') ?? '16000', 10);

  const ws = new WebSocket('wss://stt-rt.soniox.com/transcribe-websocket');

  try {
    await new Promise<void>((resolve, reject) => {
      ws.once('open', resolve);
      ws.once('error', reject);
      setTimeout(() => reject(new Error('timeout')), 10000);
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  ws.send(JSON.stringify({
    api_key: apiKey,
    model: 'stt-rt-v4',
    audio_format: 'pcm_s16le',
    sample_rate: sampleRate,
    num_channels: 1,
    enable_speaker_diarization: true,
    enable_language_identification: true,
    enable_endpoint_detection: true,
    max_endpoint_delay_ms: 1500,
  }));

  const encoder = new TextEncoder();

  const responseStream = new ReadableStream({
    start(controller) {
      ws.on('message', (data) => {
        try {
          controller.enqueue(encoder.encode(`data: ${data.toString()}\n\n`));
        } catch { /* stream already closed */ }
      });

      ws.on('close', () => {
        try { controller.close(); } catch { /* ignore */ }
      });

      ws.on('error', () => {
        try { controller.close(); } catch { /* ignore */ }
      });

      // Read audio chunks from request body and forward to upstream WebSocket
      const reader = req.body!.getReader();
      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              if (ws.readyState === WebSocket.OPEN) ws.send(Buffer.alloc(0));
              break;
            }
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(Buffer.from(value));
            }
          }
        } catch {
          ws.close();
        }
      })();
    },
  });

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
