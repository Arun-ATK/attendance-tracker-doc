import React from "react";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      college: "",
      password: "",
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmitRegister = async () => {
    const { name, email, college, password } = this.state;

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          college,
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
        <h1 className="form-title">Register</h1>

        <div className="form-elt">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={this.handleChange}
          />
        </div>

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
            type="text"
            name="college"
            placeholder="college"
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
          <button className="btn" onClick={this.onSubmitRegister}>
            SignUp
          </button>
        </div>
      </div>
    );
  }
}

export default Register;
