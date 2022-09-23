import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";

import { useHistory } from 'react-router';

import { BrowserRouter as Router, Route, Link, HashRouter, Switch} from "react-router-dom";

import "./assets/css/general.scss";

const LoginRoute = lazy(() => import('./routes/Login'));
const PainelRoute = lazy(() => import('./routes/Painel'));
const UsuariosRoute = lazy(() => import('./routes/Usuarios'));

import LoadingComponent from './components/Loading';

class SiteRouter extends React.Component {

   render() {
      return <Router>
         		 <div id="app">
                  <Suspense fallback={<LoadingComponent/>}>
            		 	<Switch>
                        <Route path="/" component={LoginRoute} exact />
                        <Route path="/painel" component={PainelRoute} exact />
                        <Route path="/usuarios" component={UsuariosRoute} exact />
                  	</Switch>
                  </Suspense>
                  <div className="chocolate"></div>
               </div>
            </Router>
   }
}

ReactDOM.render(<SiteRouter/>, document.getElementById("root"));