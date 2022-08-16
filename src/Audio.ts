import {execSync} from 'child_process'
import {existsSync} from 'fs'

export default class Audio{

    constructor(public file : string){
        if(!existsSync(file)){
            throw new Error(`file not found: ${file}`)
        }
    }

    static get tmpf(){
        const id = Date.now() + (Math.random() * 1000)
        return `/tmp/${id}.wav`
    }

    add(audio:Audio){
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

    save(file:string){
        execSync(`mv ${this.file} ${file}`)
        this.file = file
    }

    toString(){
        return this.file
    }
}

