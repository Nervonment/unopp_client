import './Instruction.css';
import { Button, Tour } from "antd";
import { useState } from "react";
import UnoCard from "./UnoCard";
import ChatMessage from './ChatMessage';

function Instruction() {

  const [instOpen, setInstOpen] = useState(false);
  const steps = [
    {
      title: "1",
      description: "UNO里有两种牌，彩色牌和黑色牌。",
      target: null,
      cover: (
        <div className='Instruction-1'>
          <div className='Instruction-1-cards-container'>
            <div className="Instruction-1-cards">
              <UnoCard hashVal={0} />
              <UnoCard hashVal={19} />
              <UnoCard hashVal={42} />
              <UnoCard hashVal={59} />
            </div>
            彩色牌
          </div>
          <div>
            <div className="Instruction-1-cards">
              <UnoCard hashVal={77} />
              <UnoCard hashVal={78} />
            </div>
            黑色牌
          </div>
        </div>
      )
    },

    {
      title: "2",
      description: "UNO是一个接龙游戏，牌上的数字不代表大小。当你的上家打出一张彩色牌时，你必须出一张颜色相同或者内容相同的牌。如果没有（或者不想出）的话，就从牌堆抽一张牌。如果抽到的牌能够应答上家的牌，也可以打出。",
      target: null,
      cover: (
        <div className='Instruction-2'>
          <div className='Instruction-2-next-card-container'>
            <div className='Instruction-2-next-card'>
              <UnoCard hashVal={19} />
              <svg t="1709447209424" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5305" width="20" height="20"><path d="M849.55 515H153.74c-16.57 0-30-13.43-30-30s13.43-30 30-30h695.81c16.57 0 30 13.43 30 30s-13.43 30-30 30z" p-id="5306" fill="#ffffff"></path><path d="M844.56 496.41l-0.19-0.19-235.76-235.76-0.01-0.01-0.01-0.01c-0.15-0.15-0.24-0.24-0.25-0.26-11.79-12.06-11.82-30.63-0.01-42.43 10.26-10.26 28.79-12.95 42.43 0.02l0.01-0.01 0.27 0.27 0.18 0.18c0.07 0.07 0.14 0.13 0.2 0.2L887 453.99l-42.44 42.42z" p-id="5307" fill="#ffffff"></path><path d="M626.84 740.76c-7.68 0-15.36-2.93-21.21-8.79-5.86-5.86-8.79-13.54-8.79-21.21s2.93-15.36 8.79-21.21l236.24-236.24c11.72-11.72 30.71-11.72 42.43 0 5.86 5.86 8.79 13.54 8.79 21.21s-2.93 15.36-8.79 21.21L648.05 731.97c-5.85 5.86-13.53 8.79-21.21 8.79z" p-id="5308" fill="#ffffff"></path></svg>
              <UnoCard hashVal={25} />
            </div>
            颜色相同
          </div>
          <div className='Instruction-2-next-card-container'>
            <div className='Instruction-2-next-card'>
              <UnoCard hashVal={42} />
              <svg t="1709447209424" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5305" width="20" height="20"><path d="M849.55 515H153.74c-16.57 0-30-13.43-30-30s13.43-30 30-30h695.81c16.57 0 30 13.43 30 30s-13.43 30-30 30z" p-id="5306" fill="#ffffff"></path><path d="M844.56 496.41l-0.19-0.19-235.76-235.76-0.01-0.01-0.01-0.01c-0.15-0.15-0.24-0.24-0.25-0.26-11.79-12.06-11.82-30.63-0.01-42.43 10.26-10.26 28.79-12.95 42.43 0.02l0.01-0.01 0.27 0.27 0.18 0.18c0.07 0.07 0.14 0.13 0.2 0.2L887 453.99l-42.44 42.42z" p-id="5307" fill="#ffffff"></path><path d="M626.84 740.76c-7.68 0-15.36-2.93-21.21-8.79-5.86-5.86-8.79-13.54-8.79-21.21s2.93-15.36 8.79-21.21l236.24-236.24c11.72-11.72 30.71-11.72 42.43 0 5.86 5.86 8.79 13.54 8.79 21.21s-2.93 15.36-8.79 21.21L648.05 731.97c-5.85 5.86-13.53 8.79-21.21 8.79z" p-id="5308" fill="#ffffff"></path></svg>
              <UnoCard hashVal={58} />
            </div>
            内容相同
          </div>
        </div>
      )
    },

    {
      title: "3",
      description: "彩色牌中，有3种功能牌。",
      target: null,
      cover: (
        <div className='Instruction-3'>
          <div className='Instruction-3-item'>
            <UnoCard hashVal={10} />
            跳过下一个玩家的回合
          </div>
          <div className='Instruction-3-item'>
            <UnoCard hashVal={28} />
            反转游戏方向<br />（顺时针或逆时针）
          </div>
          <div className='Instruction-3-item'>
            <UnoCard hashVal={43} />
            下一个玩家抽两张牌<br />并跳过回合
          </div>
        </div>
      )
    },

    {
      title: "4",
      description: "除此之外，还有2种黑色牌。当你没有其他牌能够接上家的牌时，就可以打出它们，并且指定一个颜色。你的下家需要接你指定的颜色的牌。此外，+4牌和+2类似，能够使你的下家抽4张牌，并跳过回合。",
      target: null,
      cover: (
        <div className='Instruction-4'>
          <UnoCard hashVal={77} />
          <UnoCard hashVal={78} />
        </div>
      )
    },

    {
      title: "5",
      description: "注意，当你的上家打出黑色+4时，你可以接受。但也可以对他提出质疑：此时，如果他的手上仍有彩色牌能够应答他的上家打出的牌，则换做他抽4张牌，你的回合继续；而如果他确实没有能够应答的彩色牌，那么你反被罚6张牌并跳过回合。",
      target: null,
      cover: (
        <div className='Instruction-5'>
          <div className='Instruction-5-item'>
            <div className='Instruction-5-step'>
              <UnoCard hashVal={49} />
              上家的上家打出蓝色1
            </div>
            <svg t="1709447209424" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5305" width="20" height="20"><path d="M849.55 515H153.74c-16.57 0-30-13.43-30-30s13.43-30 30-30h695.81c16.57 0 30 13.43 30 30s-13.43 30-30 30z" p-id="5306" fill="#ffffff"></path><path d="M844.56 496.41l-0.19-0.19-235.76-235.76-0.01-0.01-0.01-0.01c-0.15-0.15-0.24-0.24-0.25-0.26-11.79-12.06-11.82-30.63-0.01-42.43 10.26-10.26 28.79-12.95 42.43 0.02l0.01-0.01 0.27 0.27 0.18 0.18c0.07 0.07 0.14 0.13 0.2 0.2L887 453.99l-42.44 42.42z" p-id="5307" fill="#ffffff"></path><path d="M626.84 740.76c-7.68 0-15.36-2.93-21.21-8.79-5.86-5.86-8.79-13.54-8.79-21.21s2.93-15.36 8.79-21.21l236.24-236.24c11.72-11.72 30.71-11.72 42.43 0 5.86 5.86 8.79 13.54 8.79 21.21s-2.93 15.36-8.79 21.21L648.05 731.97c-5.85 5.86-13.53 8.79-21.21 8.79z" p-id="5308" fill="#ffffff"></path></svg>
            <div className='Instruction-5-step'>
              <UnoCard hashVal={78} />
              上家有蓝色牌或数字1牌，<br />但还是选择对你打出了+4
            </div>
            <svg t="1709447209424" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5305" width="20" height="20"><path d="M849.55 515H153.74c-16.57 0-30-13.43-30-30s13.43-30 30-30h695.81c16.57 0 30 13.43 30 30s-13.43 30-30 30z" p-id="5306" fill="#ffffff"></path><path d="M844.56 496.41l-0.19-0.19-235.76-235.76-0.01-0.01-0.01-0.01c-0.15-0.15-0.24-0.24-0.25-0.26-11.79-12.06-11.82-30.63-0.01-42.43 10.26-10.26 28.79-12.95 42.43 0.02l0.01-0.01 0.27 0.27 0.18 0.18c0.07 0.07 0.14 0.13 0.2 0.2L887 453.99l-42.44 42.42z" p-id="5307" fill="#ffffff"></path><path d="M626.84 740.76c-7.68 0-15.36-2.93-21.21-8.79-5.86-5.86-8.79-13.54-8.79-21.21s2.93-15.36 8.79-21.21l236.24-236.24c11.72-11.72 30.71-11.72 42.43 0 5.86 5.86 8.79 13.54 8.79 21.21s-2.93 15.36-8.79 21.21L648.05 731.97c-5.85 5.86-13.53 8.79-21.21 8.79z" p-id="5308" fill="#ffffff"></path></svg>
            <div className='Instruction-5-step'>
              <div className='Instruction-5-card'>
                <UnoCard hashVal={0} />
                ×4
              </div>
              你质疑上家，成功，<br />上家被罚4张牌，你的回合继续
            </div>
          </div>
          <br />
          <div className='Instruction-5-item'>
            <div className='Instruction-5-step'>
              <UnoCard hashVal={49} />
              上家的上家打出蓝色1
            </div>
            <svg t="1709447209424" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5305" width="20" height="20"><path d="M849.55 515H153.74c-16.57 0-30-13.43-30-30s13.43-30 30-30h695.81c16.57 0 30 13.43 30 30s-13.43 30-30 30z" p-id="5306" fill="#ffffff"></path><path d="M844.56 496.41l-0.19-0.19-235.76-235.76-0.01-0.01-0.01-0.01c-0.15-0.15-0.24-0.24-0.25-0.26-11.79-12.06-11.82-30.63-0.01-42.43 10.26-10.26 28.79-12.95 42.43 0.02l0.01-0.01 0.27 0.27 0.18 0.18c0.07 0.07 0.14 0.13 0.2 0.2L887 453.99l-42.44 42.42z" p-id="5307" fill="#ffffff"></path><path d="M626.84 740.76c-7.68 0-15.36-2.93-21.21-8.79-5.86-5.86-8.79-13.54-8.79-21.21s2.93-15.36 8.79-21.21l236.24-236.24c11.72-11.72 30.71-11.72 42.43 0 5.86 5.86 8.79 13.54 8.79 21.21s-2.93 15.36-8.79 21.21L648.05 731.97c-5.85 5.86-13.53 8.79-21.21 8.79z" p-id="5308" fill="#ffffff"></path></svg>
            <div className='Instruction-5-step'>
              <UnoCard hashVal={78} />
              上家既没有蓝色牌，<br />也没有数字1牌，<br />于是对你打出了+4
            </div>
            <svg t="1709447209424" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5305" width="20" height="20"><path d="M849.55 515H153.74c-16.57 0-30-13.43-30-30s13.43-30 30-30h695.81c16.57 0 30 13.43 30 30s-13.43 30-30 30z" p-id="5306" fill="#ffffff"></path><path d="M844.56 496.41l-0.19-0.19-235.76-235.76-0.01-0.01-0.01-0.01c-0.15-0.15-0.24-0.24-0.25-0.26-11.79-12.06-11.82-30.63-0.01-42.43 10.26-10.26 28.79-12.95 42.43 0.02l0.01-0.01 0.27 0.27 0.18 0.18c0.07 0.07 0.14 0.13 0.2 0.2L887 453.99l-42.44 42.42z" p-id="5307" fill="#ffffff"></path><path d="M626.84 740.76c-7.68 0-15.36-2.93-21.21-8.79-5.86-5.86-8.79-13.54-8.79-21.21s2.93-15.36 8.79-21.21l236.24-236.24c11.72-11.72 30.71-11.72 42.43 0 5.86 5.86 8.79 13.54 8.79 21.21s-2.93 15.36-8.79 21.21L648.05 731.97c-5.85 5.86-13.53 8.79-21.21 8.79z" p-id="5308" fill="#ffffff"></path></svg>
            <div className='Instruction-5-step'>
              <div className='Instruction-5-card'>
                <UnoCard hashVal={0} />
                ×6
              </div>
              你质疑上家，失败，<br />你反被罚6张牌，并跳过回合
            </div>
          </div>
        </div>
      )
    },

    {
      title: "6",
      description: "接下来是UNO的灵魂部分：当你只剩2张牌时，在出牌之前，必须喊一声「UNO」，否则会被罚2张牌。如果在其他情况下乱喊「UNO」或者喊了「UNO」又不出牌，则也会被罚2张牌。",
      target: null,
      cover: (
        <div className='Instruction-6'>
          <div className='Instruction-6-your-cards'>
            <UnoCard hashVal={17} /> <UnoCard hashVal={59} />
          </div>
          <svg t="1709447209424" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5305" width="20" height="20"><path d="M849.55 515H153.74c-16.57 0-30-13.43-30-30s13.43-30 30-30h695.81c16.57 0 30 13.43 30 30s-13.43 30-30 30z" p-id="5306" fill="#ffffff"></path><path d="M844.56 496.41l-0.19-0.19-235.76-235.76-0.01-0.01-0.01-0.01c-0.15-0.15-0.24-0.24-0.25-0.26-11.79-12.06-11.82-30.63-0.01-42.43 10.26-10.26 28.79-12.95 42.43 0.02l0.01-0.01 0.27 0.27 0.18 0.18c0.07 0.07 0.14 0.13 0.2 0.2L887 453.99l-42.44 42.42z" p-id="5307" fill="#ffffff"></path><path d="M626.84 740.76c-7.68 0-15.36-2.93-21.21-8.79-5.86-5.86-8.79-13.54-8.79-21.21s2.93-15.36 8.79-21.21l236.24-236.24c11.72-11.72 30.71-11.72 42.43 0 5.86 5.86 8.79 13.54 8.79 21.21s-2.93 15.36-8.79 21.21L648.05 731.97c-5.85 5.86-13.53 8.79-21.21 8.79z" p-id="5308" fill="#ffffff"></path></svg>
          <div>
            <div className='Instruction-6-chat'>
              <ChatMessage userName={"你"} message={"uno"} isSelf={true} isSystem={false} />
              <ChatMessage userName={""} message={"xxx即将打出倒数第2张牌"} isSelf={false} isSystem={true} />
            </div>
          </div>
          <svg t="1709447209424" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5305" width="20" height="20"><path d="M849.55 515H153.74c-16.57 0-30-13.43-30-30s13.43-30 30-30h695.81c16.57 0 30 13.43 30 30s-13.43 30-30 30z" p-id="5306" fill="#ffffff"></path><path d="M844.56 496.41l-0.19-0.19-235.76-235.76-0.01-0.01-0.01-0.01c-0.15-0.15-0.24-0.24-0.25-0.26-11.79-12.06-11.82-30.63-0.01-42.43 10.26-10.26 28.79-12.95 42.43 0.02l0.01-0.01 0.27 0.27 0.18 0.18c0.07 0.07 0.14 0.13 0.2 0.2L887 453.99l-42.44 42.42z" p-id="5307" fill="#ffffff"></path><path d="M626.84 740.76c-7.68 0-15.36-2.93-21.21-8.79-5.86-5.86-8.79-13.54-8.79-21.21s2.93-15.36 8.79-21.21l236.24-236.24c11.72-11.72 30.71-11.72 42.43 0 5.86 5.86 8.79 13.54 8.79 21.21s-2.93 15.36-8.79 21.21L648.05 731.97c-5.85 5.86-13.53 8.79-21.21 8.79z" p-id="5308" fill="#ffffff"></path></svg>
          <div>
            <UnoCard hashVal={17} />
          </div>
        </div>
      )
    },

    {
      title: "7",
      description: "最后，先打出全部牌的玩家获胜。以上就是UNO的全部规则了！"
    }
  ];

  return (
    <div>

      <Button onClick={() => setInstOpen(true)}>
        <svg t="1709447006417" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4235" width="24" height="24"><path d="M502.8 699.1c-19.4 0-35.2-15.7-35.2-35.2v-26.8c-1.1-23.8 2.1-44.9 9.8-63.3 7.6-18.4 22.8-35 45.5-49.7h-0.9c19.8-15.3 36.5-28.9 50.1-40.8 13.6-11.9 23.5-22.1 29.7-30.6 11.3-14.7 17.6-34.2 18.7-58.6 0.6-14.2-1.9-27-7.2-38.7-5.2-11.3-12.7-22.4-22.5-33.4-0.6-0.6-1.2-1.3-1.8-1.9-20.8-20.3-47.4-30.5-79.8-30.5-31.1 0-56.6 12.3-76.4 37-15.3 19-25.5 46.1-30.7 81.4-2.7 18.7-19.9 31.8-38.6 29.7-19.4-2.2-33.4-19.7-31-39.1 2.4-19.4 6.5-37.3 12.4-53.8 9.3-26 21.9-48 37.8-65.8 15.9-17.8 34.6-31.4 56.1-40.8 21.5-9.3 45-14 70.5-14 53.8 0 97.4 15.9 130.8 47.6 34.5 32.8 51.8 73.6 51.8 122.3 0 18.1-2.4 35-7.2 50.5-4.8 15.6-11.2 29.6-19.1 42-8.5 13-21 27.2-37.4 42.5s-36.8 31.4-61.1 48.4c-11.3 7.9-18.7 15.7-22.1 23.4-3.4 7.6-5.1 19.4-5.1 35.3v27.7c0 19.4-15.7 35.2-35.2 35.2h-1.9z" fill="#ffffff" p-id="4236"></path><path d="M504 772m-36 0a36 36 0 1 0 72 0 36 36 0 1 0-72 0Z" fill="#ffffff" p-id="4237"></path></svg>
      </Button>

      <Tour open={instOpen} onClose={() => setInstOpen(false)} steps={steps} />

    </div>
  );
}

export default Instruction;