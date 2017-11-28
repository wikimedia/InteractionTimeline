export function setRevisions( revisions ) {
	return {
		type: 'REVISIONS_SET',
		revisions
	};
}

export function deleteRevisions( revisions ) {
	return {
		type: 'REVISIONS_DELETE',
		revisions
	};
}
