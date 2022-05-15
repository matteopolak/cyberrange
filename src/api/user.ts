import axios, { AxiosInstance } from 'axios';

import Campaign, { CampaignData, CampaignInstanceDetails } from './campaign';
import Lab from './lab';
import Sandbox from './sandbox';

export interface UserLoginResponse {
	token: string;
	mfa_required: boolean;
	mfa_token: string | null;
}

export type Role = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT' | 'CANDIDATE';

export interface UserDetails {
	username: string;
	name: string;
	first_name: string;
	last_name: string;
	description: string;
	email_address: string;
	user_token: string;
	avatar_id: string;
	validation_method: string;
	is_disabled: boolean;
	last_logged_in: string;
	last_password_update: string;
	role_list: Role[];
	time_zone: string;
	dismissed_banner: boolean;
	invite_email_enabled: boolean;
	expiry_email_enabled: boolean;
	course_complete_email_enabled: boolean;
}

export default class User {
	private _campaigns: Map<string, Campaign> = new Map();
	private _labs: Map<string, Lab> = new Map();
	private _sandboxes: Map<string, Sandbox> = new Map();
	private _details: UserDetails | null = null;

	public http: AxiosInstance = axios.create({
		baseURL: 'https://ictc-cyberrange.fieldeffect.net/CyberRest/services/rest',
	});

	constructor() {}

	async update(data: Partial<Omit<UserDetails, 'first_name'>>) {
		const response = await this.http
			.patch('/v1/user/self', data)
			.catch(console.error);

		if (!response || response.status !== 200) return null;

		return this.details();
	}

	async details() {
		const response = await this.http.get<UserDetails>('/v1/user/self');

		return (this._details = response.data);
	}

	async login(username: string, password: string) {
		const response = await this.http.post<UserLoginResponse>('/login', {
			username,
			password,
		});

		if (response.data.mfa_required) {
			throw new Error('mfa support not implemented');
		}

		if (response.status === 200) {
			this.http.defaults.headers.get.Authorization = response.data.token;
			this.http.defaults.headers.post.Authorization = response.data.token;
			this.http.defaults.headers.patch.Authorization = response.data.token;
			this.http.defaults.headers.common.Authorization = response.data.token;
		}

		return response.data.token;
	}

	async campaigns() {
		if (this._campaigns.size > 0) return this._campaigns;

		const response = await this.http.get<CampaignData[]>(
			'/v1/user/campaigns/instances',
			{
				params: {
					max_count: 100,
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

	async labs() {
		if (this._labs.size > 0) return this._labs;

		const response = await this.http.get('/v1/user/labs');

		for (const lab of response.data) {
			this._labs.set(
				lab.lab_id,
				new Lab(lab, this.http, null as unknown as CampaignInstanceDetails),
			);
		}

		return this._labs;
	}

	async sandboxes() {
		if (this._sandboxes.size > 0) return this._sandboxes;

		const response = await this.http.get('/v1/user/sandboxes');

		for (const sandbox of response.data) {
			this._sandboxes.set(sandbox.sandbox_id, new Sandbox(sandbox, this.http));
		}

		return this._sandboxes;
	}
}
