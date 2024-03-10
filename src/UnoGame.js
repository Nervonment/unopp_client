import { Popover, Button } from 'antd';
import './UnoGame.css';
import UnoCard from './UnoCard';
import UnoCardPool from './UnoCardPool';
import Players from './Players';


function UnoGame({
  cardPool,
  cardsInHand,
  gameInfo,
  players,
  avatarsURL,
  lastDrew,
  drawnOne,
  handlePlay,
  handleDrawOne,
  handleSkipAfterDrawingOne,
  hint, options
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

  const PlayerInfo = ({ name, cardCount, isNext }) => {
    return (
      <div className='UnoGame-playerinfo'>
        <div className={isNext ? 'UnoGame-player-next-avatar' : 'UnoGame-player-avatar'}>
          {/* {name[0]} */}
          <img src={avatarsURL[name]} width='54px' height='54px' style={{ borderRadius: "32px" }} alt='avatar' />
        </div>
        <div className={isNext ? "UnoGame-playerinfo-next-player UnoGame-player-name" : "UnoGame-player-name"}>
          {name.substr(0, 8) + (name.length > 8 ? "..." : "")}
        </div>
        <div>
          <svg t="1709216477745" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6158" width="24" height="24"><path d="M855.355077 291.131077c55.138462 15.753846 86.646154 74.830769 74.830769 129.969231l-3.938461 11.815384-145.723077 452.923077c-15.753846 55.138462-74.830769 86.646154-129.969231 74.830769l-11.815385-3.938461-299.323077-98.461539c-55.138462-15.753846-86.646154-74.830769-74.830769-129.96923l3.938462-11.815385 3.938461-7.876923 59.076923 19.692308-3.938461 7.876923c-7.876923 23.630769 3.938462 47.261538 23.630769 55.138461l7.876923 3.938462 299.323077 98.461538c23.630769 7.876923 47.261538-3.938462 55.138462-23.630769l3.938461-7.876923 145.723077-452.923077c7.876923-23.630769-3.938462-47.261538-23.630769-55.138461l-7.876923-3.938462-244.184616-78.769231 19.692308-59.076923 248.123077 78.769231z" fill="#ffffff" p-id="6159"></path><path d="M607.232 200.546462l252.061538 82.707692c59.076923 19.692308 94.523077 78.769231 78.769231 137.846154l-3.938461 11.815384-145.723077 452.923077c-19.692308 59.076923-78.769231 90.584615-137.846154 78.769231l-11.815385-3.938462-299.323077-98.461538c-59.076923-19.692308-94.523077-78.769231-78.76923-137.846154l3.938461-11.815384 3.938462-15.753847 74.830769 23.63077-3.938462 15.753846c-7.876923 19.692308 3.938462 39.384615 19.692308 47.261538l7.876923 3.938462 299.323077 98.461538h11.815385c15.753846 0 27.569231-7.876923 35.446154-19.692307l3.938461-7.876924 145.723077-452.923076c7.876923-19.692308-3.938462-39.384615-19.692308-47.261539l-7.876923-3.938461-252.061538-82.707693 23.630769-70.892307z m315.076923 216.615384c11.815385-51.2-19.692308-102.4-66.953846-118.153846l-236.307692-78.769231-15.753847 47.261539 236.307693 78.76923 7.876923 3.938462c23.630769 11.815385 35.446154 39.384615 27.569231 66.953846l-145.723077 452.923077-3.938462 7.876923c-7.876923 19.692308-27.569231 31.507692-47.261538 31.507692-3.938462 0-11.815385 0-15.753846-3.938461l-303.261539-98.461539-7.876923-3.938461c-23.630769-11.815385-35.446154-39.384615-27.569231-66.953846v-3.938462l-47.261538-15.753846v3.938462l-3.938462 11.815384c-11.815385 51.2 19.692308 102.4 66.953846 118.153846l299.323077 98.461539 11.815385 3.938461c51.2 11.815385 102.4-19.692308 118.153846-66.953846l145.723077-452.923077 7.876923-15.753846z" fill="#ffffff" p-id="6160"></path><path d="M520.585846 66.638769h-319.015384c-59.076923 0-110.276923 51.2-110.276924 110.276923v476.553846c0 59.076923 51.2 110.276923 110.276924 110.276924h315.076923c59.076923 0 110.276923-51.2 110.276923-110.276924v-476.553846c3.938462-63.015385-47.261538-110.276923-106.338462-110.276923z m-319.015384 63.015385h315.076923c27.569231 0 47.261538 19.692308 47.261538 47.261538v476.553846c0 27.569231-19.692308 47.261538-47.261538 47.261539h-315.076923c-27.569231 0-47.261538-19.692308-47.261539-47.261539v-476.553846c0-27.569231 19.692308-47.261538 47.261539-47.261538z" fill="#ffffff" p-id="6161"></path><path d="M201.570462 58.761846h319.015384c66.953846 0 118.153846 51.2 118.153846 118.153846v476.553846c0 66.953846-51.2 118.153846-118.153846 118.153847h-315.076923c-66.953846 0-118.153846-51.2-118.153846-118.153847v-476.553846c-3.938462-66.953846 47.261538-118.153846 114.215385-118.153846z m315.076923 697.107692c55.138462 0 102.4-47.261538 102.4-102.4v-476.553846c0-55.138462-43.323077-102.4-102.4-102.4h-319.015385c-55.138462 0-102.4 47.261538-102.4 102.4v476.553846c0 55.138462 47.261538 102.4 102.4 102.4h319.015385z m-315.076923-634.092307h315.076923c31.507692 0 55.138462 23.630769 55.138461 55.138461v476.553846c0 31.507692-23.630769 55.138462-55.138461 55.138462h-315.076923c-31.507692 0-55.138462-23.630769-55.138462-55.138462v-476.553846c0-31.507692 23.630769-55.138462 55.138462-55.138461z m315.076923 571.076923c19.692308 0 39.384615-15.753846 39.384615-39.384616v-476.553846c0-19.692308-15.753846-39.384615-39.384615-39.384615h-315.076923c-23.630769 0-39.384615 19.692308-39.384616 39.384615v476.553846c0 19.692308 15.753846 39.384615 39.384616 39.384616h315.076923z" fill="#ffffff" p-id="6162"></path><path d="M359.108923 275.377231c11.815385 0 47.261538 66.953846 82.707692 102.4 31.507692 23.630769 39.384615 63.015385 23.63077 98.461538-11.815385 23.630769-55.138462 0-102.4 0-47.261538 0-98.461538 27.569231-114.215385 0-15.753846-27.569231-7.876923-55.138462 23.630769-98.461538s74.830769-102.4 86.646154-102.4z" fill="#ffffff" p-id="6163"></path><path d="M351.232 464.423385h19.692308l7.876923 51.2 23.630769 15.753846v11.815384h-78.769231v-11.815384l23.630769-15.753846 3.938462-51.2zM686.001231 432.915692l70.892307-51.2 35.446154 82.707693-78.76923 55.138461-27.569231-86.646154z" fill="#ffffff" p-id="6164"></path></svg>
          {cardCount}
        </div>
      </div>
    )
  };

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

      <div className='UnoGame-players'>
        <Players
          players={
            players.map((value, key) =>
              <PlayerInfo
                name={value["name"]}
                cardCount={value["count"]}
                isNext={value["name"] === gameInfo["next_player"]}
                key={key}
              />
            )}
          direction={!gameInfo["direction"]}
        />
      </div>

      <UnoCardPool cards={cardPool} />


      <div className='UnoGame-hint'>
        <div className='UnoGame-hint-options'>
          {options}
        </div>
        {
          hint.length ?
            <div className='UnoGame-hint-text'>
              {hint}
            </div> : <></>
        }
      </div>

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
                  onClick={handleDrawOne}>摸牌</Button>
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