import { Record } from 'immutable';
import RevisionMeta from './revision-meta';

export default class Revision extends Record( {
	id: undefined,
	pageid: undefined,
	title: undefined,
	user: undefined,
	timestamp: undefined,
	minor: false,
	sizediff: 0,
	comment: undefined,
	commenthidden: false,
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
