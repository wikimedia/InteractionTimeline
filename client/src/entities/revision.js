import { Record } from 'immutable';
import RevisionMeta from './revision-meta';

export default class Revision extends Record( {
	id: undefined,
	pageid: undefined,
	title: undefined,
	user: undefined,
	timestamp: undefined,
	comment: undefined,
	commenthidden: false,
	meta: new RevisionMeta()
}, 'Revision' ) {}
