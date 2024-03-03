import './UnoCardPool.css';
import UnoCard from './UnoCard';

Math.seed = Math.random() * 10;
Math.seededRandom = function (max, min) {
  max = max || 1;
  min = min || 0;

  Math.seed = (Math.seed * 9301 + 49297) % 233280;
  var rnd = Math.seed / 233280.0;

  return min + rnd * (max - min);
}

let coords = [[300, 400, 0]];
for (let i = 0; i < 100; i++) {
  let angle = Math.seededRandom(0, 360);
  coords.push([
    coords[0][0] + 3 * i * Math.sin(angle) * Math.sqrt(Math.seededRandom(0, 1)) + Math.seededRandom(-30, 30),
    coords[0][1] + 4 * i * Math.cos(angle) * Math.sqrt(Math.seededRandom(0, 1)) + Math.seededRandom(-40, 40),
    Math.seededRandom(0, 360)
  ]);
}

function UnoCardPool({ cards }) {
  return (
    <div className='UnoCardPool'>
      <div className='UnoCardPool-cards-container'>
        {
          cards.map(
            (value, key) =>
              <div
                key={key}
                className='UnoCardPool-card'
                style={{
                  top: `${coords[key][0]}px`,
                  left: `${coords[key][1]}px`,
                  transform: `rotate(${coords[key][2]}deg)`
                }}
              >
                <UnoCard hashVal={value} />
              </div>
          )
        }
      </div>
    </div>
  );
}

export default UnoCardPool;