export function setWikis( wikis ) {
	return {
		type: 'WIKIS_SET',
		wikis
	};
}

export function fetchWikiList() {
	return {
		type: 'WIKI_LIST_FETCH'
	};
}
