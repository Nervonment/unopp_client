import Image from 'next/image';

function UnoCard({
  hashVal,
  mini
}) {
  return (
    <div className='relative' style={{ width: mini ? "30px" : "60px" }}>
      <div className='border-2 border-muted border-solid absolute top-0' style={{
        borderRadius: mini ? "5px" : "10px",
        width: mini ? "30px" : "60px",
        height: mini ? "45px" : "90px"
      }}></div>
      <Image
        src={`/assets/uno_cards/${hashVal}.png`}
        alt={`卡牌${hashVal}`}
        width={mini ? 30 : 60}
        height={mini ? 45 : 90}
      />
    </div>
  )
}

export default UnoCard;