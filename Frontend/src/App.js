import React from "react";
import Register from "./components/Register/Register";
import Navigation from "./components/Navigation/Navigation";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import "./App.css";

const initialState = {
  signedIn: false,
  route: "register",
  user: {
    faculty_id: "",
    name: "",
    email: "",
    college: "",
    classes: [],
  },
};

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (user) => {
    this.setState({ user });
  };

  routeChange = (route) => {
    if (route === "dashboard") {
      this.setState({ signedIn: true });
    } else {
      this.setState(initialState);
    }
    this.setState({ route });
  };

  render() {
    console.log(this.state);
    const { signedIn, route, user } = this.state;

    let form;
    if (route === "login") {
      form = <Login loadUser={this.loadUser} routeChange={this.routeChange} />;
    } else if (route === "register") {
      form = (
        <Register loadUser={this.loadUser} routeChange={this.routeChange} />
      );
    }

    return (
      <div className="App">
        <Navigation signedIn={signedIn} routeChange={this.routeChange} />

        {!signedIn ? form : <Dashboard user={user} loadUser={this.loadUser} />}
      </div>
    );
  }
}

export default App;
