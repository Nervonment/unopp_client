import { Popover } from 'antd';
import { Button } from '@/components/ui/button';
import UnoCard from './UnoCard';
import UnoCardPool from './UnoCardPool';
import Players from './UnoPlayers';
import { cn } from '@/lib/utils';
import UnoGameResult from './UnoGameResult';
import useUno from '@/lib/useUno';
import Avatar from '@/components/ui/avatar';


function UnoGame({
  ws, roomId, pushChatMessage, handleGameStart, handleGameOver, gameStarted
}) {
  const {
    cardPool,
    cardsInHand,
    gameInfo,
    lastDrew,
    drawnOne,
    handlePlay,
    handleDrawOne,
    handleSkipAfterDrawingOne,
    handleSuspect,
    handleDisSuspect,
    suspectOptionShow,
    setSuspectOptionShow,
    hint,
    winner,
    gameResult,
    isFirstGame
  } = useUno(ws, roomId, pushChatMessage, handleGameStart, handleGameOver);

  const colorSelectStyle = 'w-[35px] h-[35px] cursor-pointer border-none transition-all hover:h-[40px] hover:w-[40px]'

  const ColorSelect = ({ card }) => (
    <div className='relative w-20 h-20'>
      <div>
        <button className={cn(colorSelectStyle, 'bg-[#ff5555] absolute bottom-10 right-10 rounded-tl-sm')}
          onClick={() => { handlePlay(card, 0); }}
        />
        <button className={cn(colorSelectStyle, 'bg-[#5555ff] absolute bottom-10 left-10 rounded-tr-sm')}
          onClick={() => { handlePlay(card, 3); }}
        />
      </div>
      <div>
        <button className={cn(colorSelectStyle, 'bg-[#ffaa00] absolute top-10 right-10 rounded-bl-sm')}
          onClick={() => { handlePlay(card, 1); }}
        />
        <button className={cn(colorSelectStyle, 'bg-[#55aa55] absolute top-10 left-10 rounded-br-sm')}
          onClick={() => { handlePlay(card, 2); }}
        />
      </div>
    </div>
  );

  const colorSelect = (card) => <ColorSelect card={card} />;

  const PlayerInfo = ({ name, id, cardCount, isNext }) => {
    return (
      <div className='flex flex-col items-center'>
        <div className={cn(
          'rounded-full', 'text-lg', 'flex items-center justify-center', 'text-muted-foreground',
          isNext ? 'w-14 h-14 border-[4px] border-primary' : 'w-12 h-12 border-none m-1'
        )}>
          <Avatar userId={id} userName={name} size={50} alt={name} />
          {/* <img src={avatarsURL[name]} width='54px' height='54px' style={{ borderRadius: "32px" }} alt='avatar' /> */}
        </div>
        <div className={isNext ? "color-primary font-bold w-20 text-center" : "w-20 text-center"}>
          {name.substr(0, 8) + (name.length > 8 ? "..." : "")}
        </div>
        <div className='flex gap-1 justify-center'>
          <svg t="1709216477745" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6158" width="24" height="24"><path d="M855.355077 291.131077c55.138462 15.753846 86.646154 74.830769 74.830769 129.969231l-3.938461 11.815384-145.723077 452.923077c-15.753846 55.138462-74.830769 86.646154-129.969231 74.830769l-11.815385-3.938461-299.323077-98.461539c-55.138462-15.753846-86.646154-74.830769-74.830769-129.96923l3.938462-11.815385 3.938461-7.876923 59.076923 19.692308-3.938461 7.876923c-7.876923 23.630769 3.938462 47.261538 23.630769 55.138461l7.876923 3.938462 299.323077 98.461538c23.630769 7.876923 47.261538-3.938462 55.138462-23.630769l3.938461-7.876923 145.723077-452.923077c7.876923-23.630769-3.938462-47.261538-23.630769-55.138461l-7.876923-3.938462-244.184616-78.769231 19.692308-59.076923 248.123077 78.769231z" fill="#ffffff" p-id="6159"></path><path d="M607.232 200.546462l252.061538 82.707692c59.076923 19.692308 94.523077 78.769231 78.769231 137.846154l-3.938461 11.815384-145.723077 452.923077c-19.692308 59.076923-78.769231 90.584615-137.846154 78.769231l-11.815385-3.938462-299.323077-98.461538c-59.076923-19.692308-94.523077-78.769231-78.76923-137.846154l3.938461-11.815384 3.938462-15.753847 74.830769 23.63077-3.938462 15.753846c-7.876923 19.692308 3.938462 39.384615 19.692308 47.261538l7.876923 3.938462 299.323077 98.461538h11.815385c15.753846 0 27.569231-7.876923 35.446154-19.692307l3.938461-7.876924 145.723077-452.923076c7.876923-19.692308-3.938462-39.384615-19.692308-47.261539l-7.876923-3.938461-252.061538-82.707693 23.630769-70.892307z m315.076923 216.615384c11.815385-51.2-19.692308-102.4-66.953846-118.153846l-236.307692-78.769231-15.753847 47.261539 236.307693 78.76923 7.876923 3.938462c23.630769 11.815385 35.446154 39.384615 27.569231 66.953846l-145.723077 452.923077-3.938462 7.876923c-7.876923 19.692308-27.569231 31.507692-47.261538 31.507692-3.938462 0-11.815385 0-15.753846-3.938461l-303.261539-98.461539-7.876923-3.938461c-23.630769-11.815385-35.446154-39.384615-27.569231-66.953846v-3.938462l-47.261538-15.753846v3.938462l-3.938462 11.815384c-11.815385 51.2 19.692308 102.4 66.953846 118.153846l299.323077 98.461539 11.815385 3.938461c51.2 11.815385 102.4-19.692308 118.153846-66.953846l145.723077-452.923077 7.876923-15.753846z" fill="#ffffff" p-id="6160"></path><path d="M520.585846 66.638769h-319.015384c-59.076923 0-110.276923 51.2-110.276924 110.276923v476.553846c0 59.076923 51.2 110.276923 110.276924 110.276924h315.076923c59.076923 0 110.276923-51.2 110.276923-110.276924v-476.553846c3.938462-63.015385-47.261538-110.276923-106.338462-110.276923z m-319.015384 63.015385h315.076923c27.569231 0 47.261538 19.692308 47.261538 47.261538v476.553846c0 27.569231-19.692308 47.261538-47.261538 47.261539h-315.076923c-27.569231 0-47.261538-19.692308-47.261539-47.261539v-476.553846c0-27.569231 19.692308-47.261538 47.261539-47.261538z" fill="#ffffff" p-id="6161"></path><path d="M201.570462 58.761846h319.015384c66.953846 0 118.153846 51.2 118.153846 118.153846v476.553846c0 66.953846-51.2 118.153846-118.153846 118.153847h-315.076923c-66.953846 0-118.153846-51.2-118.153846-118.153847v-476.553846c-3.938462-66.953846 47.261538-118.153846 114.215385-118.153846z m315.076923 697.107692c55.138462 0 102.4-47.261538 102.4-102.4v-476.553846c0-55.138462-43.323077-102.4-102.4-102.4h-319.015385c-55.138462 0-102.4 47.261538-102.4 102.4v476.553846c0 55.138462 47.261538 102.4 102.4 102.4h319.015385z m-315.076923-634.092307h315.076923c31.507692 0 55.138462 23.630769 55.138461 55.138461v476.553846c0 31.507692-23.630769 55.138462-55.138461 55.138462h-315.076923c-31.507692 0-55.138462-23.630769-55.138462-55.138462v-476.553846c0-31.507692 23.630769-55.138462 55.138462-55.138461z m315.076923 571.076923c19.692308 0 39.384615-15.753846 39.384615-39.384616v-476.553846c0-19.692308-15.753846-39.384615-39.384615-39.384615h-315.076923c-23.630769 0-39.384615 19.692308-39.384616 39.384615v476.553846c0 19.692308 15.753846 39.384615 39.384616 39.384616h315.076923z" fill="#ffffff" p-id="6162"></path><path d="M359.108923 275.377231c11.815385 0 47.261538 66.953846 82.707692 102.4 31.507692 23.630769 39.384615 63.015385 23.63077 98.461538-11.815385 23.630769-55.138462 0-102.4 0-47.261538 0-98.461538 27.569231-114.215385 0-15.753846-27.569231-7.876923-55.138462 23.630769-98.461538s74.830769-102.4 86.646154-102.4z" fill="#ffffff" p-id="6163"></path><path d="M351.232 464.423385h19.692308l7.876923 51.2 23.630769 15.753846v11.815384h-78.769231v-11.815384l23.630769-15.753846 3.938462-51.2zM686.001231 432.915692l70.892307-51.2 35.446154 82.707693-78.76923 55.138461-27.569231-86.646154z" fill="#ffffff" p-id="6164"></path></svg>
          {cardCount}
        </div>
      </div>
    )
  };

  if (gameStarted)
    return (
      <div className='relative h-full'>

        <div className='p-5 flex gap-5 w-max'>
          <div className='flex flex-col items-center'>
            <UnoCard hashVal={gameInfo["last_card"]} />
            上一张牌
          </div>
          {
            gameInfo["last_card"] > 76 ? (
              <div className='flex flex-col items-center'>
                <UnoCard hashVal={gameInfo["specified_color"] + 101} />
                上家指定的颜色
              </div>
            ) : <></>
          }
        </div>

        <div className='w-full absolute top-0 p-8 box-border flex justify-center'>
          <Players
            players={
              gameInfo["players"].map((value, key) =>
                <PlayerInfo
                  name={value["name"]}
                  id={value["id"]}
                  cardCount={value["count"]}
                  isNext={value["name"] === gameInfo["next_player"]}
                  key={key}
                />
              )}
            direction={!gameInfo["direction"]}
          />
        </div>

        <UnoCardPool cards={cardPool} />

        <div className='absolute bottom-24 text-center text-lg w-full'>
          <div>
            {
              suspectOptionShow ? (
                <div className='flex justify-center gap-2 mb-2'>
                  <Button variant="outline" onClick={() => { handleSuspect(); setSuspectOptionShow(false); }}>质疑</Button>
                  <Button variant="outline" onClick={() => { handleDisSuspect(); setSuspectOptionShow(false); }}>忍痛接受</Button>
                </div>
              ) : (
                <></>
              )
            }
          </div>
          {
            hint.length ?
              <div className='bg-primary mb-2 p-1'>
                {hint}
              </div> : <></>
          }
        </div>

        <div className='w-full absolute bottom-0 flex justify-center items-end'>
          <div className='flex'>
            <div className='flex'>
              {
                cardsInHand.map((value, key) => (
                  <div key={key} className='relative bottom-0 transition-all hover:bottom-4'>
                    <UnoCard className='relative' key={key} hashVal={value} />
                    <button className='absolute left-0 top-0 w-[60px] h-[90px] bg-transparent border-none cursor-pointer' onClick={
                      value < 77 ?
                        () => { handlePlay(value, 0); } :
                        () => { }}
                    />
                    {
                      value > 76 ?
                        <Popover content={colorSelect(value)}>
                          <button className='absolute left-0 top-0 w-[60px] h-[90px] bg-transparent border-none cursor-pointer' />
                        </Popover> : <></>
                    }
                  </div>
                ))
              }
            </div>

            {
              drawnOne ?
                <div className='pl-4'>
                  <div className='relative bottom-0 transition-all hover:bottom-4'>
                    <UnoCard className='relative' hashVal={lastDrew} />
                    <button className='absolute left-0 top-0 w-[60px] h-[90px] bg-transparent border-none cursor-pointer' onClick={
                      lastDrew < 77 ?
                        () => { handlePlay(lastDrew, 0); } :
                        () => { }}
                    />
                    {
                      lastDrew > 76 ?
                        <Popover content={colorSelect(lastDrew)}>
                          <button className='absolute left-0 top-0 w-[60px] h-[90px] bg-transparent border-none cursor-pointer' />
                        </Popover> : <></>
                    }
                  </div>
                </div> : <></>
            }

          </div>
          <div className='box-border h-24 p-4 flex justify-center items-center'>
            {
              !drawnOne ?
                <div>
                  <Button
                    variant="outline"
                    onClick={handleDrawOne}
                  >
                    摸牌
                  </Button>
                </div> :
                <div>
                  <Button
                    variant="outline"
                    onClick={handleSkipAfterDrawingOne}
                  >
                    不出
                  </Button>
                </div>
            }
          </div>
        </div>
      </div>
    );

  return (isFirstGame ? <></> :
    <UnoGameResult
      winner={winner} result={gameResult}
    />
  );
}

export default UnoGame;