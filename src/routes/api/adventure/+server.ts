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
            prompt: `Summarize the following Text adventure. \n${toSum} Summarize:`,
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
        AdditionalInput = `\nthis text adventure is a ${tags} text adventure.\n`
    }
    if(sumed !== ''){
        AdditionalInput += `\nthe story so far: ${sumed}\n`
    }
    if(notes !== ''){
        AdditionalInput += `\nthe story's additional settings: [${notes}]\n`
    }

    const prompta = `AI will act as a text-based adventure game. User will type commands and AI will reply with a description of what the character sees. AI will only reply with the game output, and nothing else. AI will not write explanations. AI will not type commands unless User instruct AI to do so. responde in english. ${AdditionalInput} \n\n${inputText}\nAI:`
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompta,
        temperature: 0.5,
        max_tokens: 300,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["AI:", "User:"],
    });

    return new Response(JSON.stringify({data:inputText + "\nAI:" +(response.data.choices[0].text ?? '').replace(/\[|\]/g, '') + '\n', dummies: dummies, sumed: sumed}));   
}