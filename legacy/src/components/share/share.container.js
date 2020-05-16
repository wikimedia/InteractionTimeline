import { connect } from 'react-redux';
import { getStartDate, getEndDate } from 'app/selectors/date.js';
import getUsers from 'app/selectors/users.js';
import getEditorInteractUrl from 'app/selectors/editorinteract';
import { getWiki } from 'app/selectors/wiki.js';
import Share from './share';

export default connect(
	state => ( {
		empty: state.revisions.list.isEmpty(),
		queryString: state.router.location.search,
		startDate: getStartDate( state ),
		endDate: getEndDate( state ),
		users: getUsers( state ),
		wiki: getWiki( state ),
		editorInteractUrl: getEditorInteractUrl( state )
	} )
)( Share );
