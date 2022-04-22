declare function importScripts(script: string, ...string: string[]): void;
self.importScripts("Dados.js");



module AppBG {


    function replacer(key: string, value: object) {
        if (typeof value === "function") {//&& key.match(/Format$/)
            return value.toString();
        }
        return value;
    }


    async function resetCfg() {
        let raw = getRawCfg();
        for (let key in raw) {
            let __cfg = { [key]: '' };
            cfg[key] = raw[key];
            await _localStorageDeleteItem(__cfg);
        }
    }

    async function getJsonAppCfg(): Promise<string> {
        return JSON.stringify(await getAppCfg(), replacer);
    }

    let cfg: AppCfg

    async function getAppCfg(rawCfg = getRawCfg()): Promise<AppCfg> {
        if (!cfg) cfg = <AppCfg>{};
        // await resetCfg();
        for (let key in rawCfg) {
            let dbItem = (await _localStorageGetItem(key));
            let stringCfg = (typeof dbItem === "object" ? dbItem.valor : '');
            let curCfg: AppCfg[keyof AppCfg] | AppCfg;
            //salvar na memória a configuração se não existir ou se não for uma string ou se for uma string vazia
            if (!(stringCfg && typeof stringCfg === "string" && stringCfg.length > 0)) {
                await _localStorageAddItem({ [key]: rawCfg[key] });
                curCfg = rawCfg[key];
            } else {
                curCfg = JSON.parse(stringCfg);
            }
            switch (key) {
                case 'coordenadasPdf':
                    if (!Array.isArray(curCfg) || curCfg.length === 0) curCfg = rawCfg.coordenadasPdf;
                    break;
                case 'copiar_lista':
                    break;
                case 'anexosExistentes':
                    break;
                case 'formulariosExistentes':
                    break;
                case 'inserir_drop_zone':
                    break;
                case 'testar_formulario':
                    break;
                case 'copiar_lista_numerada':
                    break;
                case 'filtrar_processos':
                    break;
                case 'prazo_processos':
                    break;
                case 'formulariosConfig':
                    if (!Array.isArray(curCfg) || curCfg.length === 0) curCfg = rawCfg.formulariosConfig;
                    break;
                case 'inserir_anexos':
                    break;
                case 'meusTiposDeAnexos':
                    if (!Array.isArray(curCfg) || curCfg.length === 0) curCfg = rawCfg.meusTiposDeAnexos;
                    break;
                case 'processosConfig':
                    if (!Array.isArray(curCfg) || curCfg.length === 0) curCfg = rawCfg.processosConfig;
                    break;
                case 'formatacaoParagrafos':
                    if (!Array.isArray(curCfg) || curCfg.length === 0) curCfg = rawCfg.formatacaoParagrafos;
                    break;
                default:
                    // console.log('handler não encontrado: ' + key)
                    break;
            }
            cfg[key] = curCfg;
        }

        // fix dados
        let salvar = false;


        cfg.meusTiposDeAnexos.forEach((_parametroEditado) => {
            //converter dados versões anteriores 0.5.3 para a atual
            if (!_parametroEditado.dados) {
                _parametroEditado.dados = {
                    inserirAnexo: true,
                    nomeAnexo: [],
                    atualizarJuntoComAExtensao: false,
                    hipoteseLegal: '',
                    nivelAcesso: 'público'
                };
                salvar = true;
            }
            if (typeof (<Anexo><any>_parametroEditado).atualizarJuntoComAExtensao === 'boolean') {
                _parametroEditado.dados.atualizarJuntoComAExtensao = (<Anexo><any>_parametroEditado).atualizarJuntoComAExtensao;
                delete (<Anexo><any>_parametroEditado).atualizarJuntoComAExtensao;
                salvar = true;
            }
            if (typeof (<Anexo><any>_parametroEditado).inserirAnexo === 'boolean') {
                _parametroEditado.dados.inserirAnexo = (<Anexo><any>_parametroEditado).inserirAnexo;
                delete (<Anexo><any>_parametroEditado).inserirAnexo;
                salvar = true;
            }
            if ((<Anexo><any>_parametroEditado).nomeAnexo) {
                _parametroEditado.dados.nomeAnexo = (<Anexo><any>_parametroEditado).nomeAnexo;
                delete (<Anexo><any>_parametroEditado).nomeAnexo;
                salvar = true;
            }
            if (typeof _parametroEditado.dados.nivelAcesso !== 'string' || _parametroEditado.dados.nivelAcesso.length === 0) _parametroEditado.dados.nivelAcesso = 'público';
            if (typeof _parametroEditado.dados.hipoteseLegal !== 'string') _parametroEditado.dados.hipoteseLegal = '';
            if (typeof _parametroEditado.dados.atualizarJuntoComAExtensao !== 'boolean') _parametroEditado.dados.atualizarJuntoComAExtensao = true;

        })



        
        if (salvar) {
            _localStorageAddItem(cfg);
        }



        return cfg;
    }

    function getRawCfg(): AppCfg {
        return {
            versao_extensao: chrome.runtime.getManifest().version,
            sempre_mostrar_check_copy: true,
            mostrar_copy: true,
            manter_atualizado_procedimentos: true,
            testar_formulario: false,
            inserir_drop_zone: true,
            inserir_anexos: true,
            alterar_acesso_documento: true,
            copiar_link_externo: true,
            copiar_lista: false,
            copiar_lista_numerada: false,
            filtrar_processos: true,
            prazo_processos: true,
            formatarNumeroAnexoNumeros: false,
            formatarNumeroAnexoDiaMesAno: true,
            formatarNumeroAnexoMesAno: true,
            restritoSeEncontrarCPF: true,
            meusTiposDeAnexos: DefaultData.parametroAnexos,
            anexosExistentes: [],
            formulariosExistentes: [],
            todosAnexosFormularios: [],
            processosDisponiveis: [],
            processosExistentes: [],
            hipotesesExistentes: [],
            formulariosConfig: DefaultData.formulariosConfig,
            processosConfig: DefaultData.processosConfig,
            coordenadasPdf: DefaultData.coordenadasDocumentos,
            textoPadrao: DefaultData.textoPadrao,
            formatacaoParagrafos: []
        };
    }


    let pages = {
        texto: 'texto.html',
        formularios: 'formularios.html',
        json: 'json.html',
        pdf: 'pdf.html',
        processos: 'processos.html',
        main: 'main.html'

    }


    function loadPageConfig(pageKey: pageKeys) {
        return new Promise<chrome.tabs.Tab>((resolve, reject) => {
            chrome.tabs.create({
                'url': 'configuracoes/' + pages[pageKey]
            }, (tab) => { resolve(tab) });
        })
    }

    function download(filename: string, text: string, type: 'text/plain' | 'text/json') {

        let element = document.createElement('a');
        element.setAttribute('href', 'data:' + type + 'charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }



    async function iniciar() {
        chrome.runtime.onConnect.addListener((port) => {
            if (port.name === 'sei-anexos-port')
                port.onMessage.addListener(async (msg: BackGroundEventInit, port) => {
                    try {
                        if (msg.direction === "from-content-script") {
                            let response: BackGroundEventInit = {
                                direction: "from-background-script",
                                resolveId: msg.resolveId,
                                msg: "",
                            };
                            if (msg.msg === "conect") {
                                response.msg = "conected";
                                port.postMessage(response);
                            } else if (msg.action.getCfg) {
                                response.msg += await getJsonAppCfg();
                                port.postMessage(response)
                            } else if (msg.action.setCfg) {
                                let cfg = <AppCfg>JSON.parse(msg.action.setCfg.value);
                                await _localStorageAddItem(cfg);
                                response.msg += await getJsonAppCfg();
                                port.postMessage(response)

                            } else if (msg.action.resetAll) {
                                await resetCfg();
                                response.msg += await getJsonAppCfg();
                                port.postMessage(response)

                            } else if (msg.action.loadPageConfig) {
                                loadPageConfig(msg.action.loadPageConfig.pageKey);
                                port.postMessage("true");
                            } else {
                                port.postMessage(msg);
                            }
                        }
                    } catch (error) {
                        console.log(error);

                    }

                })

        });

        let _appCfg = await getAppCfg();

        // let rawCfg = getRawCfg();

        // if (typeof _appCfg.copiar_lista === 'boolean') {
        //     rawCfg.copiar_lista = _appCfg.copiar_lista;
        // }
        // if (typeof _appCfg.copiar_lista_numerada === 'boolean') {
        //     rawCfg.copiar_lista_numerada = _appCfg.copiar_lista_numerada;
        // }

        // if (typeof _appCfg.filtrar_processos === 'boolean') {
        //     rawCfg.filtrar_processos = _appCfg.filtrar_processos;
        // }

        // if (typeof _appCfg.prazo_processos === 'boolean') {
        //     rawCfg.prazo_processos = _appCfg.prazo_processos;
        // }

        // if (typeof _appCfg.inserir_anexos === 'boolean') {
        //     rawCfg.inserir_anexos = _appCfg.inserir_anexos;
        // }

        // if (typeof _appCfg.mostrar_copy === 'boolean') {
        //     rawCfg.mostrar_copy = _appCfg.mostrar_copy;
        // }

        // if (typeof _appCfg.sempre_mostrar_check_copy === 'boolean') {
        //     rawCfg.sempre_mostrar_check_copy = _appCfg.sempre_mostrar_check_copy;
        // }

        // if (typeof _appCfg.inserir_drop_zone === 'boolean') {
        //     rawCfg.inserir_drop_zone = _appCfg.inserir_drop_zone;
        // }

        // if (typeof _appCfg.manter_atualizado_procedimentos === 'boolean') {
        //     rawCfg.manter_atualizado_procedimentos = _appCfg.manter_atualizado_procedimentos;
        // }

        // if (typeof _appCfg.testar_formulario === 'boolean') {
        //     rawCfg.testar_formulario = _appCfg.testar_formulario;
        // }

        // rawCfg.textoPadrao = { ...rawCfg.textoPadrao, ..._appCfg.textoPadrao };//mesclar para incluir novas variaveis  quando atualizar

        // if (_appCfg.anexosExistentes && Array.isArray(_appCfg.anexosExistentes)) rawCfg.anexosExistentes = _appCfg.anexosExistentes;
        // if (_appCfg.formulariosExistentes && Array.isArray(_appCfg.formulariosExistentes)) rawCfg.formulariosExistentes = _appCfg.formulariosExistentes;
        // if (_appCfg.formatacaoParagrafos && Array.isArray(_appCfg.formatacaoParagrafos)) rawCfg.formatacaoParagrafos = _appCfg.formatacaoParagrafos;

        // // if (cfgGeral.coordenadasPdf && Array.isArray(cfgGeral.coordenadasPdf) && cfgGeral.coordenadasPdf.length > 0) rawCfg.coordenadasPdf = cfgGeral.coordenadasPdf;
        // // if (cfgGeral.formulariosConfig && Array.isArray(cfgGeral.formulariosConfig) && cfgGeral.formulariosConfig.length > 0) rawCfg.formulariosConfig = cfgGeral.formulariosConfig;
        // // if (cfgGeral.meusTiposDeAnexos && Array.isArray(cfgGeral.meusTiposDeAnexos) && cfgGeral.meusTiposDeAnexos.length > 0) rawCfg.meusTiposDeAnexos = cfgGeral.meusTiposDeAnexos;
        // // if (cfgGeral.processosConfig && Array.isArray(cfgGeral.processosConfig) && cfgGeral.processosConfig.length > 0) rawCfg.processosConfig = cfgGeral.processosConfig;


        // rawCfg.formulariosConfig.forEach((cur, index, rawArr) => {
        //     let curCfg = _appCfg.formulariosConfig.find(_curRaw => {
        //         return _curRaw.nome === cur.nome;
        //     });
        //     if (curCfg) {//&& !curCfg.atualizarJuntoComAExtensao
        //         rawArr[index] = curCfg;
        //     }
        // });
        // rawCfg.processosConfig.forEach((cur, index, rawArr) => {
        //     let curCfg = _appCfg.processosConfig.find(_curRaw => {
        //         return _curRaw.nome === cur.nome;
        //     });
        //     if (curCfg) {
        //         rawArr[index] = curCfg;
        //     }
        // });
        // rawCfg.meusTiposDeAnexos.forEach((cur, index, rawArr) => {
        //     let curCfg = _appCfg.meusTiposDeAnexos.find(_curRaw => {
        //         return _curRaw.nomeParametro === cur.nomeParametro;
        //     });
        //     if (curCfg) {
        //         rawArr[index] = curCfg;
        //     }
        // });

        // rawCfg.coordenadasPdf.forEach((cur, index, rawArr) => {
        //     let curCfg = _appCfg.coordenadasPdf.find(_curRaw => {
        //         return _curRaw.nomeCoordenada === cur.nomeCoordenada;
        //     });
        //     if (curCfg) {
        //         rawArr[index] = curCfg;
        //     }
        // });
        // await _localStorageAddItem(rawCfg);



        // log(appCfg);
        // log(rawCfg);
        // atualizar procedimentos com a nova versão
        // if (_appCfg.manter_atualizado_procedimentos && _appCfg.versao_extensao !== rawCfg.versao_extensao) {
        // }
        // resetCfg('cfgGeral');
        // getCfg('cfgGeral');
    }

    type DBItem = { item: string, valor: string };


    let _localStorageAddItem = (appCfg: AppCfg | Partial<AppCfg>) => {
        return new Promise<void>((resolve, reject) => {
            for (let key in appCfg) {
                cfg[key] = appCfg[key];
                let valor = JSON.stringify(appCfg[key], replacer, '');
                chrome.storage.local.set({ [key]: valor }, resolve)
            }

        })
    }
    let _localStorageDeleteItem = async (appCfg: AppCfg | Partial<AppCfg>) => {
        for (let key in appCfg) {
            await new Promise<void>((resolve, reject) => {
                chrome.storage.local.remove(key, resolve);
            })

        }
    }
    let _localStorageGetItem = (key: string) => {
        return new Promise<DBItem>(async (resolve, reject) => {
            chrome.storage.local.get(key, (itens) => {
                resolve({
                    item: key,
                    valor: itens[key]
                })
            })
        })

    }
    iniciar();




    // //testar se é problema do worker dormir
    // let lifeline: chrome.runtime.Port;


    // chrome.runtime.onConnect.addListener(port => {
    //     if (port.name === 'keepAlive') {
    //         lifeline = port;
    //         setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
    //         port.onDisconnect.addListener(keepAliveForced);
    //     }
    // });

    // function keepAliveForced() {
    //     lifeline?.disconnect();
    //     lifeline = null;
    //     keepAlive();
    // }

    // async function keepAlive() {
    //     if (lifeline) return;
    //     for (const tab of await chrome.tabs.query({ url: '*://*/*' })) {
    //         try {
    //             await chrome.scripting.executeScript({
    //                 target: { tabId: tab.id },
    //                 function: () => chrome.runtime.connect({ name: 'keepAlive' }),
    //                 // `function` will become `func` in Chrome 93+
    //             });
    //             chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
    //             return;
    //         } catch (e) { }
    //     }
    //     chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
    // }

    // async function retryOnTabUpdate(tabId: number, info: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
    //     if (info.url && /^(file|https?):/.test(info.url)) {
    //         keepAlive();
    //     }
    // }

    // keepAlive();

}
