import { Popover, Button } from 'antd';
import './UnoGame.css';
import UnoCard from './UnoCard';
import UnoCardPool from './UnoCardPool';


function UnoGame({
  cardPool,
  cardsInHand,
  gameInfo,
  lastDrew,
  drawnOne,
  handlePlay,
  handleDrawOne,
  handleSkipAfterDrawingOne,
}) {

  const ColorSelect = ({ card }) => (
    <div className='UnoGame-colorselect-container'>
      <div className='UnoGame-colorselect-row'>
        <button className='UnoGame-colorselect UnoGame-colorselect-red'
          onClick={() => { handlePlay(card, 0); }}
        />
        <button className='UnoGame-colorselect UnoGame-colorselect-blue'
          onClick={() => { handlePlay(card, 3); }}
        />
      </div>
      <div className='UnoGame-colorselect-row'>
        <button className='UnoGame-colorselect UnoGame-colorselect-yellow'
          onClick={() => { handlePlay(card, 1); }}
        />
        <button className='UnoGame-colorselect UnoGame-colorselect-green'
          onClick={() => { handlePlay(card, 2); }}
        />
      </div>
    </div>
  );

  const colorSelect = (card) => <ColorSelect card={card} />;

  return (
    <div className='UnoGame'>

      <div className='UnoGame-lefttop-info-container'>
        <div className='UnoGame-lefttop-info'>
          <UnoCard hashVal={gameInfo["last_card"]} />
          上一张牌
        </div>
        {
          gameInfo["last_card"] > 76 ? (
            <div className='UnoGame-lefttop-info'>
              <UnoCard hashVal={gameInfo["specified_color"] + 101} />
              上家指定的颜色
            </div>
          ) : <></>
        }
      </div>

      <UnoCardPool cards={cardPool} />

      <div className='UnoGame-bottombar'>
        <div className='UnoGame-cards'>

          <div className='UnoGame-cards-in-hand'>
            {
              cardsInHand.map((value, key) => (
                <div className='UnoGame-card-container'>
                  <UnoCard className='UnoGame-card' key={key} hashVal={value} />
                  <button className='UnoGame-card-button' onClick={
                    value < 77 ?
                      () => { handlePlay(value, 0); } :
                      () => { }}
                  />
                  {
                    value > 76 ?
                      <Popover content={colorSelect(value)}>
                        <button className='UnoGame-card-button' />
                      </Popover> : <></>
                  }
                </div>
              ))
            }
          </div>

          {
            drawnOne ?
              <div className='UnoGame-last-drew'>
                <div className='UnoGame-card-container'>
                  <UnoCard className='UnoGame-card' hashVal={lastDrew} />
                  <button className='UnoGame-card-button' onClick={
                    lastDrew < 77 ?
                      () => { handlePlay(lastDrew, 0); } :
                      () => { }}
                  />
                  {
                    lastDrew > 76 ?
                      <Popover content={colorSelect(lastDrew)}>
                        <button className='UnoGame-card-button' />
                      </Popover> : <></>
                  }
                </div>
              </div> : <></>
          }

        </div>
        <div className='UnoGame-bottom-buttons-container'>
          {
            !drawnOne ?
              <div>
                <Button
                  size='large'
                  onClick={handleDrawOne}>抽牌</Button>
              </div> :
              <div>
                <Button
                  size='large'
                  onClick={handleSkipAfterDrawingOne}>不出</Button>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

export default UnoGame;