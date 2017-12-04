export function updatePages( pages ) {
	return {
		type: 'PAGES_UPDATE',
		pages
	};
}

export function removePages( pages ) {
	return {
		type: 'PAGES_DELETE',
		pages
	};
}
