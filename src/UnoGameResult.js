import './UnoGameResult.css';

function UnoGameResult({ winner }) {
  return <div>
    {
      winner ? <span>{winner} 赢了</span> : <></>
    }
  </div>
}

export default UnoGameResult;