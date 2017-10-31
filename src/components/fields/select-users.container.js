import { connect } from 'react-redux';
import { Set } from 'immutable';
import * as QueryActions from 'app/actions/query';
import getUsers from 'app/selectors/users';
import SelectUsers from './select-users';

export default connect(
	state => ( {
		value: getUsers( state )
	} ),
	dispatch => ( {
		onChange: value => dispatch( QueryActions.setQueryValue( 'user', new Set( value ) ) )
	} ),
)( SelectUsers );
