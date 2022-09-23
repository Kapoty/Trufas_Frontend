import React from "react";
import ReactDOM from "react-dom";

import Config from "../config/Config";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

import * as ls from 'local-storage';

import PainelBar from '../components/PainelBar';

export default class Painel extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			profileLoaded: false, profile: {}
		};

		this.getUserProfile = this.getUserProfile.bind(this);
	}

	componentDidMount() {
		this.getUserProfile();
	}

	getUserProfile() {
		if (cookies.get('user-token') == null) {
			this.props.history.push('/');
			return;
		}
		fetch(Config.apiURL + "users/me/profile", {
			method: "GET",
			headers: { 
			"Content-type": "application/json; charset=UTF-8",
			"x-user-token": cookies.get('user-token'),
			} 
		})
		.then((resp) => {
			resp.json().then((data) => {
				if ('auth' in data) {
					cookies.remove('user-token');
					this.props.history.push('/');
				}
				else
					this.setState({profileLoaded: true, profile: data.profile});
			})
		})
		.catch((e) => {
			setTimeout(this.getUserProfile, 5000);
			console.log(e);
		});
	}

	render() {

		return <React.Fragment>
			{(this.state.profileLoaded) ? <React.Fragment>
				<PainelBar profile={this.state.profile} history={this.props.history}/>
				<div className="uk-container">
					{(this.state.profile.id == 1) ? <React.Fragment>
						<div className="uk-margin" style={{marginTop: "25px"}}>
							<h4 style={{textAlign: "center"}}>Painel de Administrador</h4>
						</div>
						<hr className="uk-divider-icon"/>
						<div className="uk-margin">
							<button className="uk-button uk-button-default uk-button-large uk-width-1-1" onClick={() => this.props.history.push("/rotas")}>
								Rotas
							</button>
							<button className="uk-margin uk-button uk-button-default uk-button-large uk-width-1-1" onClick={() => this.props.history.push("/usuarios")}>
								Usuarios
							</button>
						</div>
					</React.Fragment>
					: ""}
	              	<div className="uk-margin" style={{marginTop: "25px"}}>
							<h4 style={{textAlign: "center"}}>Painel de Vendedor</h4>
					</div>
					<hr className="uk-divider-icon"/>
			        <div className="uk-margin">
			        	<button className="uk-button uk-button-default uk-button-large uk-width-1-1" onClick={() => this.props.history.push("/minhas-rotas")}>
		            		Minhas Rotas
		              	</button>
	              	</div>
				</div>
			</React.Fragment> : ''}
		</React.Fragment>
	}

}