import { Record, Map } from 'immutable';

export default class Wiki extends Record( {
	id: undefined,
	domain: undefined,
	namespaces: new Map()
}, 'Wiki' ) {}
