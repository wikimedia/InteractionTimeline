import { combineEpics } from 'redux-observable';
import { pushQueryToLocation, pushLocationToQuery, setDefaultQuery } from './query';
import { fetchAllWikis, fetchWikiNamespaces } from './wiki';
import {
	shouldFetchRevisions,
	revisionsReady,
	fetchRevision,
	doFetchRevisions
} from './revisions';
import { fetchDiff } from './diff';

export default combineEpics(
	pushQueryToLocation,
	pushLocationToQuery,
	fetchAllWikis,
	fetchWikiNamespaces,
	shouldFetchRevisions,
	revisionsReady,
	fetchRevision,
	doFetchRevisions,
	fetchDiff,
	setDefaultQuery
);
