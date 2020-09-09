import React from 'react'
import Comment from '../Components/Comment'
import {ListGroup, ListGroupItem} from 'reactstrap';
import ModalForm from '../Components/ModalForm'

class CommentContainer extends React.Component {
    state = {
        comments:null,
        votedComments:null,
        isLoaded:false,
        loadedVotedComments:false
    }

    componentDidMount () {
        const token = localStorage.getItem("token")
        if (token) {
          this.retrieveComments(token)
          this.retrievePastVotes(token)
        }
    }

    retrieveComments = (token) => {
        fetch(`http://localhost:3000/posts/${this.props.postObj.id}/comments`, {
            method: "GET",
            headers: {
                        Authorization: `Bearer ${token}`
                     }
            })
              .then(response => response.json())
              .then(comments => {
                              this.setState({
                                    comments : comments,
                                    isLoaded : true
                                            })
                            }
                  )
    }

    retrievePastVotes = (token) => {
        if (token) {
            fetch(`http://localhost:3000/users/${this.props.user.id}/voted_comments`, {
              method: "GET",
              headers: {
                          Authorization: `Bearer ${token}`
                       }
              })
                .then(response => response.json())
                .then(votedComments => {this.setState({
                    votedComments : votedComments,
                    loadedVotedComments:true
                })})
          }
    }
    
    postComment = (formData) => {
        const commentObj = { 
                comment:{
                        ...formData,
                        post_id:this.props.postObj.id
                        }
                    }

        const token = localStorage.getItem("token")
        fetch('http://localhost:3000/comments/', {
            method: "POST",
            headers: {
                        Authorization: `Bearer ${token}`,
                        "accepts" : "application/json",
                        "content-type" : "application/json"
                     },
            body: JSON.stringify(commentObj)
            })
              .then(response => response.json())
              .then(comment => {
                              this.setState({comments:[...this.state.comments,comment]})
                            }
                  )
    }

    voteHandler = (voteType,comment) => {
        let upvote = true
        if (voteType === "downvote") {
            upvote = false
        }

        const voteObj = {
            upvote : upvote
        }

        const token = localStorage.getItem("token")
        const configObj = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({vote: voteObj})
        }  

        fetch(`http://localhost:3000/comments/${comment.id}/votes/create`, configObj)
            .then(resp => resp.json())
            .then(commentObj => { 
                const commentIndex = this.state.comments.findIndex(searchedComment => {
                    return(
                        searchedComment.id === comment.id
                    )
                })
                this.state.comments[commentIndex] = commentObj
                this.setState({
                    comments:this.state.comments,
                    votedComments:[...this.state.votedComments,comment]
                })
            })
    }

    renderComments = () => {
        return (this.state.comments.map(comment => {
            return (
                <ListGroupItem key={comment.id}>
                    <Comment votedComments={this.state.votedComments} comment={comment} voteHandler={this.voteHandler}/>
                </ListGroupItem>
            )
        }))
    }
        
    render() {
        return (
            <>
                    {this.state.isLoaded && this.state.loadedVotedComments
                    ? 
                    <>
                        <ModalForm postComment={this.postComment} parentComponent={"commentContainer"} buttonLabel="Leave a comment?"/><br/>
                        <ListGroup className="list-group">
                            {this.renderComments()}
                        </ListGroup>
                    </>
                    : 
                    ""}
            </>
        )
    }
}

export default CommentContainer