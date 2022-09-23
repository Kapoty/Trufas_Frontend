import React from "react";
import ReactDOM from "react-dom";

import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default class PainelBar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

		};

		this.logout = this.logout.bind(this);
	}

	logout() {
		cookies.remove('user-token');
		this.props.history.push("/");
	}

	render() {

		return <React.Fragment>
			<div className="uk-navbar-container" uk-navbar="true" style={{padding: "10px"}}>
				<div className="uk-navbar-center">
					<div className="uk-navbar-center-left">
						<div className="uk-navbar-item uk-flex uk-flex-column ">
							<span>{this.props.profile.username}</span>
							<span><b>({this.props.profile.name})</b></span>
						</div>
					</div>
					<a href="" className="uk-navbar-item uk-logo " style={{borderRadius: "64px", overflow: "hidden", width: "80px"}}>
						<img src="/assets/image/logo.jpg"/>
					</a>
					<div className="uk-navbar-center-right">
						<div className="uk-navbar-item"><button className="uk-button uk-button-danger" onClick={this.logout}>Sair</button></div>
					</div>
				</div>
			</div>
		</React.Fragment>
	}

}