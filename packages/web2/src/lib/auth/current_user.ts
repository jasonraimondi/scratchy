import { writable } from 'svelte/store';
import { browser } from '$app/env';
import { localStorageService } from '$lib/storage/local_storage.service';
import { accessTokenStore } from '$lib/auth/access_token';

type CurrentUser = { id: string };

let init;

if (browser) {
	init = localStorageService.get('currentUser') ?? undefined;
}

export const currentUserStore = writable<CurrentUser>(init);

accessTokenStore.subscribe((accessToken) => {
	const decoded = accessToken?.decoded;

	if (decoded) {
		currentUserStore.set({ id: decoded.userId });
	} else {
		currentUserStore.set(undefined);
	}
});

currentUserStore.subscribe((currentUser) => {
	if (browser) localStorageService.set('currentUser', currentUser);
});
