import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
    }

    const voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!voiceId || !apiKey) {
      return NextResponse.json({ error: 'ElevenLabs credentials missing' }, { status: 500 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ElevenLabs Error Data:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate speech', details: errorData }, 
        { status: response.status }
      );
    }

    // Retornamos el audio como array buffer
    const arrayBuffer = await response.arrayBuffer();
    
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });

  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
