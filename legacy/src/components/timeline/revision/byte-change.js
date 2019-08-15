import React from 'react';
import PropTypes from 'prop-types';

const ByteChange = ( { sizeDiff, minor } ) => {
	let size = '(' + ( sizeDiff > 0 ? '+' : '' ) + sizeDiff + ')';

	if ( sizeDiff > 500 || sizeDiff < -500 ) {
		size = <strong>{size}</strong>;
	}

	let displayMinor;

	if ( minor ) {
		displayMinor = <strong>m</strong>;
	}

	return (
		<small>{displayMinor} {size}</small>
	);
};

ByteChange.propTypes = {
	sizeDiff: PropTypes.number.isRequired,
	minor: PropTypes.bool.isRequired
};

export default ByteChange;
