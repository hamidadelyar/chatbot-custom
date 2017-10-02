import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import './materialize/css/materialize.min.css'

const Message = (props) => {
    /*
    figures out what class to give the message, depending on whether the message is from
    the user or the bot
     */
    const messageClassName = (isSenderUser) => {
        if(isSenderUser){
            return "user-message";
        }else{
            return "bot-message";
        }
    };

    return(
        <div className={messageClassName(props.message.isSenderUser)}>
            <img className="avatar" src="http://placehold.it/50"/>
            <span className="message">{props.message.message_content}</span>
        </div>
    );
};

/*
Gets its data from the messages variable on the App state.
 */
class Chat extends React.Component{
    render(){
        return(
            <div className="chat-box">
                {/* loop through the messages */}
                {this.props.messages.map((message, i) =>
                    <Message key={i} message={message}/>
                )}
            </div>
        );
    }
};

/*
* This will submit a message that will appear in the chat.
* On submit, will change state of the messages variable
* */
class Form extends React.Component{
    state = {
      messageInput: ''
    };

    handleSubmit = (event) => {
        //prevent default html submit
        event.preventDefault();
        // submits the message data
        this.props.onSubmit(
            {
                message_content: this.state.messageInput,
                isSenderUser: true
            }
        );
        // Clear text input after message has been sent
        this.setState({ messageInput: '' });
    };

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <input type="text"
                       value={this.state.messageInput}
                       onChange={(event) =>  this.setState({ messageInput: event.target.value })}
                       placeholder="Ask me anything!" required />
                <button type="submit">Send</button>
            </form>
        );
    }
}

class ChatApp extends React.Component{
    state = {
        messages: [
            {
                message_content: "Hi, what can I help you with?",
                isSenderUser: false,
            },
            {
                message_content: "What rating is this movie?",
                isSenderUser: true,
            },
            {
                message_content: "Lord of thing rings the return of the king?",
                isSenderUser: true,
            },
            {
                message_content: "One sec, I'll check that for you",
                isSenderUser: false,
            },
            {
                message_content: "It is rated 7.9, not bad!",
                isSenderUser: false,
            }
        ]
    };

    // updates the messages state with a message
    // used by the form and the bot
    addMessage = (message) => {
        console.log(message);

        this.setState(prevState => ({
            messages: prevState.messages.concat({
                message_content: message.message_content,
                isSenderUser: message.isSenderUser})
        }))
    };

    render(){
        return(
            <div className="container">
                <Chat messages={this.state.messages} />
                {/* Must pass ref to the function that changes the state to the Form object */}
                <Form onSubmit={this.addMessage}/>
            </div>
        );
    };
};


ReactDOM.render(<ChatApp />, document.getElementById('root'));


registerServiceWorker();
