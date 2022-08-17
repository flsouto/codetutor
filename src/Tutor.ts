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

    async say(text, code = " "){
        const sect = this.createSection()
        sect.audio = new Speaker().speak(text)
            .addBackground("assets/keyboard-fx.wav",1)
            .save(path.join(sect.dir,'audio.wav'))
        this.writer.setOutputDir(sect.dir)
        sect.imgs = await this.writer.writeLn(code)
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
        vr.render(
            path.join(this.dir, '*.png'),
            path.join(this.dir, 'output.mp4')
        )
    }
}


