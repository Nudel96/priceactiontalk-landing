<script>
	import '../app.css';
	import 'aos/dist/aos.css';
	import { page } from '$app/stores';
	$: currentPath = $page.url.pathname;
</script>

<div data-path={currentPath}>
	<slot />
</div>
