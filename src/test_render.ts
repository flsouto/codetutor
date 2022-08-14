import gd from 'node-gd'
import videoshow from 'videoshow'

async function main(){

const str: String = `<html>
        <head>
                {head}
        </head>
        <body>
                {body}
        </body>
</html>
`

const img = await gd.create(1200, 800);
img.colorAllocate(0, 0, 0);

const color = img.colorAllocate(0, 255, 0);
const font = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
const txth = 25
let currh = txth

const imgs = []
for(const [i,line] of str.split("\n").entries()){
        img.stringFT(color, font, 18, 0, 0, currh, line);
        const f = `results/output${i}.png`
        await img.savePng(f, 1);
        imgs.push(f)
        currh += txth
}


var videoOptions = {
  fps: 25,
  loop: .2, // seconds
  transition: false,
  transitionDuration: 1, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '1200x800',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4',
  pixelFormat: 'yuv420p'
}

videoshow(imgs, videoOptions)
  .save('results/video.mp4')
  .on('start', function (command) {
    console.log('ffmpeg process started:', command)
  })
  .on('error', function (err, stdout, stderr) {
    console.error('Error:', err)
    console.error('ffmpeg stderr:', stderr)
  })
  .on('end', function (output) {
    console.error('Video created in:', output)
  })

}

main()
