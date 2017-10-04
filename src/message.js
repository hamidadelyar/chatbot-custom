/**
 * Created by hamidadelyar on 04/10/2017.
 */
import React from 'react';
import userAvatar from './images/user.svg'
import botAvatar from './images/robot.svg'

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

export default Message;
