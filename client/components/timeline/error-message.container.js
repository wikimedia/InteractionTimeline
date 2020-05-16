import { useContext, useCallback } from 'react';
import ErrorMessage from './error-message';
import ReducerContext from '../../context/reducer';

function ErrorMessageContainer() {
	const [ state, dispatch ] = useContext( ReducerContext );

	const clearError = useCallback( () => dispatch( { type: 'ERROR_CLEAR' } ) );

	return (
		<ErrorMessage
			error={state.error}
			clearError={clearError}
		/>
	);
}

export default ErrorMessageContainer;
