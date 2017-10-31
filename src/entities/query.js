import { Set, Record } from 'immutable';

export default class Query extends Record( {
	wiki: undefined,
	user: new Set(),
	startDate: undefined,
	endDate: undefined
}, 'Query' ) {}
