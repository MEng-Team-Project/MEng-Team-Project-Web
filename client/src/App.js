import './App.css';

import AllRoutes from './Routes.js';

const testUrl = "/streams/00001.06585.mp4";

/*
const App = props => {
  return (
    <div className="App">
      <div className="feed-outer">
        <video
          className="feed"
          src={testUrl}
          autoPlay
          muted
          onContextMenu={e => e.preventDefault()}>
          Error retrieving video stream data.
        </video>
      </div>
    </div>
  );
}
*/

const App = () => {
  return (
    <AllRoutes/>
  )
};

export default App;