import { Avatar } from 'antd';
import UnoCard from './UnoCard';
import { getAvatarURL } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

function UnoGameResult({ winner, result }) {
  return (
    winner ?
      <div className='flex flex-col items-center justify-center w-full h-full'>
        <Avatar src={getAvatarURL(winner["id"])} size={72} />
        <h4>{winner["name"]}</h4>
        <span className='flex items-center gap-2 text-muted-foreground border-b-2 border-b-border mb-2 pb-2'>使用 <UnoCard hashVal={result["last_card"]} mini={true} /> 终结了游戏</span>
        <h6 className='text-center'>剩余手牌</h6>
        <ScrollArea className='max-h-[60%]'>
          <div className='flex flex-col items-start gap-2'>
            {
              result["players"].map((val, idx) => (
                <div key={idx} className='flex items-center gap-2'>
                  <Avatar src={getAvatarURL(val["id"])} size={'large'} />
                  <div>
                    <span>{val["name"]}</span>
                    <div className='flex h-12'>
                      {
                        val["cards"].sort((a, b) => a - b).map((val, idx) => (
                          <UnoCard hashVal={val} mini={true} key={idx} />
                        ))
                      }
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </ScrollArea>
      </div>
      : <></>
  );
}

export default UnoGameResult;