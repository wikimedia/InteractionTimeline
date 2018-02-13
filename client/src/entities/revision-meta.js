import { Record } from 'immutable';
import Diff from './diff';

export default class RevisionMeta extends Record( {
	status: 'done',
	error: undefined,
	diff: new Diff()
}, 'RevisionMeta' ) {
	constructor( data = {} ) {
		data = {
			...data,
			diff: new Diff( data.diff )
		};

		super( data );
	}
}
