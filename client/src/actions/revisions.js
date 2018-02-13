import { Map } from 'immutable';

export function fetchRevisions( users ) {
	return {
		type: 'REVISIONS_FETCH',
		users
	};
}

export function fetchRevision( id ) {
	return {
		type: 'REVISIONS_SINGLE_FETCH',
		id
	};
}

export function setRevisionStatus( id, status ) {
	return {
		type: 'REVISIONS_SINGLE_STATUS_SET',
		id,
		status
	};
}

export function addRevision( revision ) {
	return {
		type: 'REVISIONS_SINGLE_ADD',
		// We only use the array syntax or the id will be converted to a string.
		revisions: new Map( [
			[
				revision.id,
				revision
			]
		] )
	};
}

export function setStatusReady() {
	return {
		type: 'REVISIONS_READY'
	};
}

export function setStatusNotReady() {
	return {
		type: 'REVISIONS_NOT_READY'
	};
}

export function setStatusDone() {
	return {
		type: 'REVISIONS_DONE'
	};
}

export function addRevisions( revisions, pages = new Map(), cont = new Map() ) {
	return {
		type: 'REVISIONS_ADD',
		revisions,
		pages,
		cont
	};
}

export function throwError( error ) {
	return {
		type: 'REVISIONS_ERROR',
		error
	};
}

export function throwRevisionError( id, error ) {
	return {
		type: 'REVISIONS_SINGLE_ERROR',
		id,
		error
	};
}

export function throwDiffError( id, error ) {
	return {
		type: 'REVISIONS_DIFF_ERROR',
		id,
		error
	};
}

export function clearError() {
	return {
		type: 'REVISIONS_ERROR_CLEAR'
	};
}

export function setDiff( id, diff ) {
	return {
		type: 'REVISIONS_DIFF_SET',
		id,
		diff
	};
}

export function setDiffShow( id, diff, show ) {
	return {
		type: 'REVISIONS_DIFF_SHOW_SET',
		id,
		show,
		status: diff.meta.status
	};
}

export function toggleDiff( revision ) {
	return setDiffShow( revision.id, revision.meta.diff, !revision.meta.diff.meta.show );
}

export function setDiffStatus( id, status ) {
	return {
		type: 'REVISIONS_DIFF_STATUS_SET',
		id,
		status
	};
}
