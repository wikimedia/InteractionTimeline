export const EVENTS = [
	'QUERY_UPDATE',
	'QUERY_USER_CHANGE',
	'QUERY_WIKI_CHANGE',
	'QUERY_START_DATE_CHANGE',
	'QUERY_END_DATE_CHANGE'
];

// Setting the default query is not a Query event that should be listened to.
export function setDefaultQuery( query ) {
	return {
		type: 'QUERY_SET_DEFAULT',
		query
	};
}

export function updateQuery( query ) {
	return {
		type: 'QUERY_UPDATE',
		query
	};
}

export function userChange( users ) {
	return {
		type: 'QUERY_USER_CHANGE',
		users
	};
}

export function wikiChange( wiki ) {
	return {
		type: 'QUERY_WIKI_CHANGE',
		wiki
	};
}

export function startDateChange( startDate ) {
	return {
		type: 'QUERY_START_DATE_CHANGE',
		startDate
	};
}

export function endDateChange( endDate ) {
	return {
		type: 'QUERY_END_DATE_CHANGE',
		endDate
	};
}
