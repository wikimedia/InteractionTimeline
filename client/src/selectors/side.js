import { createSelector } from 'reselect';
import userSide from 'app/utils/user-side';

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
		( users, user ) => userSide( user, users )
	)
);

export default makeGetSide;
