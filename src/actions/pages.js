export function setUserPages( user, pages ) {
	return {
		type: 'PAGES_SET_USER_PAGES',
		user,
		pages
	};
}

export function mergeUserPages( user, pages ) {
	return {
		type: 'PAGES_MERGE_USER_PAGES',
		user,
		pages
	};
}

export function fetchUserPagesContinue( domain, user, cont ) {
	return {
		type: 'PAGES_FETCH_CONTINUE',
		domain,
		user,
		cont
	};
}
