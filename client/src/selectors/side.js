import { createSelector } from 'reselect';

const makeGetSide = () => (
	createSelector(
		state => state.query.user,
		( _, props ) => {
			if ( props.user ) {
				return props.user;
			}

			if ( props.revision ) {
				return props.revision.user;
			}
		},
		( users, user ) => {
			let side;

			if ( user === users.first() ) {
				side = 'left';
			} else if ( user === users.last() ) {
				side = 'right';
			}

			return side;
		}
	)
);

export default makeGetSide;
