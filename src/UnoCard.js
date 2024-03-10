import './UnoCard.css';

function UnoCard({
  hashVal,
  mini
}) {
  return (
    <div className='UnoCard-img-container' style={{ width: mini ? "30px" : "60px" }}>
      <div className='UnoCard-img-border' style={{
        borderRadius: mini ? "5px" : "10px",
        width: mini ? "28px" : "58px",
        height: mini ? "43px" : "88px"
      }}></div>
      <img
        className='UnoCard-img'
        src={`assets/uno_cards/${hashVal}.png`}
        alt={`卡牌${hashVal}`}
        width={mini ? 30 : 60}
        height={mini ? 45 : 90}
      />
    </div>
  )
}

export default UnoCard;