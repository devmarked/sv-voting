import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPoll, vote } from '$lib/server/polls';

// Load function - runs on the server before rendering
export const load: PageServerLoad = async () => {
	const poll = getPoll('favorite-framework');
	
	if (!poll) {
		return { poll: null };
	}

	return {
		poll
	};
};

// Form actions - handle POST requests
export const actions: Actions = {
	vote: async ({ request }) => {
		const data = await request.formData();
		const pollId = data.get('pollId');
		const optionId = data.get('optionId');

		if (!pollId || !optionId) {
			return fail(400, { error: 'Missing poll or option ID' });
		}

		const success = vote(pollId.toString(), optionId.toString());

		if (!success) {
			return fail(404, { error: 'Poll or option not found' });
		}

		// Get updated poll data
		const poll = getPoll(pollId.toString());
		
		return {
			success: true,
			poll
		};
	}
};