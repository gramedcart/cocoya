import { error } from '@sveltejs/kit';
import type {RequestEvent} from '@sveltejs/kit'
import { openai } from '$lib/openai';

export async function POST(ev:RequestEvent) {
    const url:URL = ev.url
    const t = await ev.request.json()
    let inputText:string = t.text
    let textList = inputText.split(' ')
    let AdditionalInput = ''

    let sumed:string = t.sumed
    let dummies:string = t.dummies
    let tags:string = t.tags
    let notes:string = t.notes

    console.log(textList.length)
    if(textList.length > 600){
        let toSum = textList.slice(0, 300).join(' ')
        dummies += toSum + '\n'
        const next = textList.slice(300)
        toSum = sumed !== '' ? `\n${sumed}\n${toSum}` : toSum

        const response = await openai.createCompletion({
            model: "text-curie-001",
            prompt: `Summarize the following Novel. If there is a [] in the novel, Keep it. \nNovel:\n${toSum} Summarize:`,
            temperature: 0.5,
            max_tokens: 200,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
            stop: ["Novel:","Summarize:"],
        });

        sumed += response.data.choices[0].text ?? ''
        inputText = next.join(' ')
    }

    if(tags !== ''){
        AdditionalInput = `\nthis novel is a ${tags} novel.\n`
    }
    if(sumed !== ''){
        AdditionalInput += `\nthe story so far: ${sumed}\n`
    }
    if(notes !== ''){
        AdditionalInput += `\nthe story's additional settings: [${notes}]\n`
    }


    const prompta = `Continue writing the following Novel. If there is a [] in the novel, it is a setting of the novel. don't output []. don't finish the novel. ${AdditionalInput} \n\nNovel:\n${inputText}`
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompta,
        temperature: 0.5,
        max_tokens: 300,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["Novel:"],
    });

    return new Response(JSON.stringify({data:inputText + (response.data.choices[0].text ?? '').replace(/\[|\]/g, ''), dummies: dummies, sumed: sumed}));   
}