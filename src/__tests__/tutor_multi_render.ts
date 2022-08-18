import Tutor, {Section} from '../Tutor'
import VideoRenderer from '../VideoRenderer'
import {execSync} from 'child_process'
import {existsSync, statSync} from 'fs'
import path from 'path'

const DIR = "results/tutor-test/"

global.d = (msg) => {
    console.log(msg)
    process.exit(0)
}

jest.setTimeout(60000)

describe("Tutor class", () => {

    it("multi render", async() => {
        if(existsSync(DIR)){
            execSync(`rm ${DIR} -R`)
        }
        const t = new Tutor(DIR)
        await t.say("This is how you define a variable")
        await t.write("let age = 18")
        await t.say("And this is how you define a function")
        await t.write(`function getAge(){
    return age;
}
`)
        const video = t.render()
        expect(existsSync(video)).toBe(true)
        expect(statSync(video).size).toBeGreaterThan(1)
    })

})
