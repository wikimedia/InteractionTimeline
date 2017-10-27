export function updateUsers( users ) {
	return {
		type: 'USERS_UPDATE',
		users
	};
}

export function resetUsers() {
	return {
		type: 'USERS_RESET'
	};
}
