import VideoRenderer from './VideoRenderer'
import Writer from './Writer'

async function main(){

    let str: String = `<html>
            <head>
                    {head}
            </head>
            <body>
                    {body}
            </body>
    </html>
    `
    const w = new Writer()
    const imgs = []
    for(const line of str.split("\n")){
        const result = await w.writeLn(line)
        imgs.push(...result)
    }

    const vr = new VideoRenderer()
    vr.framerate = 10
    vr.render("results/*.png")

}

main()
