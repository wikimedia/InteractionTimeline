import { combineEpics } from 'redux-observable';
import { pushQueryToLocation, pushLocationToQuery } from './query';
import { fetchAllWikis, fetchWikiNamespaces } from './wiki';
import {
	shouldFetchRevisions,
	revisionsReady,
	revisionStatus,
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
	revisionStatus,
	fetchRevision,
	doFetchRevisions,
	fetchDiff
);
