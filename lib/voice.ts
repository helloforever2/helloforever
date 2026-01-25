import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Default voice settings for natural conversation
const defaultVoiceSettings = {
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0.5,
  useSpeakerBoost: true,
};

/**
 * Generate speech audio from text using ElevenLabs
 * @param text - The text to convert to speech
 * @param voiceId - The ElevenLabs voice ID (user's cloned voice or default)
 * @returns Audio buffer as base64 string
 */
export async function generateSpeech(
  text: string,
  voiceId?: string
): Promise<string> {
  // Use Rachel voice as default (warm, conversational female voice)
  // Can be changed to user's cloned voice if available
  const selectedVoiceId = voiceId || "21m00Tcm4TlvDq8ikWAM";

  try {
    const audioStream = await elevenlabs.textToSpeech.convert(selectedVoiceId, {
      text,
      modelId: "eleven_multilingual_v2",
      voiceSettings: defaultVoiceSettings,
    });

    // Convert ReadableStream to buffer
    const reader = audioStream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    // Combine chunks into a single buffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const audioBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      audioBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    // Return as base64 for easy transmission
    return Buffer.from(audioBuffer).toString("base64");
  } catch (error) {
    console.error("ElevenLabs speech generation error:", error);
    throw new Error("Failed to generate speech");
  }
}

/**
 * Clone a voice from audio samples
 * @param name - Name for the cloned voice
 * @param description - Description of the voice
 * @param audioFiles - Array of audio file buffers (at least 1 minute of clear speech recommended)
 * @returns The created voice ID
 */
export async function cloneVoice(
  name: string,
  description: string,
  audioFiles: { buffer: Buffer; filename: string }[]
): Promise<string> {
  try {
    // Convert buffers to Blobs for the API
    const files = audioFiles.map(({ buffer }) => {
      // Convert Buffer to Blob for ElevenLabs API
      const uint8Array = new Uint8Array(buffer);
      return new Blob([uint8Array], { type: "audio/mpeg" });
    });

    // Use Instant Voice Cloning (IVC) to create the voice
    const voice = await elevenlabs.voices.ivc.create({
      name,
      description,
      files,
    });

    return voice.voiceId;
  } catch (error) {
    console.error("ElevenLabs voice cloning error:", error);
    throw new Error("Failed to clone voice");
  }
}

/**
 * Delete a cloned voice
 * @param voiceId - The voice ID to delete
 */
export async function deleteVoice(voiceId: string): Promise<void> {
  try {
    await elevenlabs.voices.delete(voiceId);
  } catch (error) {
    console.error("ElevenLabs voice deletion error:", error);
    throw new Error("Failed to delete voice");
  }
}

/**
 * Get voice information
 * @param voiceId - The voice ID to get info for
 */
export async function getVoiceInfo(voiceId: string) {
  try {
    const response = await elevenlabs.voices.get(voiceId);
    return response;
  } catch (error) {
    console.error("ElevenLabs get voice error:", error);
    throw new Error("Failed to get voice info");
  }
}

/**
 * List available voices (includes default and cloned voices)
 */
export async function listVoices() {
  try {
    const response = await elevenlabs.voices.getAll();
    return response.voices;
  } catch (error) {
    console.error("ElevenLabs list voices error:", error);
    throw new Error("Failed to list voices");
  }
}

// Pre-selected default voices for different personas
export const defaultVoices = {
  warmMale: "pNInz6obpgDQGcFmaJgB", // Adam - warm male
  warmFemale: "21m00Tcm4TlvDq8ikWAM", // Rachel - warm female
  elderlyMale: "VR6AewLTigWG4xSOukaG", // Arnold - elderly male
  elderlyFemale: "ThT5KcBeYPX3keUQqHPh", // Dorothy - elderly female
  youngMale: "TxGEqnHWrfWFTfGW9XjX", // Josh - young male
  youngFemale: "EXAVITQu4vr4xnSDxMaL", // Bella - young female
};

/**
 * Select best default voice based on relationship and context
 */
export function selectDefaultVoice(relationship: string): string {
  const lowerRelationship = relationship.toLowerCase();

  // Attempt to guess gender from common relationship terms
  const maleRelationships = ["father", "dad", "grandfather", "grandpa", "husband", "brother", "son", "uncle"];
  const femaleRelationships = ["mother", "mom", "grandmother", "grandma", "wife", "sister", "daughter", "aunt"];
  const elderlyRelationships = ["grandfather", "grandpa", "grandmother", "grandma"];

  const isMale = maleRelationships.some(r => lowerRelationship.includes(r));
  const isFemale = femaleRelationships.some(r => lowerRelationship.includes(r));
  const isElderly = elderlyRelationships.some(r => lowerRelationship.includes(r));

  if (isElderly && isMale) return defaultVoices.elderlyMale;
  if (isElderly && isFemale) return defaultVoices.elderlyFemale;
  if (isMale) return defaultVoices.warmMale;
  if (isFemale) return defaultVoices.warmFemale;

  // Default to warm female voice
  return defaultVoices.warmFemale;
}
