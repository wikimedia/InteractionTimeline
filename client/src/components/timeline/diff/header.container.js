import { connect } from 'react-redux';
import { makeGetFromRevision, makeGetToRevision } from 'app/selectors/diff';
import Header from './header';

const getFromRevision = makeGetFromRevision();
const getToRevision = makeGetToRevision();

export default connect(
	( state, ownProps ) => ( {
		from: getFromRevision( state, ownProps ),
		to: getToRevision( state, ownProps )
	} )
)( Header );
