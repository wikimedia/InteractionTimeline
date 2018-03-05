import { createSelector } from 'reselect';
import { getWiki } from './wiki';

export const makeGetTitle = () => (
	createSelector(
		state => getWiki( state ),
		( _, props ) => {
			if ( props.revision ) {
				return props.revision.title;
			}

			return;
		},
		( _, props ) => {
			if ( props.revision ) {
				return props.revision.pageNamespace;
			}

			return;
		},
		( wiki, title, namespace ) => {
			if ( !title ) {
				return '';
			}

			if ( typeof namespace === 'undefined' ) {
				return title;
			}

			if ( namespace === 0 ) {
				return title;
			}

			if ( !wiki.namespaces.has( namespace ) ) {
				return title;
			}

			const name = wiki.namespaces.get( namespace ).name;

			return `${name}:${title}`;
		}
	)
);

export const makeGetRevisionUrl = () => {
	const getTitle = makeGetTitle();

	return createSelector(
		getWiki,
		getTitle,
		( _, props ) => {
			if ( props.revision ) {
				return props.revision.id;
			}

			return;
		},
		( wiki, title, id ) => {
			if ( !wiki || !id || !title ) {
				return;
			}

			return `https://${wiki.domain}/wiki/${title.replace( / /g, '_' )}?oldid=${id}`;
		}
	);
};

export const getTimelineRevisions = createSelector(
	state => state.revisions.list,
	( revisions ) => (
		revisions
			.filter( revision => revision.meta.interaction )
			.groupBy( revision => revision.timestamp.clone().startOf( 'day' ) )
	)
);
