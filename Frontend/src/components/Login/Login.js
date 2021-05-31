import React from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmitLogin = async () => {
    const { email, password } = this.state;

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        this.props.loadUser(user);
        this.props.routeChange("dashboard");
      } else {
        const error = await response.json();
        console.log(error.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    console.log(this.state);
    return (
      <div className="form">
        <h1 className="form-title">Login</h1>

        <div className="form-elt">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={this.handleChange}
          />
        </div>

        <div className="form-elt">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.handleChange}
          />
        </div>

        <div className="form-elt">
          <button className="btn" onClick={this.onSubmitLogin}>
            Log In
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
