module BackGroundPageFormularios {

    let log = (message: string, log: 'home' | 'texto' | 'coordenadas_pdf' | 'processos' | 'formularios', logError = false) => {
        let p = document.createElement('p');
        p.textContent = message;
        if (logError) {
            p.classList.add('bg-danger')
        } else {
            p.classList.add('bg-success')
        }
        document.getElementById(log + '_log').append(p);
    }

    function iniciar() {
        carregarConfiguracaoGeral();
    }

    function normalizedID(nome: string) {
        return nome.replace(/[\(\)\[\]\{\}\*\.\\\- \<\>\:\/]/ig, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }


    function carregarConfiguracaoGeral() {
        document.getElementById('resetAll').onclick = async (e) => {
            e.preventDefault();
            if (confirm('Restaurar?')) {
                await ComunicacaoBGWorker.resetCfg();
            }

        }

        let adicionarGerenciamento = (nome: string, key: keyof AppCfg | "cfgGeral", checarObjeto: (o: AppCfg | string | ProcessoConfig | FormularioConfig | DadosEquiplanoPDF | Param) => boolean) => {

            let _id = normalizedID(nome.toLocaleLowerCase().replace(/ /g, '_'));
            let _btnDownload = `<button class="btn btn btn-outline-success col-3" type="button" id="btn_download_${_id}">Download</button>`;
            let _btnUpload = `<button class="btn btn btn-outline-danger col-3" type="button" id="btn_upload_${_id}">Upload</button>`;
            let _btnEditar = '';

            if ((key === 'meusTiposDeAnexos' || key === 'formulariosConfig')) {
                _btnEditar = `<button class="btn btn btn-outline-secondary col-2" type="button" id="btn_editar_${_id}">Usar o editor</button>`;
                _btnDownload = _btnDownload.replace('col-3', 'col-2');
                _btnUpload = _btnUpload.replace('col-3', 'col-2');
            }

            let _html = `
        <div class="border border-1 border-dark row justify-content-center">
            <div class="p-3 input-group col-10 row">
                <label class="input-group-text col-6 bg-white">${nome}</label>
                ${_btnDownload}
                ${_btnUpload}
                ${_btnEditar}
            </div>
            <input hidden="true "class="invisible" type="file" id="input_upload_${_id}" accept=".json"></input>
        </div>`;
            document.getElementById('home').insertAdjacentHTML('afterbegin', _html);

            let _input_upload = document.getElementById('input_upload_' + _id);
            _input_upload.onchange = async (ev) => {
                let _file = ev.target.files[0];
                let _jsonObject = <AppCfg[keyof AppCfg] | AppCfg>JSON.parse(await _file.text());

                if (_jsonObject && Array.isArray(_jsonObject)) {

                    let _dados = [];
                    for (let o of _jsonObject) {
                        if (checarObjeto(o)) {
                            _dados.push(o);
                        } else {
                            log('A configuração não possúi os requisitos mínimos e foi descartada: ' + JSON.stringify(o, null, '    '), 'home', true);
                        }
                    }
                    if (_dados.length > 0) {

                        let dados = await ComunicacaoBGWorker.saveCfg({ [key]: _dados });
                        if (dados[key].length > 0) {
                            log('Configuração para inserção de ' + nome + ' foi salva com sucesso', 'home');
                        }
                    }
                } else if (key === 'cfgGeral') {
                    ;
                    let dados = await ComunicacaoBGWorker.saveCfg(<AppCfg>_jsonObject);
                    if (dados) {
                        log('Configuração para inserção de ' + nome + ' foi salva com sucesso', 'home');
                    }
                } else {
                    log('A configuração enviada possui erros!', 'home', true);
                }
            }
            let _btn_upload = document.getElementById('btn_upload_' + _id);
            _btn_upload.onclick = () => {
                _input_upload.click();
            }

            let _btn_editar = document.getElementById('btn_editar_' + _id);
            if (_btn_editar) _btn_editar.onclick = () => {
                let page: "texto" | "formularios";
                switch (key) {
                    case 'meusTiposDeAnexos':
                        page = 'texto';
                        break;
                    case 'coordenadasPdf':
                        break;
                    case 'processosConfig':
                        break;
                    case 'formulariosConfig':
                        page = 'formularios';
                        break;
                    default:
                        break;
                }
                if (page) ComunicacaoBGWorker.loadPageConfig(page);
            }
            let _btn_download = document.getElementById('btn_download_' + _id);
            _btn_download.onclick = async () => {
                let _appCfg = await ComunicacaoBGWorker.getAppCfg();
                let dados: AppCfg | AppCfg[keyof AppCfg];
                if (key === 'cfgGeral') {
                    dados = _appCfg;
                    if ((<AppCfg>dados).anexosExistentes) delete (<AppCfg>dados).anexosExistentes;
                    if ((<AppCfg>dados).formulariosExistentes) delete (<AppCfg>dados).formulariosExistentes;
                    if ((<AppCfg>dados).versao_extensao) delete (<AppCfg>dados).versao_extensao;
                    let arr: { key: string, value: object }[] = [];
                    for (let key in <AppCfg>dados) {
                        arr.push({ key: key, value: dados[key] })
                    }
                    arr = arr.sort((a, b) => {
                        return (a.key).localeCompare(b.key);
                    });
                    arr = arr.sort((a, b) => {
                        return (typeof a.value).localeCompare(typeof b.value);
                    });
                    let a = {};
                    for (let item of arr) {
                        a[item.key] = item.value;
                    }
                    dados = a;
                } else {
                    dados = _appCfg[key];
                }
                AnexosTools.download(_id + '.json', JSON.stringify(dados, null, '    '), 'text/json');
            }
        }
        adicionarGerenciamento('Todas configurações', 'cfgGeral', (o: AppCfg) => { return true; });
        adicionarGerenciamento('Configurações para capturar dados a partir de Arquivos PDF', 'coordenadasPdf', (o: DadosEquiplanoPDF) => { return typeof o.pdfContain === 'string' && typeof o.nomeAnexo === 'string' && typeof o.pdfPage === 'number' })
        adicionarGerenciamento('Configurações para gerar Processos', 'processosConfig', (o: ProcessoConfig) => { return typeof o.btnAlterarProcesso === 'boolean' && typeof o.btnGerarProcessoRelacionado === 'boolean' })
        adicionarGerenciamento('Configurações para gerar Formulários', 'formulariosConfig', (o: FormularioConfig) => { return typeof o.nomeFormulario === 'string' && typeof o.btnGerarFormulario === 'boolean' && typeof o.descricaoDoFormulario === 'string' })
        adicionarGerenciamento('Configurações para capturar dados a partir do nome ou texto do arquivo', 'meusTiposDeAnexos', (o: Param) => { return typeof o.flags === 'string' && typeof o.dados.nomeAnexo === 'string' && typeof o.rx === 'string' })
    }



    onload = () => {
        iniciar();
    }


}

