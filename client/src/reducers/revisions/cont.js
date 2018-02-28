export default ( state = '', action ) => {
	switch ( action.type ) {
		case 'REVISIONS_ADD':
		case 'REVISIONS_CONTINUE_SET':
			return action.cont;
		case 'QUERY_WIKI_CHANGE':
		case 'QUERY_START_DATE_CHANGE':
		case 'QUERY_END_DATE_CHANGE':
		case 'REVISIONS_CONTINUE_DELETE':
			return '';
		default:
			return state;
	}
};
