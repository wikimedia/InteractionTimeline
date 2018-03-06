export function setWikis( wikis ) {
	return {
		type: 'WIKIS_SET',
		wikis
	};
}

export function setWikiNamespaces( id, namespaces ) {
	return {
		type: 'WIKIS_SET_NAMESPACES',
		id,
		namespaces
	};
}

export function fetchWikiList() {
	return {
		type: 'WIKI_LIST_FETCH'
	};
}
