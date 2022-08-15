import VideoRenderer from './VideoRenderer'
import Writer from './Writer'
import {execSync} from 'child_process'

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

    let say = "this is the basic structure of an HTML page"
    execSync(`echo "${say}" | text2wave > results/say.wav`)

    const vr = new VideoRenderer()
    vr.setFrameRate(10)
    vr.setAudio(`results/say.wav`)
    vr.render("results/*.png")

}

main()
