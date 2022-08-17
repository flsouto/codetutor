import Tutor, {Section} from '../Tutor'
import {execSync} from 'child_process'
import {existsSync, statSync} from 'fs'
import path from 'path'

const DIR = "results/tutor-test/"

global.d = (msg) => {
    console.log(msg)
    process.exit(0)
}

execSync(`rm ${DIR} -R`)

describe("Tutor class", () => {
    const t = new Tutor(DIR)

    it(".render", async() => {
        const s = await t.write("testing the render method")
        const video = s.render()
        expect(existsSync(video)).toBe(true)
        expect(statSync(video).size).toBeGreaterThan(1)
    })
})
