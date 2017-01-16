import React from 'react';
import axios from 'axios';

function Bars({ bars, handleGoingClick }) {
  return (
    <section className="row" style={{ maxWidth: '800px', margin: '0 auto'}}>
      {bars.map(bar => (
        <div
          className="col-lg-4 col-md-6 col-sm-12"
          key={bar.id}
        >
          <div 
            className="card" 
            style={{ padding: '5px' }}
          >
            <img
              className="card-img-top"
              src={bar.img_url} 
              alt={bar.name}
            />
            <div className="card-block">
              <h2 className="card-title">{bar.name}</h2>
              <p className="card-text">{`"${bar.description}"`}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleGoingClick(bar.id)}
              >
                {`${bar.going.length} Going`}
              </button>
            </div>
          </div>
        </div>
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
          padding: '10px',
          textAlign: 'center',
        }}>
          <div className="jumbotron" style={{
            width: '100%'
          }}>
            <h1 style={{
              color: '#505ede',
              fontSize: '3em',
            }}>
              Whats going on in your local bars?
            </h1>
            <h3 style={{ color: '#777'}}>
              Enter your city and tell people where your going tonight!
            </h3>
            <form onSubmit={this.handleSubmit}>
              <input
                className="form-control"
                onChange={this.handleChange}
                value={this.state.cityInput}
                placeholder="Enter your city..."
                style={{
                  display: 'block',
                  fontSize: '1.5em',
                  margin: '20px auto',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '500px'
                }}
              />
            </form>
          </div>
          {
            !this.state.fetching 
              ? <Bars bars={this.state.bars} handleGoingClick={this.handleGoingClick} />
              : <h2 style={{ color: '#555'}}>Loading...</h2>
          }
          <section style={{ fontSize: '1.5em'}}>
            Created for <a href="http://freecodecamp.com">freecodecamp.com</a>. Source @ <a href="https://github.com/joesmith100/fcc-nightlife-app">GitHub</a>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
