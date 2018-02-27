import { Record } from 'immutable';
import DiffMeta from './diff-meta';

export default class Diff extends Record( {
	body: undefined,
	fromuser: undefined,
	fromrevid: undefined,
	touser: undefined,
	torevid: undefined,
	meta: new DiffMeta()
}, 'Diff' ) {
	constructor( data = {} ) {
		data = {
			...data,
			meta: new DiffMeta( data.meta )
		};

		super( data );
	}
}
