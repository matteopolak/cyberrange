import type { AxiosInstance } from 'axios';

import Lab, { LabData, LabDetail, LabState } from './lab';

export interface CampaignData {
	access_code: string;
	all_labs_have_no_objectives: boolean;
	already_in_campaign: unknown;
	any_sandbox_in_progress: boolean;
	availability: number;
	availability_string: string;
	avatar: string;
	completed_by_student: false;
	created_by_avatar_id: string;
	created_by_first_name: string;
	created_by_last_name: string;
	created_by_user_id: string;
	created_by_user_name: string;
	created_timestamp: string;
	definition_id: string;
	definition_name: string;
	description: string;
	difficulty: number;
	difficulty_string: string;
	end_date: string;
	has_started_course: unknown;
	hide_hints: boolean;
	instance_id: string;
	instance_name: string;
	is_active: boolean;
	lab_progress: number;
	lab_states: LabState[];
	last_update_timestamp: string;
	number_of_active_instances: unknown;
	number_of_instances: unknown;
	number_of_labs: number;
	objective_count: number;
	provision_all_labs: boolean;
	provision_just_in_time: boolean;
	published_timestamp: unknown;
	run_number: number;
	sandboxes_to_provision: number;
	scenario_type: string;
	scenario_type_string: string;
	score: number;
	start_date: string;
	student_completed_course: boolean;
	student_count_accepted: number;
	student_count_completed: number;
	student_count_in_progress: number;
	student_count_invited: number;
	suspend_idle_vms: boolean;
	task_count: number;
	tasks_completed_count: number;
	team_count: number;
	time_estimate_seconds: number;
	time_limit_minutes: number;
	time_remain_in_seconds: number;
	user_count: number;
}

export interface CampaignInstanceDetails {
	course_id: string;
	course_name: string;
	user_details: {
		any_sandbox_in_progress: boolean;
		avatar_id: string;
		email_address: string;
		invite_jwt: unknown;
		is_disabled: boolean;
		is_invite_failed_to_send: unknown;
		is_invite_pending: boolean;
		lab_progression_state: string;
		labs: LabDetail[];
		last_logged_in: string;
		last_name: string;
		name: string;
		operator_role: string;
		role_list: string[];
		time_limit_minutes: number;
		time_remain_in_seconds: number;
		token: string;
		total_completed_task_count: number;
		total_task_count: number;
		user_name: string;
	};
}

export default class Campaign {
	private _labs: Map<string, Lab> = new Map();
	private _details: CampaignInstanceDetails | null = null;

	private data: CampaignData;
	private http: AxiosInstance;

	constructor(data: CampaignData, http: AxiosInstance) {
		this.data = data;
		this.http = http;
	}

	async details() {
		if (this._details) return this._details;

		const response = await this.http.get<CampaignInstanceDetails>(
			`/v1/user/courses/${this.data.instance_id}/course_instance_details`,
		);

		return (this._details = response.data);
	}

	async labs() {
		if (this._details === null)
			throw new Error('campaign details must be loaded before fetching labs');
		if (this._labs.size > 0) return this._labs;

		const response = await this.http.get<LabData[]>(
			`/v1/user/courses/${this.data.instance_id}/labs`,
		);

		for (const lab of response.data) {
			this._labs.set(lab.lab_id, new Lab(lab, this.http, this._details));
		}

		return this._labs;
	}
}
