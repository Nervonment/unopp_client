import './UnoCard.css';

function UnoCard({
  hashVal
}) {
  return (
    <div className='UnoCard-img-container'>
      <div className='UnoCard-img-border'></div>
      <img
        className='UnoCard-img'
        src={`assets/uno_cards/${hashVal}.png`}
        alt={`卡牌${hashVal}`}
        width={60}
        height={90}
      />
    </div>
  )
}

export default UnoCard;