import { spawn } from "child_process";
import Logger from "../common/Logger";
import config from "../config";

export default function getFfmpegProcess(options: {
    audioPort: number;
    videoPort: number;
}) {
    const ffmpegProcess = spawn(
        'ffmpeg',
        [
            '-protocol_whitelist pipe,rtp,udp',
            `-i -`,
            "-acodec copy",
            "-vcodec libx264",
            "-hls_time 5",
            "-f hls",
            `/tmp/recordings/recording.m3u8`,
        ].join(" ").split(" ")
    );

    const inputSDP = `c=IN IP4 127.0.0.1
    m=audio ${options.audioPort} RTP ${config.MEDIA_SERVER.AUDIO_PAYLOAD}
    a=rtpmap:${config.MEDIA_SERVER.AUDIO_PAYLOAD} ${config.MEDIA_SERVER.AUDIO_CODEC}/${config.MEDIA_SERVER.AUDIO_CLOCKRATE}/${config.MEDIA_SERVER.AUDIO_CHANNELS}
    m=video ${options.videoPort} RTP ${config.MEDIA_SERVER.VIDEO_PAYLOAD}
    a=rtpmap:${config.MEDIA_SERVER.VIDEO_PAYLOAD} ${config.MEDIA_SERVER.VIDEO_CODEC}/${config.MEDIA_SERVER.VIDEO_CLOCKRATE}`;

    ffmpegProcess.stdin.write(inputSDP);
    ffmpegProcess.stdin.end();

    ffmpegProcess.on('exit', (code, signal) => {
        Logger.debug(`FFMpeg stopped with exit code ${code} (${signal})`);
        Logger.debug('Streamer stopped');
    });

    ffmpegProcess.on('error', (err) => {
        Logger.error(`ffmpeg error`, err)
    });

    process.on("beforeExit", () => {
        ffmpegProcess.kill();
    });

    const logSilly = (arg: any) => Logger.silly(arg);
    ffmpegProcess.stderr.on("data", logSilly)
    ffmpegProcess.stdout.on("data", logSilly);

    return ffmpegProcess;
}