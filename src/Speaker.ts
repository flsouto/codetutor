import {execSync} from 'child_process'

export default class Speaker{

    speak(text){
        execSync(`echo "${text}" | text2wave > results/say.wav`)
        const dur = parseFloat(execSync(`soxi -D results/say.wav`).toString())
        execSync(`sox results/say.wav results/say-fixed.wav rate 44100`)
        return new Spoken(text, 'results/say-fixed.wav', dur)
    }

}

export class Spoken{
    constructor(public text, public file, public duration){}
    addBackground(bkg,rpad=1){
        const dur = this.duration + rpad
        execSync(`sox ${bkg} results/bkg.wav trim 0 ${dur}`)
        execSync(`sox -M results/bkg.wav ${this.file} results/say-with-bkg.wav remix -m 1,3,2,3`)
        return new Spoken(this.text, 'results/say-with-bkg.wav', dur)
    }
}
