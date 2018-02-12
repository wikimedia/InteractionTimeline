import { connect } from 'react-redux';
import { makeGetFromRevision, makeGetToRevision } from 'app/selectors/diff';
import Header from './header';

const getFromRevision = makeGetFromRevision();
const getToRevision = makeGetToRevision();

export default connect(
	( state, props ) => ( {
		from: getFromRevision( state, props ),
		to: getToRevision( state, props )
	} )
)( Header );
