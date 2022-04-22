module ComunicacaoBGWorker {

    function replacer(key: string, value: object) {
        if (typeof value === "function") {//&& key.match(/Format$/)
            return value.toString();
        }
        return value;
    }

    function createId() {
        return Math.random().toString(36).substring(7);
    }

    export async function getJsonAppCfg() {
        return (await getFromBackGround({
            direction: "from-content-script",
            resolveId: createId(),
            action: { getCfg: true }
        })).msg
    }
    export async function getAppCfg() {
        return <AppCfg>JSON.parse(await getJsonAppCfg());
    }
    export async function saveCfg(cfg: Partial<AppCfg> | AppCfg) {
        return <AppCfg>JSON.parse((await getFromBackGround(
            {
                direction: "from-content-script",
                resolveId: createId(),
                action: { setCfg: { value: JSON.stringify(cfg, replacer, "") } }
            }
        )).msg)
    }
    export async function loadPageConfig(pageKey: pageKeys) {
        return await getFromBackGround({
            direction: "from-content-script",
            resolveId: createId(),
            action: { loadPageConfig: { pageKey: pageKey } }
        })
    }
    export async function resetCfg() {
        return <AppCfg>JSON.parse((await getFromBackGround({
            direction: "from-content-script",
            resolveId: createId(),
            action: { resetAll: true }
        })).msg)
    }


    let arrPromiseResponses: { resolve: (msg: BackGroundEventInit) => void, msg: BackGroundEventInit }[] = [];
    let backGroundMsgCfgReceive = (msg: BackGroundEventInit) => {
        arrPromiseResponses.forEach((curVar, i, arr) => {
            if (curVar.msg.resolveId == msg.resolveId) {
                curVar.resolve(msg);
                arr.splice(i, 1);
                return;
            }
        })

    }
    //"pfdidmjbniobjiekliakeknpghmffpnm",
    let port: chrome.runtime.Port;

    let listenerport = (msg: BackGroundEventInit, _port: chrome.runtime.Port) => {
        if (msg &&
            msg.direction == "from-background-script") {
            if (msg.msg === 'conected') {
                port = _port;
            } else {
                backGroundMsgCfgReceive(msg);
            }

        }
    }

    let listenerondisconect = () => {
        portDisconected = true;
        // getPort()
    }

    let portDisconected = true;



    let waitPort = () => {
        return new Promise<chrome.runtime.Port>((resolve, reject) => {
            let p = chrome.runtime.connect({
                name: 'sei-anexos-port'
            });
            p.onMessage.addListener(listenerport);
            p.onDisconnect.addListener(listenerondisconect);
            let msg: BackGroundEventInit = {
                direction: "from-content-script",
                resolveId: '1',
                msg: "conect"
            }
            p.postMessage(msg);
            let f = (timeout = 1000) => {
                if (port) {
                    resolve(port);
                } else {
                    if (timeout < 0) {
                        console.log('timeout');
                        resolve(null)
                    } else {
                        setTimeout(() => f(timeout - 100), 100);
                    }
                }
            }
            f();
        })
    }




    async function getPort() {
        if (portDisconected) {
            if (port) {
                port.onMessage.removeListener(listenerport);
                port.onDisconnect.removeListener(listenerondisconect);
                port.disconnect();
            }
            port = null;
            port = await waitPort();

            let loopPort = async () => {
                await new Promise<void>((resolve, reject) => {
                    setTimeout(async () => {
                        port = await waitPort();
                        console.log('500ms', port);
                        resolve();
                    }, 500)
                })
                if (!port) await loopPort()
            }
            if (!port) await loopPort()
            portDisconected = false;
            return port;
        } else {
            return port;
        }

    }

    function getFromBackGround(msg: BackGroundEventInit) {
        return new Promise<BackGroundEventInit>(async (resolve, reject) => {
            (await getPort()).postMessage(<BackGroundEventInit>{
                direction: "from-content-script",
                resolveId: msg.resolveId,
                action: msg.action
            });
            arrPromiseResponses.push({ msg: msg, resolve: resolve });

        })
    }

    window.addEventListener("message", async (event) => {
        if (event.source == window &&
            event.data &&
            event.data.direction == "from-page-script") {
            let data: BackGroundEventInit = event.data;
            let response = await getFromBackGround(<BackGroundEventInit>{
                direction: data.direction,
                resolveId: data.resolveId,
                action: data.action
            });
            window.postMessage({
                resolveId: data.resolveId,
                direction: "from-content-script",
                msg: response
            }, "*");
        }
    });

    getPort();
   
}

