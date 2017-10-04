import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import './materialize/css/materialize.min.css'
import Chat from './chat.js'
import Form from './form.js'


class ChatApp extends React.Component{
    /* Contains the chat messages. Initial message presented is from the bot to the user */
    state = {
        messages: [
            {
                message_content: "Hi, what can I help you with?",
                isSenderUser: false
            }
        ]
    };

    // updates the messages state with a message
    // used by the Form component
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
                {/* Must pass reference (cannot pass actual function) to the function that changes the state to the Form object */}
                <Form submitMessage={this.addMessage}/>
            </div>
        );
    };
}

ReactDOM.render(<ChatApp />, document.getElementById('root'));

registerServiceWorker();
