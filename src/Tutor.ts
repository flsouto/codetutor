import VideoRenderer from './VideoRenderer'
import Writer from './Writer'
import Speaker from './Speaker'

export default class Tutor{

    private sections : Section[]
    private writer : Writer

    constructor(private outputDir : string){
        this.writer = new Writer
    }

    private createSection(){
        const dir = `${this.outputDir}/section${this.sections.length}`
        const section = new Section(dir)
        this.sections.push(section)
        return section
    }

    async write(code, speed=.1){
        const sect = this.createSection()
        this.writer.setOutputDir(s.dir)
        sect.imgs = await this.writer.writeLn(code)
        const len = sect.imgs.length * speed
        sect.audio = new Audio("assets/keywboard-fx.wav").trim(0, len)
        return sect
    }

    say(text, code = " "){
        const sect = this.createSection()
        sect.audio = new Speaker().speak(text)
            .addBackground("assets/keyboard-fx.wav",1)
        this.writer.setOutputDir(sect.dir)
        sect.imgs = await this.writer.writeLn(code)
        return sect
    }

    render(){
        this.sections.forEach(s => s.render())
        // todo merge using ffmpeg
    }
}

class Section{

    public imgs : string[]
    public audio : Audio

    constructor(public dir : string){
    }

    render(){
        const vr = new VideoRenderer()
        vr.setFrameRate(this.imgs.length/this.audio.len)
        vr.setAudio(this.audio)
        const dir = this.dir + '/'
        vr.render(`${dir}*.png`)
    }
}


