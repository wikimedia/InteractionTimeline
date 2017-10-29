export function setWiki( wiki ) {
	return {
		type: 'WIKI_SET',
		wiki
	};
}

export function setWikiList( wikis ) {
	return {
		type: 'WIKI_LIST_SET',
		wikis
	};
}

export function fetchWikiList() {
	return {
		type: 'WIKI_LIST_FETCH'
	};
}

export function resetWiki() {
	return {
		type: 'WIKI_RESET'
	};
}
