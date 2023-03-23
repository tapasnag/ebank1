import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {isError: false, errorMsg: '', userIdInput: '', userPin: ''}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({isError: true, errorMsg})
  }

  onSubmitUserDetails = async event => {
    event.preventDefault()
    const {userIdInput, userPin} = this.state
    const url = 'https://apis.ccbp.in/ebank/login'
    const userDetails = {
      user_id: userIdInput,
      pin: userPin,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUserId = event => {
    this.setState({userIdInput: event.target.value})
  }

  onChangePin = event => {
    this.setState({userPin: event.target.value})
  }

  render() {
    const {errorMsg, isError, userIdInput, userPin} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-main-container">
        <div className="sub-container-login">
          <div className="login-image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-image"
            />
          </div>
          <div className="login-form-container">
            <form className="form" onSubmit={this.onSubmitUserDetails}>
              <h1 className="login-heading">Welcome Back!</h1>
              <label className="user-label" htmlFor="userId">
                User Id
              </label>
              <input
                placeholder="Enter User ID"
                id="userId"
                className="input-text"
                type="text"
                value={userIdInput}
                onChange={this.onChangeUserId}
              />
              <label className="user-label" htmlFor="pin">
                PIN
              </label>
              <input
                id="pin"
                placeholder="Enter PIN"
                className="input-text"
                type="password"
                value={userPin}
                onChange={this.onChangePin}
              />
              <button type="submit" className="btn-login">
                Login
              </button>
              {isError && <p className="error">{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
