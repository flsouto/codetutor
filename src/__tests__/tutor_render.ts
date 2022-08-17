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

jest.setTimeout(20000)

describe("Tutor class", () => {
    const t = new Tutor(DIR)

    it(".render write", async() => {
        const s = await t.write("testing the render method")
        const video = s.render()
        expect(existsSync(video)).toBe(true)
        expect(statSync(video).size).toBeGreaterThan(1)
    })

    it(".render say", async() => {
        const s = await t.say("testing saying something")
        const video = s.render()
        expect(existsSync(video)).toBe(true)
        expect(statSync(video).size).toBeGreaterThan(1)
    })

    it(".render say and write", async() => {
        const s = await t.say(
            "this is how we do it in node JS",
            "const existsSync = require('fs').existsSync"
        )
        const video = s.render()
        expect(existsSync(video)).toBe(true)
        expect(statSync(video).size).toBeGreaterThan(1)
    })
})
