export default ( state = '', action ) => {
	switch ( action.type ) {
		case 'REVISIONS_ADD':
			return action.cont;
		case 'QUERY_WIKI_CHANGE':
		case 'QUERY_START_DATE_CHANGE':
		case 'QUERY_END_DATE_CHANGE':
			return '';
		default:
			return state;
	}
};
