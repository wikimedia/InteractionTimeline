import React from 'react';
import PropTypes from 'prop-types';
import Wiki from 'app/entities/wiki';
import Link from 'app/components/link';
import 'material-design-icons/iconfont/material-icons.css';
import Header from './header';

const User = ( { user, side, wiki } ) => {
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
			<Link href={href}>
				<i className="mr-2 material-icons">person</i>
			</Link>
			<span>{user}</span>
		</Header>
	);
};

User.propTypes = {
	user: PropTypes.string,
	side: PropTypes.string,
	wiki: PropTypes.instanceOf( Wiki )
};

User.defaultProps = {
	user: undefined,
	side: undefined,
	wiki: undefined
};

export default User;
