import VideoRenderer from './VideoRenderer'
import Writer from './Writer'
import Speaker from './Speaker'
import {execSync} from 'child_process'

async function main(){

    let str: String = `<?php
$loop1 = Sampler::select('loops-library/.wav');
$loop1->fade(0,-30);
`
    const w = new Writer()
    const imgs = []
    for(const line of str.split("\n")){
        const result = await w.writeLn(line)
        imgs.push(...result)
    }

    const spoken = new Speaker()
        .speak("I'm going to show you guys how FL soulto uses programming to generate all the awesome loops that he is uploading to looperman. This is meant to be only a teaser, more explanations and details are coming soon, so make sure to subscribe and stay tuned! Bye-bye!")
        .addBackground("assets/keyboard-fx.wav")

    const vr = new VideoRenderer()
    vr.setFrameRate(imgs.length/spoken.audio.len)
    vr.setAudio(spoken.audio)
    vr.render("results/*.png")

}

main()

