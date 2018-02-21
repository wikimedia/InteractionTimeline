import React from 'react';
import PropTypes from 'prop-types';
import Wiki from 'app/entities/wiki';
import Header from './header';

const User = ( { user, side, wiki } ) => {
	if ( !user ) {
		return (
			<Header />
		);
	}

	return (
		<Header href={`https://${wiki.domain}/wiki/User:${user.replace( / /g, '_' )}`} className="rounded" side={side}>
			<i className="mr-2 material-icons">person</i>
			<span>{user}</span>
		</Header>
	);
};

User.propTypes = {
	user: PropTypes.string,
	side: PropTypes.string,
	wiki: PropTypes.instanceOf( Wiki ).isRequired
};

User.defaultProps = {
	user: undefined,
	side: undefined
};

export default User;
