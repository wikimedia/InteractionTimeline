import { Record } from 'immutable';
import Diff from './diff';

export default class RevisionMeta extends Record( {
	diff: new Diff()
}, 'RevisionMeta' ) {}
