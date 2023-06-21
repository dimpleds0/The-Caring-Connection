import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import store from './store';
import Contact from './contact';
import CaringConnection from './caringConnection';

const App = () => (
  <Provider store={store}>
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={CaringConnection} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </div>
    </Router>
  </Provider>
);

export default App;

class CaringConnection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      participants: [],
      error: false,
    };
  }

  componentDidMount() {
    this.setState({ isFetching: true });
    fetch('/api/participants')
      .then(data => data.json())
      .then(data =>
        this.setState({
          participants: data.participants,
          isFetching: false,
        })
      )
      .catch(err => {
        this.setState({ error: true });
        console.log(err);
      });
  }

  render() {
    const { isFetching, participants, error } = this.state;
    return (
      <div>
        {isFetching ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error occured</div>
        ) : (
          <ul>
            {participants.map(p => (
              <li key={p.id}>
                {p.name} - {p.age}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      message: '',
    };
  }

  handleSubmit = event => {
    // prevent default form submission
    event.preventDefault();
    const { name, email, message } = this.state;
    const data = {
      name,
      email,
      message,
    };
    // submit the data
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      this.setState({
        name: '',
        email: '',
        message: '',
      });
    });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { name, email, message } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          placeholder="Name"
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="email"
          value={email}
          placeholder="Email"
          onChange={this.handleChange}
        />
        <textarea
          name="message"
          value={message}
          placeholder="Message"
          onChange={this.handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    );
  }
}