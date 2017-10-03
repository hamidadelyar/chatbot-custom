import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import './materialize/css/materialize.min.css'
import userAvatar from './images/user.svg'
import botAvatar from './images/robot.svg'
import axios from 'axios'

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

    const getAvatar = (isSenderUser) => {
      if(isSenderUser){
          return userAvatar;
      }else{
          return botAvatar;
      }
    };

    return(
        <div className={messageClassName(props.message.isSenderUser)}>
            <img className="avatar" src={getAvatar(props.message.isSenderUser)} />
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
            <div id="chat-box" className="chat-box" ref={(div) => {this.chatBox = div;}}>
                {/* loop through the messages */}
                {this.props.messages.map((message, i) =>
                    <Message key={i} message={message}/>
                )}
            </div>
        );
    };

    /* function to scroll to bottom of the chatbox */
    scrollToBottom() {
        const scrollHeight = this.chatBox.scrollHeight;
        const height = this.chatBox.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.chatBox.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    /* scroll to the bottom of the page after the chat box has been rendered to show new messages */
    componentDidUpdate() {
        this.scrollToBottom();
    }
}

/*
* This will submit a message that will appear in the chat.
* On submit, will change state of the messages variable
* */
class Form extends React.Component{
    state = {
      messageInput: ''
    };

    botLogic = (message_content) => {
        if(message_content.toString().indexOf("rating") >= 0){
            return "j";
        }
    };

    // get movie name from user input
    getMovieName = (userInput)=> {
        //userInput = "what rating is the movie: Lord of the rings, the return of the king";
        const res = userInput.toString().split(":");
        // Get the movie title from user input
        var movie = "";
        try{
            movie = encodeURI(res[1].toString().trim());
        }catch (e){
            // not in correct format to be able to find a movie
            console.log("User input not in correct format, could not find movie in the string")
        }
        return movie;
    };

    // get request type i.e. Rating or Genre?
    getRequestType = (userInput) => {
        const res = userInput.toString().split(":");
        var requestType = "";
        try{
            // res[0] is first part of the users input (split by ':')
            // if it contains rating, then
            if(res[0].toString().toLowerCase().indexOf("rating") >= 0){
                requestType = "rating";
            }else if(res[0].toString().toLowerCase().indexOf("genre") >= 0){
                requestType = "genre";
            }
        }catch(e){
            console.log("User input not in correct format, could not find request type in the string")
        }
        return requestType;
    };

    submitBotMessage = (message_content) => {
        this.props.submitMessage(
            {
                message_content: message_content,
                isSenderUser: false
            }
        );
    };

    submitUserMessage = (message_content) => {
        this.props.submitMessage(
            {
                message_content: message_content,
                isSenderUser: true
            }
        );
    };

    handleSubmit = (event) => {
        //prevent default html submit
        event.preventDefault();
        //https://api.themoviedb.org/3/search/movie?api_key=8c2b175413dd2972869c720c5832be5f&query=Jack+Reacher

        // submits the message data
        this.submitUserMessage(this.state.messageInput);

        // get movie name from user input and encode into URI
        const movieName = this.getMovieName(this.state.messageInput).toString();
        var botResponseMsg = "";

        // if a movie name has been retrieved, then proceed to fulfill the request
        if(movieName != ""){
            axios.get(`https://api.themoviedb.org/3/search/movie?api_key=8c2b175413dd2972869c720c5832be5f&query=${movieName}`)
                .then(resp => {
                    console.log(resp.data.results[0]);
                    this.props.addMessage(
                        {
                            message_content: "One second let me check...",
                            isSenderUser: false
                        }
                    );

                    // try parsing the returned API data
                    try{
                        botResponseMsg = `The rating for ${resp.data.results[0].title} is ${resp.data.results[0].vote_average}`;
                    }catch(e){
                        console.log("Could not find request movie in the API");
                        botResponseMsg = "I'm sorry, I was not able to find anything!"
                    }
                    // the bots response message
                    this.submitBotMessage(botResponseMsg);
                });
        }else{
            // could not understand the user message input
            // bots response message
            this.submitBotMessage("I'm sorry, I do not understand what movie you wanted me to find.");
            this.submitBotMessage("Try adjusting your sentence format to this 'what rating is this: [movie name]'");
        }

        // Clear text input after message has been sent
        this.setState({ messageInput: '' });
    };

    render(){
        return(
            <form onSubmit={this.handleSubmit} className="form-user-input">
                <input type="text"
                       value={this.state.messageInput}
                       onChange={(event) =>  this.setState({ messageInput: event.target.value })}
                       placeholder="Ask me anything!" required className="text-user-input"/>
                {/*<button type="submit">Send</button>*/}
            </form>
        );
    }
}

class ChatApp extends React.Component{
    state = {
        messages: [
            {
                message_content: "Hi, what can I help you with?",
                isSenderUser: false
            },
        ]
    };

    // updates the messages state with a message
    // used by the form and the bot
    addMessage = (message) => {
        //console.log(message);

        this.setState(prevState => ({
            messages: prevState.messages.concat({
                message_content: message.message_content,
                isSenderUser: message.isSenderUser})
        }));

    };

    render(){
        return(
            <div className="container chat-app">
                <Chat messages={this.state.messages} />
                {/* Must pass ref to the function that changes the state to the Form object */}
                <Form submitMessage={this.addMessage}/>
            </div>
        );
    };
};


ReactDOM.render(<ChatApp />, document.getElementById('root'));


registerServiceWorker();
