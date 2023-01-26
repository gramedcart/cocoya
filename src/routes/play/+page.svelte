<script lang="ts">
    import { page } from '$app/stores';
    import localforage from 'localforage'
    import type { PlayCard } from 'src/app';

    let cards:PlayCard[] = []

    async function process() {
        if(!!window){
            const NovelStorage = localforage.createInstance({name: 'NovelStorage'})
            const d = await NovelStorage.getItem('novels')
            if(d){
                cards = d as PlayCard[] 
            }
        }
    }
    async function CreateNew() {
        if(!!window){
            const NovelStorage = localforage.createInstance({name: 'NovelStorage'})
            const d = await NovelStorage.getItem('novels')
            if(d){
                cards = d as PlayCard[] 
            }
            cards.push({
                type: 'novel',
                textContent:'',
                sumed:'',
                dummies:'',
                tags:'',
                notes:'',
                title:'No Title',
            })
            await NovelStorage.setItem('novels', cards)
            
        }
    }
    async function CreateNewAdventure() {
        if(!!window){
            const NovelStorage = localforage.createInstance({name: 'NovelStorage'})
            const d = await NovelStorage.getItem('novels')
            if(d){
                cards = d as PlayCard[] 
            }
            cards.push({
                type: 'adventure',
                textContent:'',
                sumed:'',
                dummies:'',
                tags:'',
                notes:'',
                title:'No Title',
            })
            await NovelStorage.setItem('novels', cards)
            
        }
    }
    async function rmCard(i:number){
        if(!!window){
            const NovelStorage = localforage.createInstance({name: 'NovelStorage'})
            const d = await NovelStorage.getItem('novels')
            if(d){
                cards = d as PlayCard[] 
            }
            cards[i] = {
                type: 'rm',
                title: ''
            }
            await NovelStorage.setItem('novels', cards)
            
        }
    }
    process()


</script>
<div class="centre">
    <div class="container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="card" on:click={CreateNewAdventure}>➕ Create New Adventure</div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="card" on:click={CreateNew}>➕ Create New Novel</div>

        {#each cards as card, i}
            {#if card.type === 'novel'}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="cont-card">
                    <div class="card" on:click={() => {window.location.pathname = `/play/write/${i}`}}>📗 {card.title} </div>
                    <button class="trash" on:click={() => {rmCard(i)}}>🗑️</button>
                </div>
            {/if}
            {#if card.type === 'adventure'}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="cont-card">
                    <div class="card" on:click={() => {window.location.pathname = `/play/adventure/${i}`}}>⚔️ {card.title} </div>
                    <button class="trash" on:click={() => {rmCard(i)}}>🗑️</button>
                </div>
            {/if}
        {/each}
        <div class="centre">
            <h2>MY STORAGE</h2>
        </div>
    </div>
    
</div>

<style>
    .centre{
        display: flex;
        justify-content: center;
        width: 100%;
    }
    .container{
        max-width: 800px;
        width: 90vw;
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-start;
        /* align-items: center; */
        padding: 10px;
        border: 1px solid var(--light);
        gap: 5px;
    }
    .cont-card{
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .card{
        border: 1px solid var(--light);
        padding: 16px;
        cursor: pointer;
    }
    .cont-card .card{
        width: calc(100% - 81px);
        margin-right: 5px;
    }
    .trash{
        float: right;
        width: 60px;
    }
</style>