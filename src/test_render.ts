import VideoRenderer from './VideoRenderer'
import Writer from './Writer'

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

    const w = await Writer.create()
    const imgs = []
    for(const line of str.split("\n")){
        const result = await w.writeLn(line)
        imgs.push(...result)
    }

    const vr = new VideoRenderer()
    vr.render(imgs)

}

main()
