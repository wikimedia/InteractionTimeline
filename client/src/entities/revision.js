import { Record } from 'immutable';
import moment from 'moment';
import RevisionMeta from './revision-meta';

export default class Revision extends Record( {
	id: undefined,
	pageId: undefined,
	pageNamespace: undefined,
	title: undefined,
	user: undefined,
	timestamp: moment(),
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
