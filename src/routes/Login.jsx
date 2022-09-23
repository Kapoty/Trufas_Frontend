import React from "react";
import ReactDOM from "react-dom";

import Config from "../config/Config";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

import * as ls from 'local-storage';

import LoadingComponent from '../components/Loading';

export default class LoginRoute extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			verifying: true,
			login: '',
			password: '',
			errorInput: '',
			errorMessage: '',
			trying: false,
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.verifyToken();
	}

	verifyToken() {
		if (cookies.get('user-token') == null) {
			this.setState({verifying: false});
			return;
		}
		fetch(Config.apiURL + "users/me/verify-token", {
			method: "GET",
			headers: { 
			"Content-type": "application/json; charset=UTF-8",
			"x-user-token": cookies.get('user-token'),
			} 
		})
		.then((resp) => {
			resp.json().then((data) => {
				if (!('auth' in data) || !data.auth) {
					cookies.remove('user-token');
					this.setState({verifying: false});
				}
				else
					this.props.history.push('/painel')
			})
		})
		.catch((e) => {
			setTimeout(this.verifyToken, 5000);
			console.log(e);
		});
	}

	handleSubmit(e) {
		if (e != undefined)
			e.preventDefault();
		this.setState({trying: true, errorMessage: ''});
		fetch(Config.apiURL + "users/login", {
				method: "POST",
				body: JSON.stringify({login: this.state.login, password: this.state.password}),
				headers: { 
					"Content-type": "application/json; charset=UTF-8",
				} 
			})
			.then((resp) => {
				resp.json().then((data) => {
					if ('error' in data) {
						let input = '', message = '';
						switch(data.error) {
							case 'incorrect data':
								input = 'error';
								message = 'Dados inválidos'
							break;
						}
						this.setState({trying: false, errorInput: input, errorMessage: message});
					}
					else {
						cookies.set('user-token', data.userToken, {path: '/'});
						this.props.history.push('/painel');
					}
				})
			})
			.catch((e) => {
				setTimeout(this.handleSubmit, 5000);
				console.log(e);
			});
	}

	render() {

		return	<React.Fragment>
			<div className="uk-container uk-flex uk-flex-middle uk-flex-column">
				<div className="uk-margin-top uk-margin-bottom" style={{borderRadius: "256px", overflow: "hidden"}}>
					<img src="/assets/image/logo.jpg" style={{width: "256px"}}/>
				</div>
				<form className="uk-form-horizontal" style={{marginTop: "25px"}} onSubmit={this.handleSubmit} >
					<fieldset disabled={this.state.trying} style={{border: 0}}>
						<div className="uk-margin">
							<h4>Autenticação</h4>
						</div>

						<div className="uk-margin">
					        <label className="uk-form-label " htmlFor="form-horizontal-text">Usuário</label>
		       				<div className="uk-form-controls">
		       					<div className="uk-inline">
						            <span className="uk-form-icon" uk-icon="icon: user"></span>
						            <input className={`uk-input ${this.state.errorMessage != '' ? 'uk-form-danger' : ''}`} value={this.state.login} onChange={(e) => this.setState({login: e.target.value})} name="login" type="text"/>
					            </div>
				            </div>
					    </div>

					    <div className="uk-margin">
						    <label className="uk-form-label" htmlFor="form-horizontal-text">Senha</label>
		       				<div className="uk-form-controls">
		       					<div className="uk-inline">
				            		<span className="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
				            		<input className={`uk-input ${this.state.errorMessage != '' ? 'uk-form-danger' : ''}`}  value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} name="password" type="password"/>
			            		</div>
				            </div>	
					    </div>
					    {(this.state.errorMessage != '')?
							<div className="uk-margin">
								<div className="uk-alert-danger" uk-alert="true">
								    <p>Usuário ou senha inválidos!</p>
								</div>
							</div>:""}
					    <div className="uk-margin">
					    	<input type="submit" className="uk-button uk-button-primary" value="Entrar"/>
					    </div>
					</fieldset>
			    </form>
			</div>
			{(this.state.trying || this.state.verifying) ? <LoadingComponent/> : ''}
		</React.Fragment>;
	}

}