import './ChatMessage.css';

function ChatMessage({ userName, message, isSelf, isSticker, stickerIdx, isSystem }) {
  if (!isSystem)
    return (
      <div className={'ChatMessage' + (isSelf ? "-self" : "")} >
        <div className='ChatMessage-avatar'>
          {userName[0]}
        </div>

        {
          !isSticker ?
            <div className='ChatMessage-username-content-container'>
              {isSelf ? <div></div> :
                <div className='ChatMessage-username'>
                  {userName}
                </div>
              }
              <div className={'ChatMessage-content' + (isSelf ? "-self" : "")}>
                {message}
              </div>
            </div> :
            <div>
              <img width={80} height={80} src={`assets/stickers/${stickerIdx}.png`} alt={`表情${stickerIdx}`} />
            </div>
        }
      </div>
    );

  return (
    <div className='ChatMessage-system'>
      {message}
    </div>
  )
}

export default ChatMessage;