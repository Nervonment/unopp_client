import './ChatMessage.css';

function ChatMessage({ userName, message, isSelf }) {
    return (
        <div className={'ChatMessage' + (isSelf ? "-self" : "")} >
            <div className='ChatMessage-avatar'>
                {userName[0]}
            </div>
            <div className='ChatMessage-username-content-container'>
                {isSelf ? <div></div> :
                    <div className='ChatMessage-username'>
                        {userName}
                    </div>
                }
                <div className={'ChatMessage-content' + (isSelf ? "-self" : "")}>
                    {message}
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;