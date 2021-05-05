import { createContext, useReducer } from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import Navbar from './component/Navbar';
import Admin from './page/Admin';
import Home from './page/Home';
import Log from './page/Log';
import Signin from './page/Signin';
import { initialState, reducer } from './reducer/UseReducer';
import { initialState1, reducer1 } from './reducer/UseReducer';

export const userContext = createContext();

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)
  const [role, dispatch1] = useReducer(reducer1, initialState1)
  return (
    <>
      <userContext.Provider value={{ state, dispatch, role, dispatch1 }}>
        <Navbar />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/logs" component={Log} />
        </Switch>
      </userContext.Provider>
    </>
  );
}

export default App;
