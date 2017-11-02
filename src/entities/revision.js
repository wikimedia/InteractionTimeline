import { Record } from 'immutable';

export default class Revision extends Record( {
	id: undefined,
	title: undefined,
	user: undefined,
	timestamp: undefined,
	comment: undefined
}, 'Revision' ) {}
