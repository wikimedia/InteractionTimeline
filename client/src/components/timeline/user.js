import React from 'react';
import PropTypes from 'prop-types';
import Wiki from 'app/entities/wiki';

const User = ( { user, side, wiki } ) => {
	if ( !user ) {
		return (
			<div className="col-6 d-block" />
		);
	}

	let className = [
		'user',
		'rounded',
		'col-6',
		'border',
		'pt-2',
		'pb-2',
		'd-block'
	];

	if ( side ) {
		className = [
			...className,
			side
		];
	}

	return (
		<a href={`https://${wiki.domain}/wiki/User:${user.replace( / /g, '_' )}`} className={className.join( ' ' )}>
			<div className="d-flex justify-content-center align-items-center">
				<i className="mr-2 material-icons">person</i>
				<span>{user}</span>
			</div>
		</a>
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
