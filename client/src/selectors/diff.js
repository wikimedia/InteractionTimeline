import { createSelector } from 'reselect';
import Revision from 'app/entities/revision';

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
