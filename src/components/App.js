import React from 'react';

// Class used as hot-reloader does not work with pure function components
// as the entry point.
export class App extends React.Component {
  render() {
    return (
      <div className="App">
        <main>
          <h1>Nightlife Apps</h1>
        </main>
      </div>
    );
  }
}

export default App;
