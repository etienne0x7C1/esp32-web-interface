export class WebSocketClientService {
  static ws = new WebSocket(`ws://192.168.187.212/ws`);
  static instances = [];
  static msgData;
  static msgCount = 0;
  static isConnected;
  // service = "";

  // constructor(serviceName: string) {
  //   this.service = serviceName;
  //   // if first instance init
  //   if (!WebSocketClientService.instances.length) WebSocketClientService.init();
  //   WebSocketClientService.instances.push(this);
  // }
  // sendMsg(msgData) {
  //   // const msgData = {};
  //   // msgData[this.service] = serviceData;
  //   // inject service type in message
  //   msgData.service = this.service;
  //   WebSocketClientService.sendData(msgData)
  // }

  static init() {
    console.log("[WebSocketClientService] Init")
    WebSocketClientService.ws.onmessage = this.onMsg;

    WebSocketClientService.ws.onopen = (event) => {
      console.log("[WebSocket] Connection opened");
      WebSocketClientService.isConnected = true;
    };

    WebSocketClientService.ws.onclose = (event) => {
      console.log("[WebSocket] Connection closed");
      WebSocketClientService.isConnected = false;
      // setTimeout(initWebSocket, 2000);
    };
  }

  static onMsg(evt: MessageEvent<any>) {
    // const content = document.createTextNode(event.data);
    //   console.log(event.data);
    WebSocketClientService.msgData = evt.data;
    WebSocketClientService.msgCount++;
    console.log(this.msgData);
  }

  /**
   * Send data to specific service through websockets
   */
  static sendData(data, service?) {
    data.service = service ? service : data.service
    // console.log(`send data to ${data.service} service`, data)
    const msg = JSON.stringify(data);
    try {
      WebSocketClientService.ws.send(msg); //send msg to the server
    } catch (error) {
      console.log(error); // catch error
    }
  }


}
