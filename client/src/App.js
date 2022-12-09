/*
Wraps all of the routes (i.e. the client URL routes along with the
correct component) in a Redux provider. Redux is a react library
which allows you to globally manage the state of your application
while avoiding the hell of continuously providing props to the children
of a component recursively. Instead, you just wrap you function around
redux and you are given one prop which allows you to execute functions
or dispatch actions which affect the global state of the application.
*/

import './App.css';

import { Provider } from "react-redux";
import store from "./store";

import AllRoutes from './Routes.js';

const App = () => {
  return (
    <Provider store={store}>
      <AllRoutes/>
    </Provider>
  )
};

export default App;