import React from 'react';
import './App.css';
import { Route, withRouter, Switch} from 'react-router-dom';
import Navbar from './Components/Navbar';
import PostContainer from './Containers/PostContainer'
import Signup from './Components/Signup'
import Login from './Components/Login'
import UserContainer from './Containers/UserContainer'
import NotFound from './Components/Errors/404'

class App extends React.Component {

  constructor (props) {
    super (props)

    this.state = {
      user:false,
      isUserLoaded: false,
      signupError: null,
      authenticationError: "",
      authenticating: false
    }
  }

  getToken = () => {
    return localStorage.getItem("token")
  }

  //sends current_user token to load user's profile from backend
  retrieveUserProfile = (token) => {
    fetch("http://localhost:3000/api/v1/profile", {
        method: "GET",
        headers: {
                    Authorization: `Bearer ${token}`
                 }
        })
          .then(response => response.json())
          .then(data => { 
            this.setState({user : data.user,
                          isUserLoaded:true})
          })
  }

  componentDidMount () {
    //retrieves token associated with current_user on frontend
    const token = this.getToken()
    if (token) {
      this.retrieveUserProfile(token)
      } else {
        //redirects to login page if user isn't authenticated
        this.props.history.push("/login") 
        this.setState({isUserLoaded:true})
      }
  }

  signupHandler = (userObj) => {
    const configObj = {
      method: "POST",
      headers: {
        "accepts" : "application/json",
        "content-type" : "application/json"
      },
      body: JSON.stringify({user: userObj})
    }

    fetch("http://localhost:3000/api/v1/users", configObj)
      .then(response => response.json())
      .then(data => {
          if (data.jwt) {
            this.setState({
              user : data.user
            }, () => {this.loginHandler(this.state.user)})
          } else {
            this.setState({signupError:data})
          }
      })
  }

  loginHandler = (userInfo) => {
    this.setState({authenticating: true})
    const configObj = {
      method: "POST",
      headers: {
        "accepts" : "application/json",
        "content-type" : "application/json"
      },
      body: JSON.stringify({user: userInfo})
    }

    fetch("http://localhost:3000/api/v1/login", configObj)
      .then(response => response.json())
      .then(data => 
          {if (data.jwt) {
            localStorage.setItem("token",data.jwt)
            this.setState({user:data.user,
                          authenticating: false}, 
                          () => {this.props.history.push("/")
                                window.location.reload()
                          }) 
                      } else {
                        this.setState({authenticationError: data.message,
                                      authenticating:false})
                      }
          })
  }

  updateUser = (userData) => {
    this.setState({user:userData})
  }

  logOutHandler = () => {
    localStorage.removeItem("token")
    this.props.history.push("/login") 
    this.setState({user:false})
  }

  deleteHandler = (postObj) => {
    let id = postObj.id
    const token = this.getToken()
    const configObj = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }
    fetch(`http://localhost:3000/posts/${id}`, configObj)
    .then(response => response.json())
    .then(data => {           
      this.props.history.push(`/user/posts`)
      })
}

editHandler = (postObj) => {
  let id = postObj.id
  let postToSend = { post:postObj }
  console.log("editHandler", postObj)

  const token = this.getToken()
  const configObj = {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(postObj)
  }

  fetch(`http://localhost:3000/posts/${id}`, configObj)
  .then(response => response.json())
  .then(data => {           
    this.props.history.push(`/posts/${id}`)
    window.location.reload()
    })
}



  render () {
    return (
      (this.state.isUserLoaded ?
        <div className="App">
          {this.state.user ? <Navbar user={this.state.user} clickHandler={this.logOutHandler}/> : null}
          <Switch>
            <Route exact path="/login" render={() => <Login authenticating={this.state.authenticating} submitHandler={this.loginHandler} authenticationError={this.state.authenticationError} user={this.state.user} clickHandler={this.logOutHandler}/>} />
            <Route exact path="/signup" render={() => <Signup submitHandler={this.signupHandler} user={this.state.user} clickHandler={this.logOutHandler} signupError={this.state.signupError} />} />
            <Route path="/user" render={(routerProps) => <UserContainer {...routerProps} deleteHandler={this.deleteHandler} editHandler={this.editHandler} updateUser={this.updateUser} user={this.state.user} getToken={this.getToken}/>}/>
            <Route path="/posts" render={(routerProps) => <PostContainer {...routerProps} deleteHandler={this.deleteHandler} editHandler={this.editHandler} user={this.state.user} getToken={this.getToken} />}/>
            <Route exact path="/" render={(routerProps) => <PostContainer {...routerProps} deleteHandler={this.deleteHandler} editHandler={this.editHandler} user={this.state.user} getToken={this.getToken} />}/>
            <Route component={NotFound} />
          </Switch>
        </div>
      :
        ""
      )
    )
  }
}

export default withRouter(App);
