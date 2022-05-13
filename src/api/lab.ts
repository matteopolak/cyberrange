import { AxiosInstance } from 'axios';
import { CampaignInstanceDetails } from './campaign';
import Sandbox from './sandbox';

export interface LabState {
	is_student_env_in_trouble: boolean;
	lab_id: string;
	lab_index: number;
	lab_name: string;
	lab_state: string;
	lab_state_from_db: string;
}

export interface LabDetail {
	lab_id: string;
	lab_name: string;
	objective_count_active: number;
	objective_count_completed: number;
	objective_count_in_progress: number;
	sandbox_id: string;
	sandbox_index: number;
	sandbox_state: number;
	sandbox_state_string: string;
	score: number;
	test_profile_id: string;
	total_objective_count: number;
}

export interface LabNodeDetail {
	base_dir: string;
	disk_space_available_mb: number;
	is_passive_node: boolean;
	node_name: string;
	os_family: string;
	os_name: string;
	transfer_dir: string;
}

export interface LabData {
	name: string;
	description: unknown;
	start_timestamp: unknown;
	end_timestamp: unknown;
	scenario_definition_id: string;
	created_by_user_id: string;
	created_by_user_name: string;
	created_timestamp: string;
	is_definition: boolean;
	node_names: string[];
	node_details: LabNodeDetail[];
	objective_names: string[];
	outstanding_invitations: number;
	not_started_students: number;
	in_progress_students: number;
	completed_students: number;
	total_task_count: number;
	course_id: string;
	lab_id: string;
	lab_index: number;
	lab_state: string;
	lab_state_string: string;
	course_definition_id: string;
}

export default class Lab {
	private _sandbox: Sandbox | null = null;

	private data: LabData;
	private http: AxiosInstance;
	private details: CampaignInstanceDetails;

	constructor(
		data: LabData,
		http: AxiosInstance,
		details: CampaignInstanceDetails,
	) {
		this.data = data;
		this.http = http;
		this.details = details;
	}

	async sandbox() {
		if (this._sandbox) return this._sandbox;

		const labDetails = this.details.user_details.labs.find(
			l => l.lab_id === this.data.lab_id,
		);

		if (!labDetails) throw new Error('lab details not found');

		const response = await this.http.get<Sandbox>(
			`/v1/user/sandboxes/${labDetails.sandbox_id}`,
		);

		return (this._sandbox = response.data);
	}
}
