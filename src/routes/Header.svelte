<script>
	import { page } from '$app/stores';
</script>

<header>
	<ul>
		<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
			<a href="/">Home</a>
		</li>
		<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
			<a href="/about">About</a>
		</li>
		<li aria-current={$page.url.pathname.startsWith('/play') ? 'page' : undefined}>
			<a href="/play">Play</a>
		</li>
	</ul>
</header>

<style>
	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background-size: contain;
		width: 100%;
		background-color: white;
		gap: 10px;
		border-bottom: 1px solid var(--light);

	}

	li{
		padding: 3px;
	}

	li[aria-current] a {
		color: var(--primary)
	}
</style>
