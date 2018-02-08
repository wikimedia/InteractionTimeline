export default ( user, users ) => {
	let side;

	if ( user === users.first() ) {
		side = 'left';
	} else if ( user === users.last() ) {
		side = 'right';
	}

	return side;
};
