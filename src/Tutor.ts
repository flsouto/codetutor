import VideoRenderer from './VideoRenderer'
import Writer from './Writer'
import Speaker from './Speaker'
import Audio from './Audio'
import {mkdirSync, existsSync} from 'fs'
import path from 'path'

export default class Tutor{

    private sections : Section[] = []
    private writer : Writer

    constructor(private outputDir : string){
        if(!existsSync(outputDir)){
            mkdirSync(outputDir)
        }
        this.writer = new Writer
    }

    public createSection(){
        const dir = path.join(this.outputDir, `section${this.sections.length}`)
        if(!existsSync(dir)){
            mkdirSync(dir)
        }
        const section = new Section(dir)
        this.sections.push(section)
        return section
    }

    async write(code, speed=.1){
        const sect = this.createSection()
        this.writer.setOutputDir(sect.dir)
        sect.imgs = await this.writer.writeLn(code)
        const len = sect.imgs.length * speed
        sect.audio = new Audio("assets/keyboard-fx.wav").trim(0, len)
        sect.audio.save(path.join(sect.dir, "audio.wav"))
        return sect
    }

    async say(text, code = null){
        const sect = this.createSection()
        let spk = new Speaker().speak(text)
        if(code){
            spk = spk.addBackground("assets/keyboard-fx.wav",1)
        }
        sect.audio = spk.audio.save(path.join(sect.dir,'audio.wav'))
        this.writer.setOutputDir(sect.dir)
        if(code){
            sect.imgs = await this.writer.writeLn(code)
        } else {
            const frame = path.join(sect.dir, 'output.png')
            await this.writer.img.savePng(frame, 1)
            sect.imgs = [frame]
        }
        return sect
    }

    render(){
        this.sections.forEach(s => s.render())
        // todo merge using ffmpeg
    }
}

export class Section{

    public imgs : string[]
    public audio : Audio

    constructor(public dir : string){
    }

    render(){
        const vr = new VideoRenderer()
        vr.setFrameRate(this.imgs.length/this.audio.len)
        vr.setAudio(this.audio)
        const videof = path.join(this.dir, 'video.mp4')
        vr.render(
            path.join(this.dir, '*.png'),
            videof
        )
        return videof
    }
}


