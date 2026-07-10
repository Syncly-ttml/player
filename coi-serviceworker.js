/*
 * Cross-origin isolation helper for static hosts such as GitHub Pages.
 * It lets the FFmpeg audio engine use SharedArrayBuffer even when the host
 * cannot set COOP/COEP response headers itself.
 */
if (typeof window === "undefined") {
	self.addEventListener("install", () => self.skipWaiting());
	self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
	self.addEventListener("fetch", (event) => {
		if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
			return;
		}
		event.respondWith(
			fetch(event.request).then((response) => {
				if (response.status === 0) return response;
				const headers = new Headers(response.headers);
				headers.set("Cross-Origin-Opener-Policy", "same-origin");
				headers.set("Cross-Origin-Embedder-Policy", "require-corp");
				headers.set("Cross-Origin-Resource-Policy", "cross-origin");
				return new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers,
				});
			}),
		);
	});
} else if (
	window.isSecureContext &&
	"serviceWorker" in navigator &&
	!window.crossOriginIsolated
) {
	const reloadKey = "amll-coi-serviceworker-reloaded";
	if (!window.sessionStorage.getItem(reloadKey)) {
		navigator.serviceWorker
			.register("./coi-serviceworker.js")
			.then(() => navigator.serviceWorker.ready)
			.then(() => {
				window.sessionStorage.setItem(reloadKey, "true");
				window.location.reload();
			});
	}
}
