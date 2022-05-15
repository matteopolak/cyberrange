import User from './user';

export interface License {
	comments: string;
	is_cyber_range_licensed: null;
	licensee: string;
	max_queue_size: number;
	max_sandboxes: number;
	max_slots: number;
	max_students: number;
	max_users: number;
}

export interface EmailSettings {
	enabled: boolean;
	use_portal: boolean;
	smtp: {
		use_anonymous_auth: boolean;
		sender_email: null;
		smtp_username: null;
		smtp_password: null;
		server_address: null;
		server_port: number;
		ignore_sslwarnings: boolean;
	};
	portal: {
		username: string;
	};
}

export default class Admin extends User {
	constructor() {
		super();
	}

	async license() {
		const response = await this.http.get<License>('/v1/admin/license');

		return response.data;
	}

	async updateLicense() {
		await this.http.put('/v1/admin/license');
	}

	async emailSettings() {
		const response = await this.http.get<EmailSettings>(
			'/v1/admin/email_settings',
		);

		return response.data;
	}

	async updateEmailSettings(data: Partial<EmailSettings>) {
		if (data.smtp) {
			await this.http.patch('/v1/admin/email_settings/smtp', data.smtp);
		}

		if (data.portal) {
			await this.http.patch('/v1/admin/email_settings/portal', data.portal);
		}

		if (data.enabled !== undefined || data.use_portal !== undefined) {
			await this.http.post('/v1/admin/email_settings/toggle', {
				enabled: data.enabled,
				use_portal: data.use_portal,
			});
		}
	}
}
