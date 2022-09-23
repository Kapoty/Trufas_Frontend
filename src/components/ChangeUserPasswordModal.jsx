import React from "react";

import Cookies from 'universal-cookie';
const cookies = new Cookies();

import Config from "../config/Config";

export default class ChangeUserPasswordModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			password_confirm: '',
			trying: false,
			errorInput: '', errorMessage: '',
		}

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {

	}

	handleSubmit(e) {
		if (e != undefined)
			e.preventDefault();
		this.setState({trying: true});
		fetch(Config.apiURL + "users/" + this.props.user.id + "/update-password", {
			method: "POST",
			body: JSON.stringify({
				password: this.state.password,
				password_confirm: this.state.password_confirm,
			}),
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
				} else if ('error' in data) {
					let input = '', message = '';
					switch(data.error) {
						case 'password too short':
							input = 'password';
							message = 'Senha muito curta (min. 8)'
						break;
						case 'password too long':
							input = 'password';
							message = 'Senha muito longa (max. 15)'
						break;
						case 'password invalid':
							input = 'password';
							message = 'Senha inválida (somente números/letras/@_)'
						break;
						case 'password_confirm not match':
							input = 'password_confirm';
							message = 'As senhas não conferem'
						break;
						default:
							input = 'error';
							message = 'Erro inesperado: '+data.error;
					}
					this.setState({trying: false, errorInput: input, errorMessage: message});
				}
				else {
					this.setState({trying: false, errorInput: 'success', errorMessage: 'Senha alterada!'});
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
						<div className="modalBlack">
						    <div className="uk-flex uk-flex-center modalWhite">
							    <form action="#" className="uk-form-horizontal" style={{marginTop: "25px"}} onSubmit={this.handleSubmit}>
									<fieldset disabled={this.state.trying} style={{border: 0}}>
									<div className="uk-margin">
										<h4>Alterar Senha: {this.props.user.username}</h4>
									</div>
									    <div className="uk-margin">
										    <label className="uk-form-label" htmlFor="form-horizontal-text">Nova Senha</label>
												<div className="uk-form-controls">
													<div className="uk-inline uk-width-1-1">
									        		<span className="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
									        		<input className={`uk-input ${this.state.errorInput == 'password' ? 'uk-form-danger' : ''}`} value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} name="password" type="password"/>
									    		</div>
									        </div>	
									    </div>
									    <div className="uk-margin">
										    <label className="uk-form-label" htmlFor="form-horizontal-text">Confirmação de Nova Senha</label>
											<div className="uk-form-controls">
												<div className="uk-inline uk-width-1-1">
									        		<span className="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
									        		<input className={`uk-input ${this.state.errorInput == 'password_confirm' ? 'uk-form-danger' : ''}`} value={this.state.password_confirm} onChange={(e) => this.setState({password_confirm: e.target.value})} name="password_confirm" type="password"/>
									    		</div>
									        </div>	
									    </div>
									     {(this.state.errorInput == 'success')?
										<div className="uk-margin">
											<div className="uk-alert-success" uk-alert="true">
											    <p>{this.state.errorMessage}</p>
											</div>
										</div>:""}
										{(this.state.errorInput != '' && this.state.errorInput != 'success')?
										<div className="uk-margin">
											<div className="uk-alert-danger" uk-alert="true">
											    <p>{this.state.errorMessage}</p>
											</div>
										</div>:""}
									    <p className="uk-text-right">
									        <button className="uk-button uk-button-default uk-modal-close" type="button" onClick={this.props.handleCloseModal}>Cancelar</button>
									        <button className="uk-button uk-button-primary" type="button" onClick={this.handleSubmit}>Alterar</button>
									    </p>
									</fieldset>
								</form>
							</div>
						</div>
				</React.Fragment>;
	}
}


