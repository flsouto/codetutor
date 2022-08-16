import {execSync} from 'child_process'

export default class VideoRenderer{

    private frameRate = 30
    private audio

    setAudio(audio:string|Spoken){
        this.audio = audio instanceof Spoken ? audio.file : audio
        return this
    }

    setFrameRate(rate:number){
        this.frameRate = rate
        return this
    }

    render(glob: string, save_as : string = 'results/output.mp4'){
        let cmd = [
            `rm ${save_as} 2>/dev/null;`,
            "ffmpeg",
            "-framerate",
            this.frameRate,
            `-pattern_type glob -i '${glob}'`,
            (this.audio && `-i ${this.audio}`),
            "-c:v libx264",
            "-pix_fmt yuv420p",
            save_as
        ].join(" ")

        console.log("running cmd: ", cmd)
        execSync(cmd)
    }
}
