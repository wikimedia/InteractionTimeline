export default ( state = [], action ) => {
	switch ( action.type ) {
		case 'WIKI_LIST_SET':
			return action.wikis;

		default:
			return state;
	}
};
