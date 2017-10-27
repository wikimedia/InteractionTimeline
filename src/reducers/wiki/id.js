export default ( state = '', action ) => {
	switch ( action.type ) {
		case 'WIKI_SET':
			return action.wiki;

		default:
			return state;
	}
};
