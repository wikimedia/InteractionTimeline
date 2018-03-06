import React from 'react';
import PropTypes from 'prop-types';

const Link = ( props ) => {
	const Tag = props.href ? 'a' : 'span';

	return (
		<Tag {...props} />
	);
};

Link.propTypes = {
	href: PropTypes.string
};

Link.defaultProps = {
	href: undefined
};

export default Link;
