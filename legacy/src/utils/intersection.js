import { Subject } from 'rxjs';
/* global IntersectionObserver */

const createIntersectionObservable = ( element, options ) => {
	const subject = new Subject();

	const callback = ( entries ) => {
		entries.forEach( entry => {
			subject.next( entry );
		} );
	};

	const observer = new IntersectionObserver( callback, options );

	observer.observe( element );

	return subject;
};

export default createIntersectionObservable;
