export function throwDiffError( diff, error ) {
	return {
		type: 'DIFFS_THROW_ERROR',
		diff,
		error
	};
}

export function setDiff( diff ) {
	return {
		type: 'DIFFS_SET',
		diff
	};
}

export function setDiffShow( diff, show, suppressed = false ) {
	return {
		type: 'DIFFS_SHOW_SET',
		diff,
		show,
		suppressed
	};
}

export function toggleDiff( diff, suppressed = false ) {
	return setDiffShow( diff, !diff.meta.show, suppressed );
}

export function setDiffStatus( diff, status ) {
	return {
		type: 'DIFFS_STATUS_SET',
		diff,
		status
	};
}
