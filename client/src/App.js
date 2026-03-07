import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

import { Switch, Route, Redirect } from "react-router-dom";

import Home from './components/Home';
import Register from './components/Register';
import Edit from './components/Edit';
import Details from './components/Details';
import Graph from './components/Graph';

import Login from './components/Login';
import Signup from './components/Signup';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = localStorage.getItem('loggedIn');
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/">
          {localStorage.getItem('loggedIn') ? <Redirect to="/home" /> : <Redirect to="/login" />}
        </Route>

        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />

        <PrivateRoute exact path="/home" component={Home} />
        <PrivateRoute exact path="/register" component={Register} />
        <PrivateRoute exact path="/graph" component={Graph} />
        <PrivateRoute exact path="/edit/:id" component={Edit} />
        <PrivateRoute exact path="/view/:id" component={Details} />

        <Redirect to="/login" />
      </Switch>
    </>
  );
}

export default App;
