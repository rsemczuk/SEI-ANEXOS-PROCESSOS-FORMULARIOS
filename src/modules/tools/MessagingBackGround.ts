
class MessagingBackGround {
    private arrPromiseResponses: { resolveId: string, resolve: (value: BackGroundEventInit | PromiseLike<BackGroundEventInit>) => void }[] = [];
    private window: Window;
    constructor() {
        this.window = window;
        this.window.addEventListener("message", async (event) => {
            if (event.data &&
                event.data.direction == "from-content-script") {
                this.backGroundMsgCfgReceive(event.data);
            }
        });

    }
    backGroundMsgCfg = async (msg: BackGroundActions) => {
        let _resolve: (value: BackGroundEventInit | PromiseLike<BackGroundEventInit>) => void;
        let p = new Promise<BackGroundEventInit>((resolve, reject) => {
            _resolve = resolve;
        });
        let _resolveId = Math.random().toString(36).substring(7);
        this.window.postMessage(<BackGroundEventInit>{
            resolveId: _resolveId,
            direction: "from-page-script",
            action: msg
        }, "*");
        this.arrPromiseResponses.push({
            resolveId: _resolveId,
            resolve: _resolve
        });
        let response = await p;
        return response;
    }

    private backGroundMsgCfgReceive = (msg: BackGroundEventInit) => {
        this.arrPromiseResponses.forEach((curVar, i, arr) => {
            if (curVar.resolveId == msg.resolveId) {
                curVar.resolve(msg.msg);
                arr.splice(i, 1);
                return;
            }
        })
    }

    async getCfg(): Promise<AppCfg> {
        let msg: BackGroundActions = {
            getCfg: true
        };
        let response = await this.backGroundMsgCfg(msg);
        return this.normalizeFunctionJson(JSON.parse(response.msg));
    }

    async resetCfg() {
        await this.backGroundMsgCfg({ resetAll: true })
    }

    async setCfg(_cfg: AppCfg, reload = true): Promise<AppCfg> {
        function replacer(key: string, value: object) {
            if (typeof value === "function" && key.match(/Format$/)) {
                return value.toString();
            }
            return value;
        }
        let cfgString = <AppCfg>JSON.parse(JSON.stringify(_cfg, replacer));
        delete cfgString.formulariosConfig;
        delete cfgString.meusTiposDeAnexos;
        delete cfgString.coordenadasPdf;
        delete cfgString.processosConfig;
        let msg: BackGroundActions = { setCfg: {value: JSON.stringify(cfgString) } };
        let response = await this.backGroundMsgCfg(msg);
        let newcfg: AppCfg = JSON.parse(response.msg)
        this.normalizeFunctionJson(newcfg);
        if (reload) AnexosTools.setCfg(newcfg);
        return newcfg;
    }

    async reloadCfg() {
        AnexosTools.setCfg(await this.getCfg());
    }

    normalizeFunctionJson(rawObj: AppCfg) {
        for (let curObjName in rawObj) {
            if (typeof rawObj[curObjName] === 'string') {
                if (curObjName.match(/Format$/)) {
                    let functionString = rawObj[curObjName];
                    rawObj[curObjName] = new Function('window', 'document', 'undefined', 'chrome', 'browser', 'procedimentoTrabalhar', 'procedimentoControlar', "return " + functionString).bind({})();
                    //obj[curObjName] = new Function('window', 'document', 'undefined', "return " + functionString)();
                }
            }
            else if (Array.isArray(rawObj[curObjName])) {
                for (let itenArr of rawObj[curObjName]) {
                    this.normalizeFunctionJson(itenArr);
                }
            }
            else if (typeof rawObj[curObjName] === 'object') {
                this.normalizeFunctionJson(rawObj[curObjName]);
            }
        }
        if (rawObj.formulariosConfig)
            for (let f of rawObj.formulariosConfig) {
                if (f.procurarInserirParagrafos)
                    for (let p of f.procurarInserirParagrafos) {
                        let rx = /^\/(.*)\/([a-zA-Z]*)$/;
                        if (typeof p.textoParaProcurar === 'string' && p.textoParaProcurar.match(rx)) {
                            let rxs = rx.exec(p.textoParaProcurar);
                            if (rxs[2]) {
                                p.textoParaProcurar = new RegExp(rxs[1], rxs[2]);
                            } else {
                                p.textoParaProcurar = new RegExp(rxs[1]);
                            }
                        }
                    }
            }

        return rawObj;
    }
}