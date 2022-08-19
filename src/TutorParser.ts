import Tutor from './Tutor'

export default class TutorParser{

    parse(script){
        const pairs = []
        let pair = {say:"", write:[]}
        for(const line of script.split("\n")){
            if(line.substring(0,5)=="//sw "){
                if(pair.say.length||pair.write.length){
                    pairs.push(pair)
                    pair = {say:"", write:[]}
                }
                pair.say = line.substring(5)
            } else {
                pair.write.push(line)
            }
        }
        if(pair.say.length||pair.write.length){
            pairs.push(pair)
        }
        pairs.forEach(p => p.write = p.write.join("\n"))
        return new ParserResult(pairs)
    }
}

class ParserResult{
    constructor(
       public pairs : Array<{say:string, write: string}>
    ){
    }

    inject(t:Tutor){
        for(const p of this.pairs){
            t.say(p.say)
            t.write(p.write)
        }
    }
}
