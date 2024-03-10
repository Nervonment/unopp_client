import './Self.css';
import { useEffect, useRef, useState } from 'react';
import { get, getId, getUserName, post } from './utils';
import { Button, Input, Space, message } from 'antd';
import { httpPort, server } from './config';
import { LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


function Self() {
  const [imageUrl, setImageUrl] = useState();
  const avatarRef = useRef();

  const handleChangeIcon = (e) => {
    if (e.target.files.length === 1) {

      let file = e.target.files[0];

      let reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);

        avatarRef.current.onload = () => {

          // 压缩图片为128px
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');
          canvas.width = 128;
          canvas.height = 128;
          context.clearRect(0, 0, 128, 128);
          context.drawImage(avatarRef.current, 0, 0, 128, 128);

          canvas.toBlob(
            (blob) => {
              const data = new FormData();
              data.append('file', blob);
              fetch("http://" + server + ":" + httpPort + "/upload-icon", {
                method: "POST",
                body: data,
                credentials: "include",
                mode: "cors",
              })
                .then((response) => {
                  response.text().then(
                    (text) => {
                      if (text === "SUCCESS")
                        messageApi.open({
                          type: 'success',
                          content: '上传成功',
                        });
                      else
                        messageApi.open({
                          type: 'error',
                          content: '上传失败',
                        });
                    }
                  )
                })
                .catch((e) => { console.log(e); });
            }
          );
        }
      }

      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    get("/icon", { "id": getId() }, false)
      .then((response) => {
        response.blob().then(
          (blob) => {
            let reader = new FileReader();
            reader.addEventListener('load', () => setImageUrl(reader.result));
            reader.readAsDataURL(blob);
          }
        );
      })
      .catch((e) => { console.log(e); });
  }, []);

  const [userName, setUserName] = useState(getUserName());
  const [messageApi, contextHolder] = message.useMessage();

  const handleChageName = () => {
    if (userName.indexOf(';') !== -1) {
      messageApi.open({
        type: 'warning',
        content: '名字中不能包含\';\'',
      });
      return;
    }

    post('/set-name', { "user_name": userName })
      .then((response) => {
        if (response === "SUCCESS")
          messageApi.open({
            type: 'success',
            content: '修改成功',
          });
        else if (response === "USERNAME_DUPLICATE")
          messageApi.open({
            type: 'error',
            content: '名字重复',
          });
        else
          messageApi.open({
            type: 'error',
            content: '修改失败',
          });
      })
      .catch((e) => console.log(e));
  };

  const navigate = useNavigate();

  return (
    <div className='Self'>
      <Button
        size='large'
        shape="circle"
        style={{ position: 'absolute', left: "20px", top: "20px" }}
        onClick={() => navigate("/")}
      >
        <LeftOutlined />
      </Button>

      {contextHolder}
      <div>
        <div className='Self-avatar'>
          {
            imageUrl ?
              <img ref={avatarRef} src={imageUrl} height={"100px"} width={"100px"} style={{ borderRadius: "50px" }} alt='avatar' />
              : <LoadingOutlined style={{ fontSize: "64px" }} />
          }
        </div>
        <input
          type="file"
          id="Self-upload"
          multiple
          accept="image/png,.jpg"
          onChange={handleChangeIcon}
          className="visually-hidden" />
        <Button size='large'>
          <label style={{ cursor: "pointer" }} htmlFor="Self-upload">上传头像</label>
        </Button>
      </div>

      <div>
        <label style={{ padding: "6px" }}>修改你的名字</label>
        <Space.Compact>
          <Input
            size='large'
            value={userName}
            placeholder='输入新名字～(∠・ω< )⌒☆'
            onChange={(e) => setUserName(e.target.value)}
          />
          <Button size='large' type='primary' onClick={handleChageName}>修改</Button>
        </Space.Compact>
      </div>
    </div>
  );
}

export default Self;