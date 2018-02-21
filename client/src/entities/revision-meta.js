import { Record } from 'immutable';

export default class RevisionMeta extends Record( {
	status: 'done',
	error: undefined
}, 'RevisionMeta' ) {}
