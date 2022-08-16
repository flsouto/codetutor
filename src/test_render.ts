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

    let say = "I'm going to start by adding the basic structure of our HTML page. It looks boring at first, but hang in there, as this is going to become more complex in a minute!"
    execSync(`echo "${say}" | text2wave > results/say.wav`)
    const dur = parseFloat(execSync(`soxi -D results/say.wav`)) + 1
    execSync(`sox results/say.wav results/say-fixed.wav rate 44100`)
    execSync(`sox assets/keyboard-fx.wav results/keyboard.wav trim 0 ${dur}`)
    execSync(`sox -M results/keyboard.wav results/say-fixed.wav results/say-with-keyboard.wav remix -m 1,3,2,3`)
    const vr = new VideoRenderer()
    vr.setFrameRate(imgs.length/dur)
    vr.setAudio(`results/say-with-keyboard.wav`)
    vr.render("results/*.png")

}

main()
