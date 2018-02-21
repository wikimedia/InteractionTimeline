import { connect } from 'react-redux';
import { fetchWikiList } from 'app/actions/wiki';
import { getWikiOptions } from 'app/selectors/wiki';
import { wikiChange } from 'app/actions/query';
import SelectWiki from './select-wiki';

export default connect(
	state => ( {
		isLoading: !state.wikis.size,
		value: state.query.wiki,
		options: getWikiOptions( state )
	} ),
	dispatch => ( {
		onChange: value => dispatch( wikiChange( value ? value.value : undefined ) ),
		fetchOptions: () => dispatch( fetchWikiList() )
	} ),
)( SelectWiki );
