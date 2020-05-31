import React, { Fragment, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import './App.css';
import Users from './components/users/Users';
import User from './components/users/User';
import About from './components/pages/About';
import Alert from './components/layout/Alert';
import Search from './components/users/Search';
import axios from 'axios';
import GithubState from './context/github/GithubState';

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  //Search Github users
  const searchUsers = async (text) => {
    setLoading(true);
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.React_app_github_client_id}
      $client_secret={process.env.React_app_github_client_secret}`);
    setUsers(res.data.items);
    setLoading(false);
  };

  //get single Github User
  const getUser = async (username) => {
    setLoading(true);
    //const res = await axios.get(`https://api.github.com/users?q=${username}&client_id=${process.env.React_app_github_client_id}
    //  $client_secret={process.env.React_app_github_client_secret}`);
    const res = await axios.get(`https://api.github.com/users/${username}`);
    setUser(res.data);
    setLoading(false);
  };

  //get users repos
  const getUserRepos = async (username) => {
    setLoading(true);
    //  const res = await axios.get(`https://api.github.com/users?q=${username}/repos? per_page=5&sort=created:asc&client_id=${process.env.React_app_github_client_id}
    //  $client_secret={process.env.React_app_github_client_secret}`);
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos? per_page=5&sort=created:asc`
    );
    setRepos(res.data);
    setLoading(false);
  };

  //Clear users from state
  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  };

  //SetAlert
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <GithubState>
      <Router>
        <div className='App'>
          <Navbar />
          <div className='container'>
            <Alert alert={alert} />
            <Switch>
              <Route
                exact
                path='/'
                render={(props) => (
                  <Fragment>
                    <Search
                      searchUsers={searchUsers}
                      clearUsers={clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={showAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}
              />
              <Route exact path='/about' component={About} />
              <Route
                exact
                path='/user/:login'
                render={(props) => (
                  <User
                    {...props}
                    getUser={getUser}
                    getUserRepos={getUserRepos}
                    user={user}
                    repos={repos}
                    loading={loading}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    </GithubState>
  );
};

export default App;
