import { SoundData } from "../assets";
import burpSoundSrc from "../kassets/burp.mp3";

export type AudioCtx = ReturnType<typeof initAudio>;

export function createEmptyAudioBuffer(ctx: AudioContext) {
    return ctx.createBuffer(1, 1, 44100);
}

export function toArrayBuffer(
    buffer: ArrayBuffer | SharedArrayBuffer,
): ArrayBuffer {
    if (buffer instanceof ArrayBuffer) {
        return buffer;
    }

    // create array buffer from shared array buffer
    const arrayBuffer = new ArrayBuffer(buffer.byteLength);
    new Uint8Array(arrayBuffer).set(new Uint8Array(buffer));

    return arrayBuffer;
}

export const initAudio = () => {
    const audio = (() => {
        const ctx = new (
            window.AudioContext || (window as any).webkitAudioContext
        )() as AudioContext;

        const masterNode = ctx.createGain();
        masterNode.connect(ctx.destination);

        // by default browsers can only load audio async, we don't deal with that and just start with an empty audio buffer
        const burpSnd = new SoundData(createEmptyAudioBuffer(ctx));

        const audioData = toArrayBuffer(burpSoundSrc.buffer.slice(0));

        // load that burp sound
        ctx.decodeAudioData(audioData).then((buf) => {
            burpSnd.buf = buf;
        }).catch((err) => {
            console.error("Failed to load burp: ", err);
        });

        return {
            ctx,
            masterNode,
            burpSnd,
        };
    })();

    return audio;
};
