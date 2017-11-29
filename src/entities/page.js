import { Record, Map } from 'immutable';

export default class Page extends Record( {
	id: undefined,
	title: undefined,
	editors: new Map()
}, 'Page' ) {}
