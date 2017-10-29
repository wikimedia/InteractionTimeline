import { connect } from 'react-redux';
import * as WikiActions from 'app/actions/wiki';
import * as WikiSelectors from 'app/selectors/wiki';
import SelectWiki from './select-wiki';

export default connect(
	state => ( {
		value: state.wiki.id,
		options: WikiSelectors.getWikiOptions( state )
	} ),
	dispatch => ( {
		onChange: value => dispatch( WikiActions.setWiki( value ? value.value : '' ) ),
		fetchOptions: () => dispatch( WikiActions.fetchWikiList() )
	} ),
)( SelectWiki );
