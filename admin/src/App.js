import React, {Component} from 'react';
import {HashRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Login from "./views/Login/Login";
import Main from "./views/Main/Main";
import NotFound from "./views/NotFound/NotFound";
import './App.css'

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/login" component={Login}></Route>
                    <Route path="/home" component={Main}></Route>
                    <Route exact path="/" render={() => <Redirect to="/login" />} />
                    <Route path="/" component={NotFound}></Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
