import {execSync} from 'child_process'
import {existsSync} from 'fs'

export default class Audio{
    file : string
    constructor(audio : string|Audio){
        this.file = audio instanceof Audio ? audio.file : audio
        if(!existsSync(this.file)){
            throw new Error(`file not found: ${this.file}`)
        }
    }

    static get tmpf(){
        const id = Date.now() + (Math.random() * 1000)
        return `/tmp/${id}.wav`
    }

    add(audio:string|Audio){
        const newf = Audio.tmpf
        execSync(`sox ${this} ${audio} ${newf}`)
        return new Audio(newf)
    }

    private _len
    get len(){
        if(!this._len){
            const cmd = `soxi -D ${this.file}`
            this._len = parseFloat(execSync(cmd).toString())
        }
        return this._len
    }

    mod(fx){
        const newf = Audio.tmpf
        execSync(`sox ${this} ${newf} ${fx}`)
        return new Audio(newf)
    }

    trim(start, end){
        return this.mod(`trim ${start} ${end}`)
    }

    rate(value:number){
        return this.mod(`rate ${value}`)
    }

    remix(audio:string|Audio){
        const tmpf = Audio.tmpf
        const tmpf2 = Audio.tmpf
        execSync(`sox -M ${audio} ${this.file} ${tmpf} remix -m 1,3,2,3`)
        execSync(`sox ${tmpf} -c 2 ${tmpf2}`)
        return new Audio(tmpf2)
    }

    save(file:string){
        execSync(`cp ${this.file} ${file}`)
        this.file = file
        return this
    }

    toString(){
        return this.file
    }
}

