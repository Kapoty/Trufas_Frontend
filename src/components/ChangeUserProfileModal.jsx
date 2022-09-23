import React from "react";

import Cookies from 'universal-cookie';
const cookies = new Cookies();

import Config from "../config/Config";

export default class ChangeUserProfileModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			profile_id: 2,
			trying: false,
			errorInput: '', errorMessage: '',
		}

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.setState({profile_id: this.props.user.profile_id});
  	}

	handleSubmit(e) {
		if (e != undefined)
			e.preventDefault();
		return;
		this.setState({trying: true});
		fetch(Config.apiURL + "users/" + this.props.user.id + "/update-profile", {
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
										<h4>Alterar Perfil: {this.props.user.username}</h4>
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
									        <button className="uk-button uk-button-primary" type="button" onClick={this.handleSubmit}>Alterar</button>
									    </p>
									</fieldset>
								</form>
							</div>
						</div>
				</React.Fragment>;
	}
}


