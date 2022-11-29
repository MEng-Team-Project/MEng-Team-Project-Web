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