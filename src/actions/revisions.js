export function fetchRevisions() {
	return {
		type: 'REVISIONS_FETCH'
	};
}

export function setStatusReady() {
	return {
		type: 'REVISIONS_READY'
	};
}

export function setStatusFetching() {
	return {
		type: 'REVISIONS_FETCHING'
	};
}

export function setRevisions( revisions ) {
	return {
		type: 'REVISIONS_SET',
		revisions
	};
}
