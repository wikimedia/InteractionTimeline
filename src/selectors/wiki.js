import { createSelector } from 'reselect';
import { Map } from 'immutable';

export const getWikiOptions = createSelector(
	state => state.wikis,
	( wikis = new Map() ) => {
		return wikis.map( ( wiki ) => ( {
			value: wiki.id,
			label: `${wiki.domain}`
		} ) ).toArray();
	}
);

export const getWiki = createSelector(
	state => state.wikis,
	state => state.query.wiki,
	( wikis = new Map(), id = '' ) => wikis.get( id )
);
