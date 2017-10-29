import { createSelector } from 'reselect';
import { Map } from 'immutable';

export const getWikiOptions = createSelector(
	state => state.wiki.list,
	( wikis = new Map() ) => {
		return wikis.map( ( wiki ) => ( {
			value: wiki.id,
			label: `${wiki.name} (${wiki.domain})`
		} ) ).toArray();
	}
);

export const getWiki = createSelector(
	state => state.wiki.list,
	state => state.wiki.id,
	( wikis = new Map(), id = '' ) => wikis.get( id )
);
