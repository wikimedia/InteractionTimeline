import {
	useReducer,
	useRef,
	useCallback,
	useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { map } from 'rxjs/operators';
import { Message } from '@wikimedia/react.i18n';
import useReactor from '@cinematix/reactor';
import { Tooltip } from 'reactstrap';
import 'material-design-icons/iconfont/material-icons.css';

const initialState = {
	show: false,
	tooltipOpen: false,
};

function reducer( state, action ) {
	switch ( action.type ) {
		case 'SHOW':
			return {
				...state,
				show: true,
			};
		case 'HIDE':
			return {
				...state,
				show: false,
			};
		case 'TOOLTIP_OPEN':
			return {
				...state,
				tooltipOpen: true,
			};
		case 'TOOLTIP_CLOSE':
			return {
				...state,
				tooltipOpen: false,
			};
		default:
			throw new Error( 'Unknown Action' );
	}
}

function intersectingReactor( input$ ) {
	return input$.pipe(
		map( ( { isIntersecting } ) => ( isIntersecting ? { type: 'HIDE' } : { type: 'SHOW' } ) )
	);
}

function handleClick() {
	/* global window, document */
	// Scroll the user to the top.
	// If the browser suppors smooth scrolling, use that.
	if ( window.scroll ) {
		window.scroll( {
			top: 0,
			behavior: 'smooth',
		} );
	} else {
		document.body.scrollTop = 0;
	}
}

function BackToTopButton( { stickyHeader } ) {
	const [ state, dispatch ] = useReducer( reducer, initialState );

	const container = useRef();
	const button = useRef();

	const showButton = useReactor( intersectingReactor, dispatch );

	const observer = useRef();

	useEffect( () => {
		/* global IntersectionObserver */

		// If the observer already exists, disonnect and reconnect.
		if ( observer.current ) {
			observer.current.disconnect();
		} else {
			observer.current = new IntersectionObserver( ( entries ) => {
				entries.forEach( ( entry ) => {
					showButton.next( entry );
				} );
			} );
		}

		if ( stickyHeader ) {
			observer.current.observe( stickyHeader );
		}

		return () => observer.current.disconnect();
	}, [
		stickyHeader,
		showButton,
	] );

	const showTooltip = useCallback( () => dispatch( { type: 'TOOLTIP_OPEN' } ) );
	const hideTooltip = useCallback( () => dispatch( { type: 'TOOLTIP_CLOSE' } ) );
	const target = useCallback( () => button.current, [ button.current ] );

	const visibility = state.show ? 'visible' : 'invisible';

	const className = [
		'btn',
		'btn-link',
		'back-top',
		'text-muted',
		visibility,
	];

	return (
		<div ref={container}>
			<button type="button" className={className.join( ' ' )} ref={button} onClick={handleClick} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
				<i className="material-icons align-middle">vertical_align_top</i>
				<span className="sr-only"><Message id="back-top" /></span>
			</button>
			<Tooltip placement="bottom" target={target} isOpen={state.tooltipOpen} container={container.current} autohide={false}>
				<Message id="back-top" />
			</Tooltip>
		</div>
	);
}

BackToTopButton.propTypes = {
	// This will be an Element object or undefined,
	// but Element does not exist on the server/at build.
	stickyHeader: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

BackToTopButton.defaultProps = {
	stickyHeader: undefined,
};

export default BackToTopButton;
