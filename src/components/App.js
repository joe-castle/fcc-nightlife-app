import React from 'react';
import axios from 'axios';

function Bars({ bars, handleGoingClick }) {
  return (
    <section style={{
      marginTop: '20px',
    }}>
      {bars.map(bar => (
        <section 
          key={bar.id}
          style={{
            background: '#a2a5d5',
            border: '3px solid #3a4bb8',
            marginBottom: '10px',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          <img
            style={{
              border: '3px solid #3a4bb8',
              borderRadius: '50%',
              padding: '3px',
            }} 
            src={bar.img_url} 
            alt={bar.name}
          />
          <h2>{bar.name}</h2>
          <button
            onClick={() => handleGoingClick(bar.id)}
            style={{
              border: '1px solid #3a4bb8',
              padding: '10px',
            }}
          >
            {`${bar.going.length} Going`}
          </button>
          <p style={{ fontStyle: 'italic'}}>{`"${bar.description}"`}</p>
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
      bars: [],
      lastSearch: '',
      cityInput: '',
      fetching: false,
    };
  }

  componentDidMount() {
    const { lastSearch, authenticated } = window.__INITIAL_STATE__;

    this.setState({
      authenticated,
      lastSearch,
      cityInput: lastSearch,
    });

    if (authenticated) {
      // Settimeout to ensure handleSubmit has correct cityInput as setState is async.
      setTimeout(this.handleSubmit, 0);
    }
  }

  handleSubmit = ev => {
    ev && ev.preventDefault();

    this.setState({ fetching: true });

    axios.get(`/api/bars?city=${this.state.cityInput}`)
      .then(({ data }) => { this.setState({ bars: data, fetching: false })})
      .catch(error => {
        console.log('error', error)
        this.setState({ fetching: false });
      })

  }

  handleChange = ev => {
    this.setState({ cityInput: ev.target.value })
  }

  handleGoingClick = id => {
    if (this.state.authenticated) {
      axios.put(`/api/bars?bar=${id}`)
        .then(({ data }) => {
          const newBars = this.state.bars.slice(0);
          const index = newBars.findIndex(bar => bar.id === id);

          newBars[index].going = data;

          this.setState({ bars: newBars });
        })
        .catch(console.log)
    } else {
      // Only way I could get over CORS issue, sending a get request would fail.
      window.open('/auth/twitter', '_self')
    }
  }

  render() {
    return (
      <div className="App">
        <main style={{
          margin: '0 auto',
          maxWidth: '800px',
          padding: '10px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '3em',
          }}>
            Whats going on in your local bars?
          </h1>
          <h3>Enter your local town and tell people where your going tonight!</h3>
          <form onSubmit={this.handleSubmit}>
            <input
              onChange={this.handleChange}
              value={this.state.cityInput}
              placeholder="Please enter your area..."
              style={{
                display: 'block',
                fontSize: '1.5em',
                margin: '0 auto',
                textAlign: 'center',
                width: '100%',
              }}
            />
          </form>
          {
            !this.state.fetching 
              ? <Bars bars={this.state.bars} handleGoingClick={this.handleGoingClick} />
              : <h2>Loading...</h2>
          }
        </main>
      </div>
    );
  }
}

export default App;
