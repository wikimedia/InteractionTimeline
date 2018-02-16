export function throwDiffError( id, error ) {
	return {
		type: 'REVISIONS_DIFF_ERROR',
		id,
		error
	};
}

export function setDiff( id, diff ) {
	return {
		type: 'REVISIONS_DIFF_SET',
		id,
		diff
	};
}

export function setDiffShow( revision, show ) {
	return {
		type: 'REVISIONS_DIFF_SHOW_SET',
		revision,
		show
	};
}

export function toggleDiff( revision ) {
	return setDiffShow( revision, !revision.meta.diff.meta.show );
}

export function setDiffStatus( id, status ) {
	return {
		type: 'REVISIONS_DIFF_STATUS_SET',
		id,
		status
	};
}
