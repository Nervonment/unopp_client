import './Players.css';

function Players({
  players,
  direction
}) {
  return (
    <div className='Players'>
      <div className='Players-loop-container'>
        <div className='Players-loop'></div>
      </div>
      <div className='Players-row'>
        {players.slice(0, players.length / 2).map(
          (value, key) => (
            <div className='Players-player' key={key}>{value}</div>
          ))}
      </div>
      <div className='Players-row'>
        {players.slice(players.length / 2).reverse().map(
          (value, key) => (
            <div className='Players-player' key={key}>{value}</div>
          ))}
      </div>

      <div className='Players-direction-container'>
        <div
          style={{ transform: `rotate(${direction ? 0 : 180}deg)` }}
          className='Players-direction'
        >
          <svg t="1709212867128" class="icon-arrow" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8009" width="24" height="24"><path d="M517.689 796.444c-45.511 0-85.333-17.066-119.467-51.2L73.956 381.156C51.2 358.4 56.889 324.266 79.644 301.51c22.756-22.755 56.89-17.067 79.645 5.689l329.955 364.089c5.69 5.689 17.067 11.378 28.445 11.378s22.755-5.69 34.133-17.067l312.89-364.089c22.755-22.755 56.888-28.444 79.644-5.689 22.755 22.756 28.444 56.89 5.688 79.645L637.156 739.556c-28.445 39.822-68.267 56.888-119.467 56.888 5.689 0 0 0 0 0z" p-id="8010" fill="#ffffff"></path></svg>
        </div>
      </div>
    </div>
  )
}

export default Players;