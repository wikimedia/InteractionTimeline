import { Map } from 'immutable';

export function fetchRevisions( users ) {
	return {
		type: 'REVISIONS_FETCH',
		users
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

export function addRevisions( revisions, pages = new Map() ) {
	return {
		type: 'REVISIONS_ADD',
		revisions,
		pages
	};
}

export function deleteRevisions( revisions ) {
	return {
		type: 'REVISIONS_DELETE',
		revisions
	};
}

export function setRevisionsContinue( user, cont ) {
	return {
		type: 'REVISIONS_CONTINUE_SET',
		user,
		cont
	};
}

export function deleteRevisionsContinue( user ) {
	return {
		type: 'REVISIONS_CONTINUE_DELETE',
		user
	};
}
