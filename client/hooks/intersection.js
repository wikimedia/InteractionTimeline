import { useEffect } from 'react';
import useReactor from '@cinematix/reactor';

function useIntersection( reaction, dispatch, element, options ) {
	const subject = useReactor( reaction, dispatch );
	const observer = useRef();

	if (!observer.current) {
		observer.current = new IntersectionObserver( ( entries ) => {
			entries.forEach( entry => {
				subject.next( entry );
			} );
		}, options );
	}

	useEffect(() => {
		observer.current.observe( element );

		return () => observer.current.unobserve( element );
	}, [element]);

	return subject;
}

export default useIntersection;
