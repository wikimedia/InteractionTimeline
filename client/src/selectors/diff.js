import { createSelector } from 'reselect';
import Revision from 'app/entities/revision';
import { getWiki } from './wiki';

const getRevision = ( revisions, id ) => {
	if ( !id ) {
		return;
	}

	return revisions.get( id, new Revision( {
		id,
		meta: {
			status: 'ready'
		}
	} ) );
};

export const makeGetFromRevision = () => (
	createSelector(
		state => state.revisions.list,
		( _, props ) => props.diff.fromrevid,
		getRevision
	)
);

export const makeGetToRevision = () => (
	createSelector(
		state => state.revisions.list,
		( _, props ) => props.diff.torevid,
		getRevision
	)
);

export const makeGetDiff = () => (
	createSelector(
		state => state.diffs,
		( _, props ) => props.revision,
		( diffs, revision ) => (
			diffs.get( revision.id )
		)
	)
);

export const makeGetDiffUrl = () => (
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

			return `https://${wiki.domain}/wiki/${title.replace( / /g, '_' )}?diff=prev&oldid=${id}`;
		}
	)
);
