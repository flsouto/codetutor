import Tutor, {Section} from '../Tutor'
import {execSync} from 'child_process'
import {existsSync} from 'fs'
import path from 'path'

const DIR = "results/tutor-test/"

global.d = (msg) => {
    console.log(msg)
    process.exit(0)
}

execSync(`rm ${DIR} -R`)

describe("Tutor class", () => {
    const t = new Tutor(DIR)
    it("creates instance", () => {
        expect(t).toBeInstanceOf(Tutor)
        expect(existsSync(DIR)).toBe(true)
    })
    it(".addSection", () => {
        const s1 = t.createSection()
        expect(s1).toBeInstanceOf(Section)
        expect(existsSync(s1.dir)).toBe(true)
        const s2 = t.createSection()
        expect(s2.dir).not.toBe(s1.dir)
    })

    it(".write", async() => {
        const str = "simple test"
        const s = await t.write(str)
        s.imgs.forEach(img => expect(existsSync(img)).toBe(true))
        const count = parseInt(execSync(`ls ${path.join(s.dir,"*.png")} | wc -l`).toString())
        expect(count).toBe(str.length)
        expect(existsSync(s.audio.file)).toBe(true)
        expect(s.audio.file).toContain(s.dir)
        expect(s.audio.len).toBeGreaterThan(0)
    })
})
