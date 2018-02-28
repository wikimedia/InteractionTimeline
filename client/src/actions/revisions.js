import { Map } from 'immutable';

export function fetchRevisions() {
	return {
		type: 'REVISIONS_FETCH'
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

export function setStatusFetching() {
	return {
		type: 'REVISIONS_FETCHING'
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

export function addRevisions( revisions, cont = '' ) {
	return {
		type: 'REVISIONS_ADD',
		revisions,
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

export function clearError() {
	return {
		type: 'REVISIONS_ERROR_CLEAR'
	};
}
