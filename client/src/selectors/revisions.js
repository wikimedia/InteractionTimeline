import { createSelector } from 'reselect';
import moment from 'moment';
import getRevisionList from 'app/utils/revisions';
import { getLastRevision } from './last-revision';
import { getWiki } from './wiki';

export const getRevisions = createSelector(
	state => state.query.user,
	state => state.revisions.list,
	getLastRevision,
	state => state.pages,
	( users, revisions, last, pages ) => {
		return getRevisionList( users, revisions, last, pages );
	}
);

export const makeGetTimestamp = () => (
	createSelector(
		( _, props ) => {
			if ( !props.revision ) {
				return;
			}

			return props.revision.timestamp;
		},
		( timestamp ) => {
			if ( !timestamp ) {
				return;
			}

			return moment( timestamp, moment.ISO_8601 ).utc();
		}
	)
);

export const makeGetRevisionUrl = () => (
	createSelector(
		state => getWiki( state ),
		( _, props ) => {
			if ( props.revision ) {
				return props.revision.id;
			}

			return;
		},
		( _, props ) => {
			if ( props.revision ) {
				return props.revision.title;
			}

			return;
		},
		( wiki, id, title ) => {
			if ( !wiki || !id || !title ) {
				return;
			}

			return `https://${wiki.domain}/wiki/${title.replace( / /g, '_' )}?oldid=${id}`;
		}
	)
);

export default getRevisions;
