import React, { Component } from 'react'
//components
import Header from './components/Header'
import Footer from './components/Footer'
//pages
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import NotFound from './pages/NotFound'
import PostIndex from './pages/PostIndex'
import PostProfile from './pages/PostProfile'
import PostShow from './pages/PostShow'
import PostNew from './pages/PostNew'
//import react router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
//mockData
import post from './mockData.js'
class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			posts: [],
		}
	}
	componentDidMount() {
		this.indexPost()
	}
	indexPost = () => {
		fetch('/posts')
			.then((response) => {
				return response.json()
			})
			// Where we would set the state in created by order
			.then((payload) => {
				this.setState({ posts: payload })
			})
			.catch((errors) => {
				console.log('index errors:', errors)
			})
	}
	createNewPost = (newpost) => {
		console.log('appjsform', newpost)
		fetch('/posts', {
			body: JSON.stringify(newpost),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		})
			.then((response) => {
				if (response.status === 422) {
					alert('There is something wrong with your submission.')
				}
				return response.json()
			})
			.then(() => {
				this.indexPost()
			})
			.catch((errors) => {
				console.log('create errors', errors)
			})
	}
	deletePost = (post) => {
		console.log('delete post', post)
		alert('Delete this listing?')
		fetch(`/posts/${post}`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'DELETE',
		})
			.then((response) => {
				console.log(response)
				if (response.status === 422) {
					alert('There is something wrong with your submission.')
				}
				return response.json()
			})
			.then(() => {
				this.indexPost()
			})
			.catch((errors) => {
				console.log('create errors', errors)
			})
	}
	//updatePostCount
	//update method will be here
	//patch or post
	//add a count column inside the database
	//one column with upvotes
	//one column with downvotes
	//updatePost
	//will have an argument POST ID, and newcount

	//Questions for Nate
	//how to reference the count portion of the json

	updatePostCount = (post) => {
		return fetch(`/posts/${post.id}`, {
			// converting an object to a string
			body: JSON.stringify(post),
			// specify the info being sent in JSON and the info returning should be JSON
			headers: {
				'Content-Type': 'application/json',
			},
			// HTTP verb so the correct endpoint is invoked on the server
			method: 'PATCH',
		})
			.then((response) => {
				if (response.status === 422) {
					alert('Please check your submission.')
				}
				return response.json()
			})
			.then((payload) => {
				this.indexPost()
			})
			.catch((errors) => {
				console.log('update errors:', errors)
			})
	}

	render() {
		console.log('logged in', this.props.logged_in)
		console.log('current user', this.props.current_user)
		console.log('state', this.state.posts)
		// console.log(this.state.posts)
		const {
			logged_in,
			current_user,
			new_user_route,
			sign_in_route,
			sign_out_route,
		} = this.props
		return (
			<Router>
				<Header
					logged_in={logged_in}
					new_user_route={new_user_route}
					sign_in_route={sign_in_route}
					sign_out_route={sign_out_route}
				/>
				<Switch>
					<Route exact path='/' component={Home} />
					{/* -----Index----- */}
					<Route
						path='/postindex'
						render={(props) => (
							<PostIndex
								posts={this.state.posts}
								updatePostCount={this.updatePostCount}
							/>
						)}
					/>
					{/* -----Post Show----- */}
					<Route
						path='/postshow/:id'
						render={(props) => {
							let id = props.match.params.id
							let post = this.state.posts.find(
								(post) => post.id === parseInt(id)
							)
							return (
								<PostShow
									logged_in={logged_in}
									post={post}
									current_user={current_user}
									deletePost={this.deletePost}
								/>
								//use conditional rendering to show delete for user
								//if post does not belong to user do not show delete
								//pass down current user id and user id
								//if the above match show delete button
							)
						}}
					/>
					{/* -----Protected Post Index----- */}
					{logged_in && (
						<Route
							path='/postprofile'
							render={(props) => {
								let id = this.props.current_user.id
								let mypost = this.state.posts.filter(
									(post) => post.user_id === id
								)
								return (
									<PostProfile mypost={mypost} deletePost={this.deletePost} />
								)
							}}
						/>
					)}
					{/* -----Protected Post New----- */}
					{logged_in && (
						<Route
							path='/postnew'
							render={(props) => {
								return (
									<PostNew
										current_user={current_user}
										createNewPost={this.createNewPost}
									/>
								)
							}}
						/>
					)}
					{/* ----- Protected Post Edit STRETCH GOAL-----
          { logged_in &&
            <Route
              path="/postedit/:id"
              render={ (props) => {
                let id = props.match.params.id
                let apartment = this.state.posts.find(post => post.id === parseInt(id))
                return (
                  <PostEdit
                    current_user={ current_user }
                    editPost={ this.editPost }
                    post={ post }
                  />
                )
              }}
            />
          } */}
					<Route path='/aboutus' component={AboutUs} />
					<Route component={NotFound} />
				</Switch>
				{/* <br></br>
                <br></br> */}
				{/* <Footer/> */}
			</Router>
		)
	}
}
export default App
