import { connect } from 'react-redux';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import * as WikiActions from 'app/actions/wiki';

export default connect(
	state => ( {
		value: state.wiki.id,
		options: [
			{
				label: state.wiki.id,
				value: state.wiki.id
			}
		]
	} ),
	dispatch => ( {
		onChange: value => dispatch( WikiActions.setWiki( value ) )
	} ),
)( Select );
