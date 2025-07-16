/**
 * @param {HTMLElement} element The element to observe
 * @param {{ once?: boolean, threshold?: number }} options
 */
export function viewport(element: HTMLElement, options = { once: true, threshold: 0.3 }) {
	let intersectionObserver: IntersectionObserver;

	const handleIntersect = (
		entries: IntersectionObserverEntry[],
		observer: IntersectionObserver
	) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// Dispatch a custom event when the element enters the viewport
				element.dispatchEvent(new CustomEvent('enter'));
				// If `once` is true, stop observing after the first intersection
				if (options.once) {
					observer.unobserve(element);
				}
			}
		});
	};

	// Ensure code only runs in the browser
	if (typeof IntersectionObserver !== 'undefined') {
		intersectionObserver = new IntersectionObserver(handleIntersect, {
			root: null, // observe against the viewport
			threshold: options.threshold
		});
		intersectionObserver.observe(element);
	}

	// Cleanup when the component is destroyed
	return {
		destroy() {
			if (intersectionObserver) {
				intersectionObserver.disconnect();
			}
		}
	};
}
