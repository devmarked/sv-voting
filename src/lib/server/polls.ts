// Simple in-memory poll storage
export type Poll = {
	id: string;
	question: string;
	options: Array<{
		id: string;
		text: string;
		votes: number;
	}>;
};

// Sample poll data
export const polls: Map<string, Poll> = new Map([
	[
		'favorite-framework',
		{
			id: 'favorite-framework',
			question: 'What is your favorite JavaScript framework?',
			options: [
				{ id: 'react', text: 'React', votes: 5 },
				{ id: 'vue', text: 'Vue', votes: 3 },
				{ id: 'svelte', text: 'Svelte', votes: 10 },
				{ id: 'angular', text: 'Angular', votes: 2 }
			]
		}
	]
]);

export function getPoll(id: string): Poll | undefined {
	return polls.get(id);
}

export function vote(pollId: string, optionId: string): boolean {
	const poll = polls.get(pollId);
	if (!poll) return false;

	const option = poll.options.find((opt) => opt.id === optionId);
	if (!option) return false;

	option.votes += 1;
	return true;
}