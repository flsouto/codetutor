import * as gd from 'node-gd'

export default class Writer{

    public fontPath = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    public fontHeight = 25
    public fontSize = 18
    public lineNumber = 1

    constructor(public img : gd.Image){}

    public getHeightOffset(){
        return this.fontHeight * this.lineNumber
    }

    async writeLn(lineString: string){

        const color = this.img.colorAllocate(0, 255, 0);
        const imgs = []

        this.img.stringFT(
            color,
            this.fontPath,
            this.fontSize,
            0,
            0,
            this.getHeightOffset(),
            lineString
        )

        Writer.imgCounter++

        const f = `results/output${Writer.imgCounter}.png`

        await this.img.savePng(f, 1);

        imgs.push(f)

        this.lineNumber++

        return imgs

    }

    static async create(){
        const img = await gd.create(1200, 800)
        img.colorAllocate(0, 0, 0);
        return new Writer(img)
    }

    static imgCounter = 0

}
