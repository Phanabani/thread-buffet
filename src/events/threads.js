export default {
	name: 'threadCreate',
	once: false,
	execute(thread) {
		console.log(`New thread created: ${thread.name}`)
	},
};
