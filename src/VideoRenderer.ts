import videoshow from 'videoshow'

export default class VideoRenderer{

    private options = {
        fps: 25,
        loop: .2,
        transition: false,
        transitionDuration: 1,
        videoBitrate: 1024,
        videoCodec: 'libx264',
        size: '1200x800',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'yuv420p'
    }

    options(merge){
        this.options = {...this.options, ...merge}
        return this
    }

    render(imgs : String[], save_as : String = 'results/output.mp4'){
        videoshow(imgs, this.options)
            .save(save_as)
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
}
