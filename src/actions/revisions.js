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

export function addRevisions( revisions ) {
	return {
		type: 'REVISIONS_ADD',
		revisions
	};
}

export function deleteRevisions( revisions ) {
	return {
		type: 'REVISIONS_DELETE',
		revisions
	};
}
