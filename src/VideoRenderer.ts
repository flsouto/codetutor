import {exec} from 'child_process'

export default class VideoRenderer{

    public framerate = 30

    render(glob: string, save_as : string = 'results/output.mp4'){
        const cmd = `ffmpeg -framerate ${this.framerate} -pattern_type glob -i '${glob}' -c:v libx264 -pix_fmt yuv420p ${save_as}`
        console.log("running cmd: ", cmd)
        exec(cmd)
    }
}
