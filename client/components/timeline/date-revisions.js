import { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { map, filter, debounceTime } from 'rxjs/operators';
import useIntersection from '../../hooks/intersection';
// import DateListContainer from './date-list.container';

function DateRevisions( { status, empty, fetchList }) {
	const bottom = useRef();

	const invokeFetch = useCallback(() => {
		// The debounce delays the emissions so the props may not be the same.
		if ( status !== 'ready' ) {
			return;
		}

		if ( empty ) {
			return;
		}

		return fetchList();
	}, [
		status,
		empty,
		fetchList,
	]);

	useIntersection(
		value$ => (
			value$.pipe(
				map( entry => entry.isIntersecting ),
				filter( isBottomVisable => isBottomVisable ),
				filter( () => status === 'ready' ),
				filter( () => !empty ),
				debounceTime( 250 )
			)
		),
		invokeFetch,
		bottom.current,
		{
			rootMargin: '0px 0px 20% 0px'
		}
	);

	return (
		<div className="row date-revisions">
			<div className="col ml-3 mr-3 pt-3">
				{/* <DateListContainer /> */}
				<div ref={bottom} />
			</div>
		</div>
	);
}

DateRevisions.propTypes = {
	empty: PropTypes.bool.isRequired,
	status: PropTypes.oneOf( [ 'notready', 'nousers', 'nowiki', 'ready', 'fetching', 'done', 'error' ] ).isRequired,
	fetchList: PropTypes.func.isRequired
};

export default DateRevisions;
