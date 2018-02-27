import React from 'react';
import PropTypes from 'prop-types';
import { Set, Map } from 'immutable';
import { Subject, Observable } from 'rxjs';
import createIntersectionObservable from 'app/utils/intersection';
import DateList from './date-list';

class DateRevisions extends React.Component {
	constructor( props ) {
		super( props );

		this.invokeFetch = new Subject();
		this.isBottomVisable = false;
	}

	componentDidMount() {
		const badStatus = [
			'done',
			'notready'
		];

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
			.filter( () => !badStatus.includes( this.props.status ) )
			.filter( () => !this.props.revisions.isEmpty() )
			.debounceTime( 250 )
			.subscribe( () => {
				// The debounce delays the immisions so the props may not be the same.
				if ( badStatus.includes( this.props.status ) ) {
					return;
				}

				if ( this.props.revisions.isEmpty() ) {
					return;
				}

				return this.props.fetchList( new Set( [ this.props.revisions.last().user ] ) );
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
					<DateList revisions={this.props.revisions} />
					<div ref={( element ) => { this.bottom = element; }} />
				</div>
			</div>
		);
	}
}

DateRevisions.propTypes = {
	revisions: PropTypes.instanceOf( Map ).isRequired,
	status: PropTypes.oneOf( [ 'notready', 'ready', 'fetching', 'done', 'error' ] ).isRequired,
	fetchList: PropTypes.func.isRequired
};

export default DateRevisions;
