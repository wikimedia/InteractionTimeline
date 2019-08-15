import PropTypes from 'prop-types';
import REGEX_EDIT_SUMMARY_PARTS from './edit-summary-parts';

const Title = ( { title, comment } ) => {
	if ( !comment ) {
		return title;
	}

	const matches = comment.match( REGEX_EDIT_SUMMARY_PARTS );

	if ( matches[ 1 ] ) {
		return title + ' § ' + matches[ 1 ].trim();
	}

	return title;
};

Title.propTypes = {
	title: PropTypes.string.isRequired,
	comment: PropTypes.string
};

Title.defaultProps = {
	comment: undefined
};

export default Title;
