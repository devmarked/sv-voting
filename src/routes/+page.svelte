<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	// Destructure BOTH data and form in one $props() call
	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Get the current poll data (from action result or initial load)
	let currentPoll = $derived(form?.poll || data.poll);
	
	// Calculate total votes
	let totalVotes = $derived(
		currentPoll?.options.reduce((sum, opt) => sum + opt.votes, 0) || 0
	);

	// Track selected option for optimistic UI
	let selectedOption = $state<string | null>(null);
	let isSubmitting = $state(false);
</script>

<div class="mx-auto max-w-2xl p-8">
	{#if currentPoll}
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h1 class="mb-6 text-3xl font-bold text-gray-900">
				{currentPoll.question}
			</h1>

			<form
				method="POST"
				action="?/vote"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
						selectedOption = null;
					};
				}}
			>
				<input type="hidden" name="pollId" value={currentPoll.id} />

				<div class="space-y-3">
					{#each currentPoll.options as option (option.id)}
						{@const percentage = totalVotes > 0 
							? Math.round((option.votes / totalVotes) * 100) 
							: 0}
						{@const isSelected = selectedOption === option.id}
						
						<label
							class="relative block cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-blue-400
								{isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}"
						>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<input
										type="radio"
										name="optionId"
										value={option.id}
										bind:group={selectedOption}
										class="h-4 w-4 text-blue-600"
										disabled={isSubmitting}
									/>
									<span class="text-lg font-medium text-gray-900">
										{option.text}
									</span>
								</div>
								<div class="flex items-center gap-2 text-sm">
									<span class="font-semibold text-gray-700">
										{option.votes} votes
									</span>
									<span class="text-gray-500">({percentage}%)</span>
								</div>
							</div>

							<!-- Progress bar -->
							<div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
								<div
									class="h-full bg-blue-500 transition-all duration-300"
									style="width: {percentage}%"
								></div>
							</div>
						</label>
					{/each}
				</div>

				<button
					type="submit"
					disabled={!selectedOption || isSubmitting}
					class="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSubmitting ? 'Submitting...' : 'Submit Vote'}
				</button>
			</form>

			{#if form?.error}
				<div class="mt-4 rounded-lg bg-red-50 p-4 text-red-800">
					Error: {form.error}
				</div>
			{/if}

			{#if form?.success}
				<div class="mt-4 rounded-lg bg-green-50 p-4 text-green-800">
					✓ Vote recorded successfully!
				</div>
			{/if}

			<div class="mt-6 text-center text-sm text-gray-500">
				Total votes: {totalVotes}
			</div>
		</div>
	{:else}
		<p class="text-gray-600">Poll not found.</p>
	{/if}
</div>