class HttpClient {
	constructor(private readonly baseUrl: string) {}

	async get(url: string, config: Omit<RequestInit, 'body'>) {
		const response = await fetch(
			new URL(url, this.baseUrl).toString(),
			this.mergeConfig({
				...config,
				method: 'GET'
			})
		);
		return response.json();
	}

	async post(
		url: string,
		body: Record<string, unknown> = {},
		config: Omit<RequestInit, 'body'> = {}
	) {
		if (url[0] === '/') url = url.slice(1);
		config = this.mergeConfig({
			...config,
			method: 'POST',
			body: JSON.stringify(body)
		});
		url = new URL(url, this.baseUrl).toString();
		console.log(config, url);
		const response = await fetch(url, config);
		return response.json();
	}

	setHeader(name: string, value: string) {
		this.baseConfig = this.mergeConfig({ headers: { [name]: value } });
	}

	private baseConfig: RequestInit = {
		credentials: 'include',
		headers: {
			'content-type': 'application/json'
		}
	};

	private mergeConfig(config: RequestInit): RequestInit {
		return {
			...this.baseConfig,
			...config,
			headers: {
				...this.baseConfig.headers,
				...config.headers
			}
		};
	}
}

export const apiHttpClient = new HttpClient(import.meta.env.VITE_API_URL);
