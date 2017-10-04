/**
 * Created by hamidadelyar on 04/10/2017.
 */
import React from 'react';
import Message from './message.js'

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

export default Chat;
