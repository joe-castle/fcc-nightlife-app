import React from 'react';
import axios from 'axios';

function Bars({ bars, handleGoingClick }) {
  return (
    <section>
      {bars.map(bar => (
        <section key={bar.id}>
          <img src={bar.img_url} alt={bar.name}/>
          <h4>{bar.name}</h4>
          <p>{bar.description}</p>
          <button onClick={() => handleGoingClick(bar.id)}>{`${bar.going.length} Going`}</button>
        </section>
      ))}
    </section>
  );
}

// Class used as hot-reloader does not work with pure function components
// as the entry point.
export class App extends React.Component {
  constructor() {
    super();

    this.state = {
      authenticated: false,
      bars: [],
    };
  }

  componentDidMount() {
    this.setState(window.__INITIAL_STATE__);
  }

  handleSubmit = ev => {
    ev.preventDefault();

    axios.get(`/api/bars?city=${this.cityInput.value}`)
      .then(bars => { this.setState({ bars: bars.data })})
      .catch(error => console.log('error', error))
  }

  handleGoingClick = id => {
    if (this.state.authenticated) {
      axios.put(`/api/bars?id=${id}`)
        .then(console.log)
        .catch(console.log)
    } else {
      axios.get('/auth/twitter')
        .then(console.log)
        .catch(console.log)
    }
  }

  render() {
    return (
      <div className="App">
        <main style={{ 
          margin: '0 auto',
          maxWidth: '800px', 
        }}>
          <h1 style={{
            fontSize: '3em',
            textAlign: 'center',
          }}>
            Whats going on in your local bars?
          </h1>
          <form onSubmit={this.handleSubmit}>
            <input
              ref={c => { this.cityInput = c; }}
              placeholder="Please enter your area..."
              style={{
                display: 'block',
                margin: '0 auto',
                width: '30em',
              }}
            />
          </form>
          <Bars bars={this.state.bars} handleGoingClick={this.handleGoingClick} />
        </main>
      </div>
    );
  }
}

export default App;
