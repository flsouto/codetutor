import Audio from  '../Audio'
import {existsSync} from 'fs'

const dummyf = `assets/keyboard-fx.wav`

describe("Audio class",() => {
    it("can be instantiated", () => {
        const a = new Audio(dummyf)
        expect(a).toBeInstanceOf(Audio)
    })
    it("throws error on inexistent files", () => {
        expect(() => new Audio('blahblah')).toThrow()
    })
})

const a = new Audio(dummyf)
describe("Audio object",() => {
    it(".len", () => {
        expect(a.len).toBeGreaterThan(0)
    })
    it(".add", () => {
        const a2 = a.add(dummyf)
        expect(a2).toBeInstanceOf(Audio)
        expect(a2.file).not.toBe(a.file)
        expect(a2.len).toBeCloseTo(a.len*2)
    })
    it(".trim", () => {
        const a2 = a.trim(0,5)
        expect(a2.len).toBeCloseTo(5)
        expect(a2.file).not.toBe(a.file)
    })

    it(".save", () => {
        const f = Audio.tmpf
        a.save(f)
        expect(existsSync(f)).toBe(true)
    })
})
