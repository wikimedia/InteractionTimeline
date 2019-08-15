import { createSelector } from 'reselect';
import qs from 'querystring';
import getUsers from './users';
import { getStartDate, getEndDate } from './date';

const getEditorInteractUrl = createSelector(
	( state ) => state.query.wiki,
	getUsers,
	getStartDate,
	getEndDate,
	( server, users, start, end ) => {
		const data = {
			server,
			users
		};

		if ( start ) {
			data.startDate = start.format( 'YYYYMMDD' );
		}

		if ( end ) {
			data.endDate = end.format( 'YYYYMMDD' );
		}

		return 'https://tools.wmflabs.org/sigma/editorinteract.py?' + qs.stringify( data );
	}
);

export default getEditorInteractUrl;
