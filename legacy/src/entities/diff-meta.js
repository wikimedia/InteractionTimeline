import { Record } from 'immutable';

export default class DiffMeta extends Record( {
	show: false,
	status: 'ready',
	error: undefined
}, 'DiffMeta' ) {}
