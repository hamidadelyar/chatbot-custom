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
    figures out what css class name to give the message, depending on whether the message is from
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
        <div className={messageClassName(props.message.isSenderUser)} >
            <img alt="avatar" className="avatar" src={getAvatar(props.message.isSenderUser)} />
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

    getKeyAPI = () => { return "8c2b175413dd2972869c720c5832be5f"; };

    submitBotMessage = (message_content) => {
        setTimeout(() => {
            this.props.submitMessage(
                {
                    message_content: message_content,
                    isSenderUser: false
                }
            );
        }, 1500);

    };

    submitUserMessage = (message_content) => {
        this.props.submitMessage(
            {
                message_content: message_content,
                isSenderUser: true
            }
        );
    };

    // reminds the user of questions he/she can ask the bot
    userPromptWithFormat = () => {
        // not in correct format to be able to find a movie
        console.log("User input not in correct format, could not find movie in the string");
        this.submitBotMessage("I'm sorry, I don't understand what movie you wanted me to find.");
        this.submitBotMessage("Try asking me something like 'what rating is: Jack Reacher?'");
    };

    presentUserManual = () => {
        this.submitBotMessage("Here are a list of things that you can ask me");
        this.submitBotMessage("What genre is this movie: [movie name goes here]");
        this.submitBotMessage("What rating is this movie: [movie name goes here]");
        this.submitBotMessage("What movies are similar to: [movie name goes here]");
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
            console.log("could not figure out movie from user input");
            this.userPromptWithFormat();
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
            }else if(res[0].toString().toLowerCase().indexOf("similar") >= 0 || res[0].toString().toLowerCase().indexOf("like") >= 0 ){
                requestType = "similar";
            }else if(res[0].toString().toLowerCase().indexOf("help") >= 0 || (res[0].toString().toLowerCase().indexOf("what") >= 0 &&
                (res[0].toString().toLowerCase().indexOf("ask") >= 0 || res[0].toString().toLowerCase().indexOf("say") >= 0))){
                requestType = "help";
            }
        }catch(e){
            console.log("User input not in correct format, could not find request type in the string");
            this.userPromptWithFormat();
        }
        return requestType;
    };

    getMovieRatingFromAPI = (movieName) => {
        // if a movie name has been retrieved, then proceed to fulfill the request
        if(movieName !== ""){
            axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.getKeyAPI()}&query=${movieName}`)
                .then(resp => {
                    console.log(resp.data.results[0]);
                    this.submitBotMessage("One second, let me check...");

                    // try parsing the returned API data
                    try{
                        this.submitBotMessage(`The rating for ${resp.data.results[0].title} (${parseInt(resp.data.results[0].release_date, 10)}) is ${resp.data.results[0].vote_average}`);
                    }catch(e){
                        console.log("Could not find requested movie in the API");
                        this.submitBotMessage("I'm sorry, I was not able to find anything matching that movie!");
                    }
                });
        }else{
            // could not understand the user message input
            this.userPromptWithFormat();
        }
    };



    // performs two api requests to get the genre
    getMovieGenreFromAPI = (movieName) => {
        // if a movie name has been retrieved, then proceed to fulfill the request
        if(movieName !== ""){
            var movieID = 0;
            axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.getKeyAPI()}&query=${movieName}`)
                .then(resp => {
                    console.log(resp.data.results[0]);
                    this.submitBotMessage("One second, let me check...");

                    // try parsing the returned API data
                    try{
                        movieID = resp.data.results[0].id;
                        console.log(movieID)
                        axios.get(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${this.getKeyAPI()}&language=en-US`).then(respDetails => {
                            console.log(respDetails.data.genres[0].name);
                            this.submitBotMessage(`The genre for ${resp.data.results[0].title} (${parseInt(resp.data.results[0].release_date, 10)}) is ${respDetails.data.genres[0].name}`);
                        })

                    }catch(e){
                        console.log("Could not find requested movie in the API");
                        this.submitBotMessage("I'm sorry, I was not able to find anything!");
                    }
                });
        }else{
            // could not understand the user message input
            this.userPromptWithFormat();
        }
    };

    getSimilarMovieFromAPI = (movieName) => {
        //https://api.themoviedb.org/3/movie/{movie_id}/similar?api_key=<<api_key>>&language=en-US&page=1
        // if a movie name has been retrieved, then proceed to fulfill the request
        if(movieName !== ""){
            var movieID = 0;
            axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.getKeyAPI()}&query=${movieName}`)
                .then(resp => {
                    console.log(resp.data.results[0]);
                    this.submitBotMessage("One second, let me check...");

                    // try parsing the returned API data
                    try{
                        movieID = resp.data.results[0].id;
                        axios.get(`https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=${this.getKeyAPI()}&language=en-US&page=1`).then(respSimilar => {
                            console.log(respSimilar.data.results);
                            this.submitBotMessage(`I will list three of the most similar movies to ${resp.data.results[0].title}`);
                            for(let i=0; i<3; i++){
                                this.submitBotMessage(`${i+1} - ${respSimilar.data.results[i].title} (${parseInt(resp.data.results[0].release_date, 10)}) is rated ${respSimilar.data.results[i].vote_average}`)
                            }
                        })

                    }catch(e){
                        console.log("Could not find requested movie in the API");
                        this.submitBotMessage("I'm sorry, I was not able to find anything!");
                    }
                });
        }else{
            // could not understand the user message input
            this.userPromptWithFormat();
        }
    };

    handleSubmit = (event) => {
        //prevent default html submit
        event.preventDefault();
        //https://api.themoviedb.org/3/search/movie?api_key=8c2b175413dd2972869c720c5832be5f&query=Jack+Reacher

        // submits the message data
        this.submitUserMessage(this.state.messageInput);

        const requestType = this.getRequestType(this.state.messageInput);

        if(requestType === "help"){
            this.presentUserManual();
        }else{
            // get movie name from user input and encode into URI
            const movieName = this.getMovieName(this.state.messageInput).toString();

            // determine user request type to fulfil if the movie name has been found
            if(requestType === "rating" && movieName !== ""){
                this.getMovieRatingFromAPI(movieName);
            }else if(requestType === "genre" && movieName !== ""){
                this.getMovieGenreFromAPI(movieName);
            }else if(requestType === "similar" && movieName !== ""){
                this.getSimilarMovieFromAPI(movieName);
            }
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
