import React from 'react'
import CommentContainer from '../Containers/CommentContainer'
import {ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText} from 'reactstrap';

class Post extends React.Component {

render() {
    return(
        <div className="posts-container">
            <ListGroup className="list-group">
                <ListGroupItem>
                    <p>{this.props.postObj.mood_title}</p><br/>
                    <p className="post-text"> {this.props.postObj.mood_description}</p><br/>
                    <strong>{this.props.postObj.poster_name}</strong>
                            {` 
                                \xa0\xa0\xa0\xa0\xa0\xa0\xa0 
                                ${this.props.postObj.mood_trigger} ${this.props.postObj.mood_trigger_detail}
                                \xa0\xa0\xa0\xa0\xa0\xa0\xa0 
                                ${this.props.postObj.mood_location}
                                \xa0\xa0\xa0\xa0\xa0\xa0\xa0 
                                ${this.props.postObj.mood_purpose}
                                \xa0\xa0\xa0\xa0\xa0\xa0\xa0 
                                ${this.props.postObj.mood_length}
                                \xa0\xa0\xa0\xa0\xa0\xa0\xa0    
                                ${this.props.postObj.mood_rating}  
                                \xa0\xa0\xa0\xa0\xa0\xa0\xa0 
                                ${this.props.postObj.mood_category} ${this.props.postObj.mood_category_detail}  
                                \xa0\xa0\xa0\xa0\xa0\xa0\xa0 
                                ${this.props.postObj.created_at.toString().substring(0,10)}
                            `}
                </ListGroupItem>
            </ListGroup>
            <br/>
            <CommentContainer postObj={this.props.postObj}/>
        </div>
    ) 
}
}

export default Post

