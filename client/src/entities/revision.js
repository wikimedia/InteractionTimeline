import { Record } from 'immutable';
import RevisionMeta from './revision-meta';

export default class Revision extends Record( {
	id: undefined,
	pageId: undefined,
	title: undefined,
	user: undefined,
	timestamp: undefined,
	minor: false,
	sizeDiff: 0,
	comment: undefined,
	commentHidden: false,
	suppressed: false,
	meta: new RevisionMeta()
}, 'Revision' ) {
	constructor( data = {} ) {
		data = {
			...data,
			meta: new RevisionMeta( data.meta )
		};

		super( data );
	}
}
