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
