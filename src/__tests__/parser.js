import Parser from '../TutorParser'

describe("Parser class",()=>{

    it(".parse", () => {
        const p = new Parser()
        const result = p.parse([
            "//sw this is a variable",
            "let variable = 1",
            "let variable2 = 2",
            "//sw and this is a function",
            "function func(){ return variable; }"
        ].join("\n")).pairs
        expect(result.length).toBe(2)
        expect(result[0].say).toMatch(/variable/)
        expect(result[0].write).toMatch(/let/)
        expect(result[0].write).toMatch(/variable2/)
        expect(result[1].say).toMatch(/this is/)
        expect(result[1].write).toMatch(/return var/)
    })

})
