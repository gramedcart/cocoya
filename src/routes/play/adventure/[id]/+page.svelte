<script lang="ts">
    import localforage from 'localforage'
    import type { PlayCard } from 'src/app';
    import { get } from 'svelte/store';
    import { page } from '$app/stores';
    let sending = false
    let textContent = ''
    let sumed = ''
    let dummies = ''
    let tags = ''
    let notes = ''
    let title = ''
    let inputtxt = ''
    async function process() {
        if(!!window){
            const NovelStorage = localforage.createInstance({name: 'NovelStorage'})
            const d = await NovelStorage.getItem('novels')
            const cards = d as PlayCard[] 
            const card = cards[parseInt($page.params.id)]
            if(card.type === 'adventure'){
                textContent = card.textContent,
                sumed = card.sumed,
                dummies = card.dummies,
                tags = card.tags,
                notes = card.notes
                title = card.title
            }
        }
    }
    async function send(){
        if(inputtxt === ''){
            return
        }
        textContent = `${textContent}\nUser: ${inputtxt}\n`
        inputtxt = ''
        if(!sending){
            sending = true
            const a = await fetch("/api/adventure", {
                method: "POST",
                body: JSON.stringify({
                    text: textContent,
                    sumed: sumed,
                    dummies: dummies,
                    tags: tags,
                    notes: notes
                })
            })
            const v = (await a.json())
            textContent = v.data
            sumed = v.sumed
            dummies = v.dummies

            if(!!window){
                const NovelStorage = localforage.createInstance({name: 'NovelStorage'})
                const d = await NovelStorage.getItem('novels')
                let cards = d as PlayCard[] 
                cards[parseInt($page.params.id)] = {
                    type: 'adventure',
                    textContent: textContent,
                    sumed: sumed,
                    dummies: dummies,
                    tags: tags,
                    notes: notes,
                    title: title
                }
                await NovelStorage.setItem('novels', cards)
            }
            const x = document.querySelector('.textarea') as HTMLTextAreaElement
            sending = false
        }
    }
    process()
</script>

<svelte:head>
	<title>Play</title>
	<meta name="description" content="Play your stories" />
</svelte:head>

<div class="cont">
	<div class="box-cont">
        <div class="inner-cont">
            {#if dummies !== ''}
                <div class="dummies">{@html dummies.replace(/\n/g,'<br>')}</div>
            {/if}
            <textarea class="textarea" bind:value={textContent}></textarea>
        </div>
        <input class="sendInput" bind:value={inputtxt} on:keydown={(e) => {
            if(e.key.toLocaleLowerCase() === "enter"){
                send()
            }
        }}>
    </div>
    <div class="menu">
        <div class="menu-grid">
            <div>Title:</div>
            <input bind:value={title}>
            <div>Tags:</div>
            <input bind:value={tags}>
            <div>Notes:</div>
            <textarea bind:value={notes} class="note"/>
            <div>Memory:</div>
            <textarea bind:value={sumed} class="note"/>
        </div>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="send" class:sending={sending || inputtxt === ''} on:click={send}>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" enable-background="new 0 0 16 16">
            <path fill="#FFFFFF" d="M0,9l4,1.5L6,16l2.861-3.82L14,14l2-14L0,9z M7.169,11.44l-0.916,2.485l-1.086-3.118l8.402-7.631L7.169,11.44z"/>
        </svg>
    </div>
</div>
<style>
    .cont{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .menu-grid{
        display: grid;
        grid-template-columns: 4em 1fr;
        gap: 5px
    }

    .box-cont{
        height: calc(100vh - 110px);
        border: 1px solid var(--light);
        padding: 10px;
        width: calc(100vw - 310px);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow-x: hidden;
    }
    .inner-cont{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: calc(100vh - 160px);
        overflow-y: auto;
        align-items: center;
        width: 100%;
    }
    .sendInput{
        height: 40px;
        width: calc(100% - 248px);
        font-size: 20px;
    }
    textarea{
        border: 1px solid var(--light);
        overflow: auto;
        outline: none;

        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;

        resize: none;
        font-size: 16px;
        min-height: 100px;
    }
    .textarea{
        border: none;
        min-height: calc(2000px);
        width: calc(100% - 10px);
    }
    .dummies{
        width: calc(100% - 10px);
        border: none;
        outline: none;

        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;

        resize: none;
        font-size: 16px;
        color: var(--secondary);
    }
    .menu{
        border: 1px solid var(--light);
        margin-left: 10px;
        width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 10px;
    }
    input{
        border: 1px solid var(--light);

    }
    .send{
        position: absolute;
        right: 370px;
        bottom: 40px;
        background-color: var(--primary);
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

    }
    .sending{
        background-color: var(--secondary);

    }
    .send svg{
        margin-right: 5px;
    }

    .note{
        font-size: 12px;
    }
</style>