import React from 'react';
import PropTypes from 'prop-types';
import { Subject, Observable } from 'rxjs';
import createIntersectionObservable from 'app/utils/intersection';
import DateListContainer from './date-list.container';

class DateRevisions extends React.Component {
	constructor( props ) {
		super( props );

		this.invokeFetch = new Subject();
		this.isBottomVisable = false;
	}

	componentDidMount() {

		const options = {
			rootMargin: '0px 0px 20% 0px'
		};

		const intersection = createIntersectionObservable( this.bottom, options )
			.map( entry => entry.isIntersecting );

		// Set a property for use when the component is updated.
		intersection.subscribe( isBottomVisable => {
			this.isBottomVisable = isBottomVisable;
		} );

		// Create the infinite scroll.
		this.infinite = Observable.merge(
			intersection,
			this.invokeFetch
		)
			.filter( isBottomVisable => isBottomVisable )
			.filter( () => this.props.status === 'ready' )
			.filter( () => !this.props.empty )
			.debounceTime( 250 )
			.subscribe( () => {
				// The debounce delays the immisions so the props may not be the same.
				if ( this.props.status !== 'ready' ) {
					return;
				}

				if ( this.props.empty ) {
					return;
				}

				return this.props.fetchList();
			} );
	}

	componentDidUpdate() {
		// Attemt to get more revisions if necessary.
		this.invokeFetch.next( this.isBottomVisable );
	}

	componentWillUnmount() {
		this.infinite.unsubscribe();
	}

	render() {
		return (
			<div className="row date-revisions">
				<div className="col ml-3 mr-3 pt-3">
					<DateListContainer />
					<div ref={( element ) => { this.bottom = element; }} />
				</div>
			</div>
		);
	}
}

DateRevisions.propTypes = {
	empty: PropTypes.bool.isRequired,
	status: PropTypes.oneOf( [ 'notready', 'ready', 'fetching', 'done', 'error' ] ).isRequired,
	fetchList: PropTypes.func.isRequired
};

export default DateRevisions;
