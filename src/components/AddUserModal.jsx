import React from "react";

import Cookies from 'universal-cookie';
const cookies = new Cookies();

import Config from "../config/Config";

export default class AddUserModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			password_confirm: '',
			profile_id: 2,
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
		fetch(Config.apiURL + "users/", {
			method: "POST",
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password,
				password_confirm: this.state.password_confirm,
				profile_id: this.state.profile_id,
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
						case 'username too short':
							input = 'username';
							message = 'Usuário muito curto (min. 4)'
						break;
						case 'username too long':
							input = 'username';
							message = 'Usuário muito longo (max. 12)'
						break;
						case 'username duplicate':
							input = 'username';
							message = 'Usuário já cadastrado'
						break;
						case 'username invalid':
							input = 'username';
							message = 'Usuário inválido (somente números/letras/_)'
						break;
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
						case 'profile invalid':
							input = 'profile';
							message = 'Perfil inválido'
						break;
						default:
							input = 'error';
							message = 'Erro inesperado: '+data.error;
					}
					this.setState({trying: false, errorInput: input, errorMessage: message});
				}
				else {
					this.setState({trying: false, errorInput: 'success', errorMessage: 'Usuário adicionado!'});
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
										<h4>Adicionar Novo Usuário</h4>
									</div>
										<div className="uk-margin">
										    <label className="uk-form-label" htmlFor="form-horizontal-text">Usuário</label>
												<div className="uk-form-controls">
													<div className="uk-inline uk-width-1-1">
									        		<span className="uk-form-icon" uk-icon="icon: user"></span>
									        		 <input className={`uk-input ${this.state.errorInput == 'username' ? 'uk-form-danger' : ''}`} value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} name="username" type="text"/>
									    		</div>
									        </div>	
									    </div>
									    <div className="uk-margin">
										    <label className="uk-form-label" htmlFor="form-horizontal-text">Senha</label>
												<div className="uk-form-controls">
													<div className="uk-inline uk-width-1-1">
									        		<span className="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
									        		<input className={`uk-input ${this.state.errorInput == 'password' ? 'uk-form-danger' : ''}`} value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} name="password" type="password"/>
									    		</div>
									        </div>	
									    </div>
									    <div className="uk-margin">
										    <label className="uk-form-label" htmlFor="form-horizontal-text">Confirmação de Senha</label>
											<div className="uk-form-controls">
												<div className="uk-inline uk-width-1-1">
									        		<span className="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
									        		<input className={`uk-input ${this.state.errorInput == 'password_confirm' ? 'uk-form-danger' : ''}`} value={this.state.password_confirm} onChange={(e) => this.setState({password_confirm: e.target.value})} name="password_confirm" type="password"/>
									    		</div>
									        </div>	
									    </div>
									    <div className="uk-margin uk-flex uk-flex-between uk-flex-middle">
										    <label className="uk-form-label" htmlFor="form-horizontal-text">Perfil</label>
											<div className="uk-form-controls">
												<select name="Perfil" value={this.state.profile_id} onChange={(e) => this.setState({ profile_id: e.target.value})}>
													<option value="2">Vendedor</option>
											  		<option value="1">Administrador</option>
												</select>
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
									        <button className="uk-button uk-button-primary" type="button" onClick={this.handleSubmit}>Adicionar</button>
									    </p>
									</fieldset>
								</form>
							</div>
						</div>
				</React.Fragment>;
	}
}


