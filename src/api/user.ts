import axios, { AxiosInstance } from 'axios';

import Campaign, { CampaignData } from './campaign';

export interface UserLoginResponse {
	token: string;
	mfa_required: boolean;
	mfa_token: string | null;
}

export default class User {
	private _campaigns: Map<string, Campaign> = new Map();

	private username: string;
	private password: string;
	private http: AxiosInstance = axios.create({
		baseURL: 'https://ictc-cyberrange.fieldeffect.net/CyberRest/services/rest',
	});

	constructor(username: string, password: string) {
		this.username = username;
		this.password = password;
	}

	async login() {
		const response = await this.http.post<UserLoginResponse>('/login', {
			username: this.username,
			password: this.password,
		});

		if (response.data.mfa_required) {
			throw new Error('mfa support not implemented');
		}

		if (response.status === 200) {
			this.http.defaults.headers.common.Authorization = response.data.token;
		}
	}

	async campaigns() {
		if (this._campaigns.size > 0) return this._campaigns;

		const response = await this.http.get<CampaignData[]>(
			'/v1/user/campaigns/instances',
			{
				params: {
					max_count: 100,
					advanced_filter:
						'(is_active~1+and+student_completed_course~0)+order+start_date+desc',
				},
			},
		);

		for (const campaign of response.data) {
			this._campaigns.set(
				campaign.instance_id,
				new Campaign(campaign, this.http),
			);
		}

		return this._campaigns;
	}
}
