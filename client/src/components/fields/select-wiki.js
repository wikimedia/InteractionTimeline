import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Message } from '@wikimedia/react.i18n';
import 'react-select/dist/react-select.css';

class SelectWiki extends React.Component {

	componentDidMount() {
		this.props.fetchOptions();
	}

	render() {
		return (

			<Select
				{...this.props}
				placeholder={<Message id="field-select-placeholder" />}
				noResultsText={<Message id="field-select-no-results" />}
				searchPromptText={<Message id="field-select-search-prompt" />}
				matchPos="start"
				matchProp="label"
			/>
		);
	}
}

SelectWiki.propTypes = {
	fetchOptions: PropTypes.func.isRequired
};

export default SelectWiki;
