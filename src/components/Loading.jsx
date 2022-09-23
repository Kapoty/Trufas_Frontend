import React from "react";
import ReactDOM from "react-dom";

export default class Loading extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	componentDidMount() {
	}

	render() {

		return <React.Fragment>
			<div className="loading">
				<div uk-spinner="true"></div>
				<span>Carregando...</span>
			</div>
		</React.Fragment>
	}

}