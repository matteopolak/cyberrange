import type { AxiosInstance } from 'axios';

import Objective, { ObjectiveData } from './objective';

export interface ObjectiveSummary {
	test_profile_id: string;
	scenario_objective_id: string;
	label: string;
	description: string;
	objective_index: number;
	required_watch_count: number;
	required_watch_completed_count: number;
	student_uuid: unknown;
	is_active: boolean;
	is_complete: boolean;
	allow_unordered_objectives: boolean;
	is_unordered_tasks: boolean;
	completed_task_count: number;
	task_count: number;
	earned_score: number;
	team_id: string;
}

export interface NodeSummary {
	node_id: string;
	team_id: unknown;
	display_label: string;
	node_role: string;
	os_family: string;
	os_name: string;
	wss_link: unknown;
	power_state: string;
	agent_connected: boolean;
	vm_name: string;
	is_passive_node: boolean;
}

export interface SandboxData {
	sandbox_id: string;
	is_unordered_objectives: boolean;
	objective_summaries: ObjectiveSummary[];
	nodes: NodeSummary[];
	resources: unknown[];
	test_profile_id: string;
}

export default class Sandbox {
	private _objectives: Map<string, Objective> = new Map();

	private data: SandboxData;
	private http: AxiosInstance;

	constructor(data: SandboxData, http: AxiosInstance) {
		this.data = data;
		this.http = http;
	}

	async objectives() {
		for (const { scenario_objective_id: objectiveId } of this.data
			.objective_summaries) {
			const response = await this.http.get<ObjectiveData>(
				`/v1/user/objectives/${objectiveId}`,
			);

			this._objectives.set(
				objectiveId,
				new Objective(response.data, this.http),
			);
		}

		return this._objectives;
	}
}
