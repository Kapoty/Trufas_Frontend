import React from "react";
import ReactDOM from "react-dom";

import Config from "../config/Config";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

import * as ls from 'local-storage';

import PainelBar from '../components/PainelBar';
import LoadingComponent from '../components/Loading';
import AddUserModal from '../components/AddUserModal';
import ChangeUserPasswordModal from '../components/ChangeUserPasswordModal';
import ChangeUserProfileModal from '../components/ChangeUserProfileModal';

export default class Usuarios extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			trying: false,
			profileLoaded: false, profile: {},
			usersLoaded: false, users: [],
			action: '', actionInfo: {},
		};

		this.getUserProfile = this.getUserProfile.bind(this);
		this.getUsersList = this.getUsersList.bind(this);
		this.handleAtivo = this.handleAtivo.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleChangeUserPassword = this.handleChangeUserPassword.bind(this);
		this.handleChangeUserProfile = this.handleChangeUserProfile.bind(this);
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
				else if (data.profile.id != 1)
					this.props.history.push('/painel');
				else {
					this.setState({profileLoaded: true, profile: data.profile});
					this.getUsersList();
				}
			})
		})
		.catch((e) => {
			setTimeout(this.getUserProfile, 5000);
			console.log(e);
		});
	}

	getUsersList() {
		if (cookies.get('user-token') == null) {
			this.props.history.push('/');
			return;
		}
		fetch(Config.apiURL + "users", {
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
					this.setState({usersLoaded: true, users: data.users});
			})
		})
		.catch((e) => {
			setTimeout(this.getUsersList, 5000);
			console.log(e);
		});
	}

	handleAtivo(e) {
		e.preventDefault();
		fetch(Config.apiURL + `users/${e.target.dataset.id}/set-active`, {
			method: "POST", 
			body: JSON.stringify({value: e.target.checked}),
			headers: { 
				"Content-type": "application/json; charset=UTF-8",
				"x-user-token": cookies.get('user-token')
			} 
		  })
		.then((resp) => resp.json())
		.then((data) => {
			this.setState({trying: false});
			this.getUsersList();
		}).catch(() => {
        	this.setState({trying: false});
      	});
		this.setState({trying: true});
	}

	handleCloseModal() {
		this.setState({usersLoaded: false, action: ''});
		this.getUsersList();
	}

	handleChangeUserPassword(user) {
		this.setState({action: 'change password', actionInfo: {user: user}});
	}

	handleChangeUserProfile(user) {
		this.setState({action: 'change profile', actionInfo: {user: user}});
	}

	render() {

		return <React.Fragment>
			{(this.state.profileLoaded) ? <React.Fragment>
				<PainelBar profile={this.state.profile} history={this.props.history}/>
				<div className="uk-container">
					<div className="uk-margin" style={{marginTop: "25px"}}>
						<h4 style={{textAlign: "center"}}>Lista de Usuários</h4>
					</div>
					<table className="uk-table uk-table-small uk-table-divider">
						<thead>
								<tr>
										<th>ID</th>
										<th>Usuario</th>
										<th>Perfil</th>
										<th>Ativo</th>
										<th>Ações</th>
								</tr>
						</thead>
						<tbody>
						{(this.state.usersLoaded) ? this.state.users.map((user) => { 
							 return (
										<tr key={user.id}>
												<td>{user.id}</td>
												<td>{user.username}</td>
												<td>
													{user.profile_name}
												</td>
												<td>
													<label className="el-switch">
														<input className="form-checkbox" data-id={user.id} type="checkbox" checked={user.active} onChange={this.handleAtivo} disabled={this.state.trying}/>
														<span className="el-switch-style"></span>
													</label>
												</td>
												<td style={{display: 'flex', gap: '5px'}}>
													<button className="uk-icon-link" uk-icon="icon: lock; ratio: 1.5" disabled={this.state.trying} onClick={() => this.handleChangeUserPassword(user)}></button>
													<button className="uk-icon-link" uk-icon="icon: user; ratio: 1.5" disabled={this.state.trying} onClick={() => this.handleChangeUserProfile(user)}></button>
												</td>
										</tr>
									) 
						}) : ''}
						</tbody>
					</table>
					<button className="uk-button uk-button-primary uk-width-1-1 uk-button-large" style={{marginTop: "25px"}} onClick={() => this.setState({action: 'add'})} disabled={this.state.trying}>
						Adicionar Novo Usuário
					</button>
					<button className="uk-button uk-button-danger uk-width-1-1 uk-button-large" style={{marginTop: "25px"}} onClick={() => this.props.history.push("/painel")}>
						Voltar
					</button>
				</div>
				{(this.state.action == 'add') ? <AddUserModal handleCloseModal={this.handleCloseModal} history={this.props.history}/> : ''}
				{(this.state.action == 'change password') ? <ChangeUserPasswordModal user={this.state.actionInfo.user} handleCloseModal={this.handleCloseModal} history={this.props.history}/> : ''}
				{(this.state.action == 'change profile') ? <ChangeUserProfileModal user={this.state.actionInfo.user} handleCloseModal={this.handleCloseModal} history={this.props.history}/> : ''}
			</React.Fragment> : <LoadingComponent/>}
		</React.Fragment>
	}

}