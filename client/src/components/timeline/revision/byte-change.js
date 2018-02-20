import React from 'react';
import PropTypes from 'prop-types';

const ByteChange = ( { sizediff, minor } ) => {
	let size = '(' + ( sizediff > 0 ? '+' : '' ) + sizediff + ')';

	if ( sizediff > 500 ) {
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
	sizediff: PropTypes.number.isRequired,
	minor: PropTypes.bool.isRequired
};

export default ByteChange;
