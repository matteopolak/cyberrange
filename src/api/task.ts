import { AxiosInstance } from 'axios';
import Question, { QuestionData } from './question';

export interface TaskData {
	force_complete: boolean;
	is_active: boolean;
	is_complete: boolean;
	is_hide_hints: boolean;
	is_hide_instructions: boolean;
	is_optional: boolean;
	is_optional_skipped: boolean;
	manual_tasks: QuestionData[];
	name: string;
	objective_index: number;
	scenario_objective_id: string;
	scenario_task_id: string;
	score_value: number;
	task_index: number;
	watches: unknown[];
}

export default class Task {
	private _questions: Map<string, Question> = new Map();

	private data: TaskData;
	private http: AxiosInstance;

	constructor(data: TaskData, http: AxiosInstance) {
		this.data = data;
		this.http = http;
	}

	async questions() {
		if (this._questions.size > 0) return this._questions;

		for (const question of this.data.manual_tasks) {
			this._questions.set(
				question.task_id,
				new Question(
					question,
					{ scenario_objective_id: this.data.scenario_objective_id },
					this.http,
				),
			);
		}

		return this._questions;
	}
}
