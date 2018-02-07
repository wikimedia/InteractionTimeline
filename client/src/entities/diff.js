import { Record } from 'immutable';
import DiffMeta from './diff-meta';

export default class Diff extends Record( {
	body: undefined,
	fromuser: undefined,
	// fromuserid: undefined,
	touser: undefined,
	// touserid: undefined,
	meta: new DiffMeta()
}, 'Diff' ) {}

// Query

// Edit
// https://test.wikipedia.org/w/api.php?action=compare&fromrev=338496&torelative=prev&formatversion=2

// New Page
// https://test.wikipedia.org/w/api.php?action=compare&fromrev=338495&torelative=prev&formatversion=2
