export function setWiki( wiki ) {
	return {
		type: 'WIKI_SET',
		wiki
	};
}

export function resetWiki() {
	return {
		type: 'WIKI_RESET'
	};
}
