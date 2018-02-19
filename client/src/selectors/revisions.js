import { createSelector } from 'reselect';
import getRevisionList from 'app/utils/revisions';
import { getLastRevision } from './last-revision';

export const getRevisions = createSelector(
	state => state.query.user,
	state => state.revisions.list,
	getLastRevision,
	state => state.pages,
	getRevisionList
);

export default getRevisions;
