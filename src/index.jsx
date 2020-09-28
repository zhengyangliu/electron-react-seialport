import React from 'react';
import ReactDOM from 'react-dom';
import ReactWebsocket from './websocket.jsx';
import bindAll from 'lodash.bindall';

class Board extends React.Component {

    constructor() {
        super();
        bindAll(this, [
            'handleClickConnect',
            'handleClickSend',
            'onMessage',
            'onOpen',
            'onClose'
        ]);
        this.state = {
            count: 0,
            connect_disable: true,
            send_disable: true
        };
    }

    handleClickConnect() {
        this.setState({
            count: this.state.count + 1
        })

        var cmd = {};
        cmd.method = "open";
        var param = {};
        param.path = "COM3";
        param.baudRate = 9600;
        param.dataBits = 8;
        param.stopBits = 1;
        param.autoOpen = false;
        cmd.data = param;
        this.refWebSocket.sendMessage(JSON.stringify(cmd));
    }

    handleClickSend() {
        var cmd = {};
        cmd.method = "write";
        cmd.data = "AAA";
        this.refWebSocket.sendMessage(JSON.stringify(cmd));
    }

    onMessage(msg) {
        // console.log(msg);
        var method = JSON.parse(msg).method;
        var data = JSON.parse(msg).data;

        if (method == 'list') {
            console.log('list: ' + data);
        }
        else if (method == 'open-failed') {
            console.log('open-failed: ' + data);
        }
        else if (method == 'open-success') {
            console.log('open-success');
            this.setState({
                send_disable: false
            })
        }
        else if (method == 'recive') {
            console.log('recive: ' + data.data);
        }
        else if (method == 'unplug') {
            console.log('unplug');
            this.setState({
                send_disable: true
            })
        }
    }

    onOpen() {
        this.setState({
            connect_disable: false
        })
    }

    onClose() {
        this.setState({
            connect_disable: true
        })
    }

    render() {
        return (
            <div>
                <div>
                    <button clss='click-connect' onClick={this.handleClickConnect} disabled={this.state.connect_disable}>{'连接' + this.state.count}</button>
                    <button clss='click-send' onClick={this.handleClickSend} disabled={this.state.send_disable}>发送</button>
                </div>
                <div>
                    <ReactWebsocket
                        url='ws://localhost:3000/'
                        onMessage={this.onMessage} //接受信息的回调
                        onOpen={this.onOpen} //websocket打开
                        onClose={this.onClose} //websocket关闭
                        reconnect={true}
                        debug={true}
                        ref={Websocket => {
                            this.refWebSocket = Websocket;
                        }}
                    />
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);