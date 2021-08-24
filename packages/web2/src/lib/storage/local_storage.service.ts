class LocalStorageService {
	private readonly storagePrefix = 'scratchy.';

	get<T>(key: string): T | null {
		const item = localStorage.getItem(this.storagePrefix + key);

		if (!item || item === 'null') {
			return null;
		}

		try {
			return JSON.parse(item);
		} catch (e) {
			console.log(e);
		}

		return null;
	}

	set(key: string, value: any): boolean {
		if (value === undefined) {
			value = null;
		} else {
			value = JSON.stringify(value);
		}

		try {
			localStorage.setItem(this.storagePrefix + key, value);
		} catch (e) {
			console.log(e);
		}
		return false;
	}

	remove(key: string) {
		localStorage.removeItem(this.storagePrefix + key);
	}
}

export const localStorageService = new LocalStorageService();
