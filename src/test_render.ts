import Tutor from './Tutor'
async function main(){

const t = new Tutor('results/jswebworkers')
t.writer.fontHeight = 26
t.writer.fontSize = 18

await t.say(
"web workers are real slaves that do heavy stuff in the background",
"myWorker = new WebWorker('slave.js')"
)

await t.say(
"You must send a message to the poor bastard telling it what to do",
"myWorker.postMessage('build a pyramid')"
)

await t.say(
"The result can be captured with the onmessage handler, no need to thank",
`myWorker.onmessage = (result) => {
    alert("Got a pyramid: "+result)
}`
)

await t.say(
"And here is how you define the script which perpetuates the slavery",
`// slave.js
module.onmessage = (command) => {
    if(command == 'build a pyramid'){
        const HUGE_PYRAMID = '/_\'
        postMessage(HUGE_PYRAMID)
	}
}`
)

t.render()

}
main()

