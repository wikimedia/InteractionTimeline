import { connect } from 'react-redux';
import * as WikiActions from 'app/actions/wiki';
import * as WikiSelectors from 'app/selectors/wiki';
import * as QueryActions from 'app/actions/query';
import SelectWiki from './select-wiki';

export default connect(
	state => ( {
		isLoading: !state.wikis.size,
		value: state.query.wiki,
		options: WikiSelectors.getWikiOptions( state )
	} ),
	dispatch => ( {
		onChange: value => dispatch( QueryActions.setQueryValue( 'wiki', value ? value.value : null ) ),
		fetchOptions: () => dispatch( WikiActions.fetchWikiList() )
	} ),
)( SelectWiki );
