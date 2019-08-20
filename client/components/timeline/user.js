import React from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import 'material-design-icons/iconfont/material-icons.css';

function User( { user, side, wiki } ) {
	if ( !user ) {
		return (
			<Header />
		);
	}

	let href;
	if ( wiki ) {
		href = `https://${wiki.domain}/wiki/User:${user.replace( / /g, '_' )}`;
	}

	return (
		<Header href={href} className="rounded" side={side}>
			<i className="mr-2 material-icons">person</i>
			<span>{user}</span>
		</Header>
	);
}

User.propTypes = {
	user: PropTypes.string,
	side: PropTypes.string,
	wiki: PropTypes.shape( {
		domain: PropTypes.string,
	} ),
};

User.defaultProps = {
	user: undefined,
	side: undefined,
	wiki: undefined,
};

export default User;
