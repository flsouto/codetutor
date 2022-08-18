import {execSync} from 'child_process'
import Audio from './Audio'

export default class Speaker{

    speak(text){
        const tmpf = Audio.tmpf
        const tmpf2 = Audio.tmpf
        execSync(`echo "${text}" | text2wave > ${tmpf} && sox ${tmpf} -c 2 ${tmpf2}`)
        const audio = new Audio(tmpf2).rate(44100)
        return new Spoken(text, audio)
    }

}

export class Spoken{
    constructor(public text, public audio: Audio){}
    addBackground(bkg,rpad=1){
        const remixed = new Audio(bkg)
            .trim(0, this.audio.len + 1)
            .remix(this.audio)
        return new Spoken(
            this.text,
            remixed
        )
    }
}
