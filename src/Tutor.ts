import VideoRenderer from './VideoRenderer'
import Writer from './Writer'
import Speaker from './Speaker'
import Audio from './Audio'
import {mkdirSync, existsSync} from 'fs'
import path from 'path'
import {execSync} from 'child_process'

export default class Tutor{

    private sections : Section[] = []
    private writer : Writer

    assetsDir = 'assets'

    constructor(private outputDir : string, w : Writer = null){
        if(!existsSync(outputDir)){
            mkdirSync(outputDir)
        }
        this.writer = w || new Writer
    }
    public clear(){
        execSync(`rm ${path.join(this.outputDir,'*')} -Rf`)
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
        sect.imgs = await this.writer.writeBlock(code)
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
            sect.imgs = await this.writer.writeBlock(code)
        } else {
            const frame = path.join(sect.dir, 'output.png')
            await this.writer.img.savePng(frame, 1)
            sect.imgs = [frame]
        }
        return sect
    }

    async play(audioFile : string){
        const audio = new Audio(path.join(this.assetsDir, audioFile))
        return await this.wait(audio.len, audio)
    }

    async wait(time, audio : Audio = null){
        const sect = this.createSection()
        const cursor = this.writer.cloneImg()
        const noncursor = this.writer.cloneImg()
        this.writer.writeString(cursor,"▌",[255,255,255])
        for(let i=0,j=0; i<time;i++,j+=2){
            let imgf = `wait${j}.png`
            await cursor.savePng(path.join(sect.dir, imgf),1)
            sect.imgs.push(imgf)
            imgf = `wait${j+1}.png`
            await noncursor.savePng(path.join(sect.dir,imgf),1)
            sect.imgs.push(imgf)
        }
        sect.audio = audio || Audio.silence(time).save(path.join(sect.dir,'silence.wav'))
        return sect
    }

    render(){
        const videos = []
        this.sections.forEach(s => {
            videos.push(s.render())
        })
        const merged = path.join(this.outputDir, 'final.mp4')
        VideoRenderer.concat(videos, merged)
        return merged
    }
}

export class Section{

    public imgs : string[] = []
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


