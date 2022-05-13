import { AxiosInstance } from 'axios';

export interface QuestionAnswerResponse {
	answer_correct: boolean;
}

export interface QuestionData {
	completed_timestamp: string;
	description: unknown;
	hint_accessed_timestamp: unknown;
	hint_available: boolean;
	is_complete: boolean;
	name: string;
	no_solution: boolean;
	scenario_task_id: string;
	solution: string;
	task_id: string;
}

export interface QuestionDetails {
	scenario_objective_id: string;
}

export default class Question {
	private data: QuestionData;
	private details: QuestionDetails;
	private http: AxiosInstance;

	constructor(
		data: QuestionData,
		details: QuestionDetails,
		http: AxiosInstance,
	) {
		this.data = data;
		this.details = details;
		this.http = http;
	}

	async answer(answer: string) {
		const response = await this.http.post<QuestionAnswerResponse>(
			`/v1/user/objectives/${this.details.scenario_objective_id}/tasks/${this.data.scenario_task_id}/questions/${this.data.task_id}/answer`,
			{ answer },
		);

		return response.data.answer_correct;
	}
}
