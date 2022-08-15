import * as gd from 'node-gd'

export default class Writer{

    public img: gd.Image
    public fontPath = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    public fontHeight = 25
    public fontSize = 18
    public lineNumber = 1

    static imgCounter = 0

    constructor(public width=1200, public height=800, public bkg=[0,0,0]){
        this.img = gd.createSync(width, height)
        this.img.colorAllocate(bkg[0],bkg[1],bkg[2]);
    }

    public getHeightOffset(){
        return this.fontHeight * this.lineNumber
    }

    public cloneImg(){
        const clone = gd.createSync(this.width, this.height)
        this.img.copy(clone, 0,0,0,0, this.width, this.height)
        return clone
    }

    async writeLn(line: string) : string[]{

        const imgs = []

        let tmpLine = ""
        let tmpImg = null

        for(const c of line.split('')){

            if(tmpImg){
                tmpImg.destroy()
            }

            tmpLine += c

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
            const num = String(Writer.imgCounter).padStart(3,'0')
            const saveAs = `results/output${num}.png`

            await tmpImg.savePng(saveAs, 1);

            imgs.push(saveAs)

        }

        if(tmpImg){
            this.img.destroy()
            this.img = tmpImg
        }

        this.lineNumber++

        return imgs

    }

}
