import { createSelector } from 'reselect';
import { getWiki } from './wiki';

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

export default makeGetRevisionUrl;
