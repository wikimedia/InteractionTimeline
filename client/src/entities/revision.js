import { Record } from 'immutable';

export default class Revision extends Record( {
	id: undefined,
	pageid: undefined,
	title: undefined,
	user: undefined,
	timestamp: undefined,
	minor: false,
	sizediff: 0,
	comment: undefined,
	commenthidden: false
}, 'Revision' ) {}
