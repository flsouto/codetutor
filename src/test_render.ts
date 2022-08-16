import VideoRenderer from './VideoRenderer'
import Writer from './Writer'
import Speaker from './Speaker'
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

    const spoken = new Speaker()
        .speak("I'm going to start by adding the basic structure of our HTML page. This is very exciting!")
        .addBackground("assets/keyboard-fx.wav")

    const vr = new VideoRenderer()
    vr.setFrameRate(imgs.length/spoken.duration)
    vr.setAudio(spoken.file)
    vr.render("results/*.png")

}

main()
