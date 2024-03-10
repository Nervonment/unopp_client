import { List } from 'antd';
import VirtualList from 'rc-virtual-list';
import UnoCard from './UnoCard';
import './UnoGameResult.css';

function UnoGameResult({ winner, result, avatarsURL }) {
  return (
    winner ?
      <div className='UnoGameResult'>
        <div className='UnoGameResult-summary'>
          <span style={{ fontWeight: "bold" }}>{winner}</span> 使用 <UnoCard hashVal={result["last_card"]} /> 终结了游戏
        </div>
        <List>
          <VirtualList
            data={result["players"]}
            height={800}
          >
            {(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<img src={avatarsURL[item["name"]]} height={"80px"} width={"80px"} style={{ borderRadius: " 40px" }} alt='avatar' />}
                  title={<span>{item["name"]}</span>}
                  description={<div className='UnoGameResult-cards'>{item["cards"].sort((a, b) => a - b).map((value, key) => <UnoCard hashVal={value} mini={true} key={key} />)}</div>}
                />
              </List.Item>
            )}
          </VirtualList>
        </List>
      </div>
      : <></>
  );
}

export default UnoGameResult;