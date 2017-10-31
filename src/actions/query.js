export function updateQuery( query ) {
	return {
		type: 'QUERY_UPDATE',
		query
	};
}

export function setQueryValue( key, value ) {
	return {
		type: 'QUERY_SET_VALUE',
		key,
		value
	};
}
