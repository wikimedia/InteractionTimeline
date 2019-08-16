import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Message } from '@wikimedia/react.i18n';

function SelectWiki( props ) {
	const { wikis, onChange, value } = props;

	const options = useMemo( () => (
		wikis.map( ( wiki ) => ( {
			value: wiki.id,
			label: wiki.domain,
		} ) )
	), [ wikis ] );

	const selectValue = useMemo( () => (
		options.find( ( option ) => option.value === value ) || { label: value, value }
	), [ value, options ] );

	const onValueChange = useCallback(
		( { value: newValue } ) => onChange( newValue ),
		[ onChange ],
	);

	return (
		<Select
			{...props} // eslint-disable-line react/jsx-props-no-spreading
			placeholder={<Message id="field-select-placeholder" />}
			noResultsText={<Message id="field-select-no-results" />}
			searchPromptText={<Message id="field-select-search-prompt" />}
			value={selectValue}
			onChange={onValueChange}
			options={options}
			matchPos="start"
			matchProp="label"
		/>
	);
};

SelectWiki.propTypes = {
	onChange: PropTypes.func.isRequired,
	wikis: PropTypes.arrayOf( PropTypes.shape( {
		id: PropTypes.string.isRequired,
		domain: PropTypes.string.isRequired,
	} ) ),
	value: PropTypes.string,
};

SelectWiki.defaultProps = {
	wikis: [],
	value: '',
};

export default SelectWiki;
