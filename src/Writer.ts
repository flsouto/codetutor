import * as gd from 'node-gd'

export default class Writer{

    public img: gd.Image
    public fontPath = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    public fontHeight = 36
    public fontSize = 28
    public lineNumber = 1
    public outputDir = 'results'

    static imgCounter = 0

    constructor(public width=720, public height=1280, public bkg=[10,20,30]){
        this.img = gd.createSync(width, height)
        this.img.colorAllocate(bkg[0],bkg[1],bkg[2]);
    }

    public setOutputDir(dir){
        this.outputDir = dir
    }

    public getHeightOffset(){
        return this.fontHeight * this.lineNumber
    }

    public cloneImg(){
        const clone = gd.createSync(this.width, this.height)
        this.img.copy(clone, 0,0,0,0, this.width, this.height)
        return clone
    }

    async writeBlock(block : string){
        let imgs = []
        for(const line of block.split("\n")){
            imgs = imgs.concat(await this.writeLn(line))
        }
        return imgs
    }

    async writeLn(line: string) : Promise<string[]>{

        const imgs = []

        let tmpLine = ""
        let tmpImg = null

        const write = async (s:string) => {

            if(tmpImg){
                tmpImg.destroy()
            }

            tmpImg = this.cloneImg()

            const color = tmpImg.colorAllocate(0, 255, 0);

            tmpImg.stringFT(
                color,
                this.fontPath,
                this.fontSize,
                0,
                0,
                this.getHeightOffset(),
                tmpLine
            )

            Writer.imgCounter++
            const num = String(Writer.imgCounter).padStart(4,'0')
            const saveAs = `${this.outputDir}/output${num}.png`
            await tmpImg.savePng(saveAs, 1);

            imgs.push(saveAs)

        }

        const chars = line.split('')

        while(chars.length > 0 && chars[0] === ' '){
            tmpLine += ' '
            chars.shift()
        }

        for(const c of chars){
            tmpLine += c
            await write(tmpLine)
        }

        if(tmpImg){
            this.img.destroy()
            this.img = tmpImg
        }

        this.lineNumber++

        return imgs

    }

}
