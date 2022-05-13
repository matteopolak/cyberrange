import { AxiosInstance } from 'axios';
import Task, { TaskData } from './task';

export interface ObjectiveData {
	allow_unordered_objectives: boolean;
	description: string;
	earned_score: number;
	is_unordered_task: unknown;
	name: string;
	objective_index: number;
	required_watch_count: number;
	scenario_objective_id: string;
	state: string;
	tasks: TaskData[];
	test_profile_id: string;
}

export default class Objective {
	private _tasks: Map<string, Task> = new Map();

	private data: ObjectiveData;
	private http: AxiosInstance;

	constructor(data: ObjectiveData, http: AxiosInstance) {
		this.data = data;
		this.http = http;
	}

	async tasks() {
		if (this._tasks.size > 0) return this._tasks;

		for (const task of this.data.tasks) {
			this._tasks.set(task.scenario_task_id, new Task(task, this.http));
		}

		return this._tasks;
	}
}
