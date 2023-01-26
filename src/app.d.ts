// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

export interface NovelCard{
	type: 'novel'
    textContent:string
    sumed:string
    dummies:string
    tags:string
    notes:string
	title:string
}

export interface AdventureCard{
	type: 'adventure'
    textContent:string
    sumed:string
    dummies:string
    tags:string
    notes:string
	title:string
}
export interface rmCard{
	type: 'rm'
	title:string
}

export type PlayCard = NovelCard | rmCard | AdventureCard