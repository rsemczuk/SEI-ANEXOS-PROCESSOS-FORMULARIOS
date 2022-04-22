

module BackGroundPageFormularios {

    let addEventsInput = (input: HTMLElement | HTMLElement[], funcao: () => void) => {
        if (Array.isArray(input)) {
            input.forEach((_input) => {
                _input.onchange = funcao;
                _input.onkeydown = funcao;
                _input.onkeyup = funcao;
            })
        } else {
            input.onchange = funcao;
            input.onkeydown = funcao;
            input.onkeyup = funcao;
        }
    }
    let tomSettings: Partial<TomSettings> = {
        persist: false,
        create: true,
        plugins: {
            remove_button: {
                title: 'Remover',
            },
            clear_button: {
                title: 'Limpar lista',
            }
        },

    };

    function log(message: string, logError = false) {
        let p = document.createElement('p');
        p.textContent = message;
        if (logError) {
            p.classList.add('bg-danger')
        } else {
            p.classList.add('bg-success')
        }
        document.getElementById('log').append(p);
    }

    function getProcesso(cfg: AppCfg, nome: string) {
        for (let processo of cfg.processosConfig) {
            if (processo.nome === nome) return processo;
        }
    }
    function getFormulario(cfg: AppCfg, nome: string) {
        for (let formulario of cfg.formulariosConfig) {
            if (formulario.nome === nome) return formulario;
        }
    }
    function iniciar() {
        carregarFuncoes();
    }

    function normalizedID(nome: string) {
        return nome.replace(/[\(\)\[\]\{\}\*\.\\\- \<\>\:\/]/ig, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    let cfg: AppCfg;
    async function carregarFuncoes() {
        cfg = await ComunicacaoBGWorker.getAppCfg();
        AnexosTools.setCfg(cfg);
        // SELECIONAR ELEMENTOS DO PARAMETRO
        let _select_editar_parametro = <HTMLSelectElement>document.getElementById('select_editar_parametro');
        let _parametro_principal = <HTMLDivElement>document.getElementById('parametro_principal');

        let _principalNomeParametro = <HTMLInputElement>_parametro_principal.querySelector('#nomeParametro');

        let _nivelAcesso = <HTMLSelectElement>_parametro_principal.querySelector('#nivelAcesso');
        let _hipoteseLegal = <HTMLSelectElement>_parametro_principal.querySelector('#hipoteseLegal');



        let _principalUnidadesDeTrabalho = <HTMLSelectElement>_parametro_principal.querySelector('#unidadesDeTrabalho');
        let _principalDesativado = <HTMLInputElement>_parametro_principal.querySelector('#desativado');
        let _principalAtualizarJuntoComAExtensao = <HTMLInputElement>_parametro_principal.querySelector('#atualizarJuntoComAExtensao');
        let _principalInserirAnexo = <HTMLInputElement>_parametro_principal.querySelector('#inserirAnexo');
        let _principalLerArquivoComoTexto = <HTMLInputElement>_parametro_principal.querySelector('#lerArquivoComoTexto');
        let _principalExemploUtilizado = <HTMLInputElement>_parametro_principal.querySelector('#exemploUtilizado');


        // SELECIONAR OUTROS ITENS
        let _outros_parametros = document.getElementById('outros_parametros');
        let _principalValorSaida = <HTMLParagraphElement>document.getElementById('valorSaida');
        let _btn_editar_parametro = document.getElementById('btn_editar_parametro');
        let inputFileTentarLerArquivo = document.getElementById('input_tentar_ler_arquivo_como_texto');
        let btn_add_modelo_parametro = document.getElementById('btn_add_modelo_parametro');


        let _btn_salvar_parametro = <HTMLButtonElement>document.querySelector('#btn_salvar_parametro');
        let _btn_adicionar_parametro = <HTMLButtonElement>document.querySelector('#btn_adicionar_parametro');
        let _btn_excluir_parametro = <HTMLButtonElement>document.querySelector('#btn_excluir_parametro');
        let _btn_limpar_parametro = <HTMLButtonElement>document.querySelector('#btn_limpar_parametro');

        let _btn_download = <HTMLButtonElement>document.querySelector('#btn_download');
        let _btn_upload = <HTMLButtonElement>document.querySelector('#btn_upload');
        let _input_upload = <HTMLButtonElement>document.querySelector('#input_upload');


        let _hipotesesCarregadas = <HTMLDataListElement>document.querySelector('#hipotesesCarregadas');
        cfg.hipotesesExistentes.forEach((h) => {
            let op = document.createElement('option');
            op.innerText = h;
            op.value = h;
            _hipotesesCarregadas.append(op);
        })

        _btn_download.onclick = () => {
            AnexosTools.download("regex_cfg_" + AnexosTools.normalizedID(_parametroEditado.nomeParametro) + '.json', JSON.stringify(_parametroEditado, null, '    '), 'text/json');
        }

        _btn_upload.onclick = () => {
            _input_upload.click();
        }

        _input_upload.onchange = async (e) => {
            if (e.target.files?.length > 0) {
                let file = e.target.files[0];
                let _jsonObject = <Param>JSON.parse(await file.text());

                if (typeof _jsonObject.dados.atualizarJuntoComAExtensao === 'boolean' &&
                    typeof _jsonObject.dados.inserirAnexo === 'boolean' &&
                    typeof _jsonObject.desativado === 'boolean' &&
                    typeof _jsonObject.descricao === 'string' &&
                    typeof _jsonObject.nomeParametro === 'string'
                ) {
                    carregarParamPrincipal(_jsonObject);
                }

            }

            try {
                _input_upload.type = 'text';
                _input_upload.type = 'file';
            } catch (error) {
                console.log(error);
            }

        }



        _btn_editar_parametro.onclick = () => {
            let f = cfg.meusTiposDeAnexos.filter((a) => {
                return a.nomeParametro === _select_editar_parametro.value;
            });
            if (f.length > 0) {
                carregarParamPrincipal(f[0])
                log("Configuração carregada com sucesso");
            } else if (_select_editar_parametro.value === '') {
                carregarParamPrincipal()
            }
        }

        function checkErrors() {
            return false;
        }

        _btn_salvar_parametro.onclick = async () => {
            if (checkErrors()) {
                return;
            }
            cfg.meusTiposDeAnexos.every((p, i, arr) => {
                if (getParametro() === p) {
                    Object.assign(p, _parametroEditado);
                    return false;
                }
                return true;
            })
            cfg = await ComunicacaoBGWorker.saveCfg(cfg);
            log("Configuração salva com sucesso");
        }

        _btn_adicionar_parametro.onclick = async () => {
            if (checkErrors()) {
                return;
            }
            if (!cfg.meusTiposDeAnexos.every((f, i, arr) => {
                if (_parametroEditado.nomeParametro === f.nomeParametro) {
                    return false;
                }
                return true;
            })) {
                _principalNomeParametro.focus();
                alert("Existe um formulário com este mesmo nome, favor alterar e tentar novamente")
            } else {
                let _f: Param = JSON.parse(JSON.stringify(_parametroEditado));
                cfg.meusTiposDeAnexos.push(_f);
                cfg = await ComunicacaoBGWorker.saveCfg(cfg);
                carregarParamPrincipal(_f);
                _principalNomeParametro.focus();
                log("Configuração adicionada com sucesso");
            }
        }


        _btn_excluir_parametro.onclick = async () => {
            cfg.meusTiposDeAnexos.every((f, i, arr) => {
                if (getParametro() === f) {
                    cfg.meusTiposDeAnexos.splice(i, 1);
                    return false;
                }
                return true;
            })
            cfg = await ComunicacaoBGWorker.saveCfg(cfg);
            carregarParamPrincipal(_parametroEditado);
            _principalNomeParametro.focus();
            log("Configuração excluida com sucesso");

        }

        _btn_limpar_parametro.onclick = async () => {
            if (confirm("Confirma limpar o formulário, todas as alterações serão perdidas"))
                carregarParamPrincipal();

        }

        function getParametroEmBranco(): Param {
            return {
                desativado: false,
                unidadesDeTrabalho: [],

                exemploUtilizado: "",
                descricao: '',
                flags: '',
                lerArquivoComoTexto: false,
                nomeParametro: '',
                dados: {
                    inserirAnexo: true,
                    nomeAnexo: [],
                    atualizarJuntoComAExtensao: false,
                    hipoteseLegal: '',
                    nivelAcesso: 'público'
                },
                rx: '',

                nomeGrupo: '',
                nomeLista: '',

                outrosParametros: [
                    {
                        flags: '',
                        descricao: '',
                        rx: '',
                        nomeGrupo: '',
                        nomeLista: ''
                    }
                ]
            }

        }


        let _outros_parametros_model = document.getElementById('outros_parametros_model');
        _outros_parametros_model.remove();


        function createSubParametro(param: SubParam = {
            rx: '',
            descricao: '',
            flags: '',
            nomeGrupo: '',
            nomeLista: ''
        }, _html?: HTMLDivElement) {


            if (!_html) {
                _html = <HTMLDivElement>_outros_parametros_model.cloneNode(true)
                _outros_parametros.append(_html);
            }



            /**
              * mudar cores
              */

            let changeColor = (el: HTMLElement, condicao: boolean) => {
                if (condicao) {
                    el.style.color = 'red'
                    el.style.borderColor = 'red'
                    el.style.borderWidth = '2px'
                    // el.style.backgroundColor = 'red'
                } else {
                    el.style.color = 'green'
                    el.style.borderColor = 'green'
                    el.style.borderWidth = '2px'
                    // el.style.backgroundColor = 'green'
                }
            }
            let checkRegexPattern = (pattern: string, regexFlags: string) => {
                try {
                    new RegExp(pattern, regexFlags);
                    return true;
                }
                catch (error) {
                    return false;
                }
            }

            let rx = <HTMLInputElement>_html.querySelector('#rx');
            let descricao = <HTMLInputElement>_html.querySelector('#descricao');
            let flags = <HTMLInputElement>_html.querySelector('#flags');
            let nomeLista = <HTMLInputElement>_html.querySelector('#nomeLista');
            let nomeGrupo = <HTMLInputElement>_html.querySelector('#nomeGrupo');
            let excluir_adicional = <HTMLButtonElement>_html.querySelector('#excluir_adicional');


            if (excluir_adicional)
                excluir_adicional.onclick = () => {
                    _parametroEditado.outrosParametros.every((p, i, arr) => {
                        if (p === param) {
                            arr.splice(i, 1);
                            _html.remove();
                            return false;
                        }
                        return true;
                    })
                }


            rx.value = param.rx || '';
            descricao.value = param.descricao || '';
            flags.value = param.flags || '';
            nomeLista.value = param.nomeLista || '';
            nomeGrupo.value = param.nomeGrupo || '';


            let _flags_f = () => {
                if (flags.value.match('g')) {
                    nomeLista.parentElement.hidden = false;
                    param.nomeLista = nomeLista.value.length > 0 ? nomeLista.value : 'definaUmNome';
                } else {
                    nomeLista.parentElement.hidden = true;
                    if (param.nomeLista) delete param.nomeLista;
                }
                changeColor(nomeLista, (flags.value.match('g') && nomeLista.value.length === 0));
                if (flags.value.match('g')) {
                    nomeGrupo.parentElement.hidden = false;
                } else {
                    nomeGrupo.parentElement.hidden = true;
                }
                param.flags = flags.value;
                gerarJson();
            }
            let _rx_f = () => {
                changeColor(rx, !checkRegexPattern(rx.value, flags.value));
                param.rx = rx.value;
                gerarJson();
            }
            let _descricao_f = () => {
                param.descricao = descricao.value;
                gerarJson();
            }
            let _nomeLista_f = () => {
                changeColor(nomeLista, (flags.value.match('g') && nomeLista.value.length === 0));
                param.nomeLista = nomeLista.value;
                gerarJson();
            }

            let _nomeGrupo_f = () => {
                param.nomeGrupo = nomeGrupo.value;
                gerarJson();
            }

            addEventsInput(flags, _flags_f);
            addEventsInput(rx, _rx_f)
            addEventsInput(descricao, _descricao_f)
            addEventsInput(nomeLista, _nomeLista_f)
            addEventsInput(nomeGrupo, _nomeGrupo_f)

            _flags_f();
            _rx_f();
            _descricao_f();
            _nomeLista_f();
            _nomeGrupo_f();
            return param;
        }


        let _parametroEditado: Param;

        let getParametro: () => Param;
        let setParametro: (param: Param) => Param;

        (() => {
            let _parametro: Param;
            getParametro = () => {
                return _parametro;
            }

            setParametro = (param: Param) => {
                _parametro = param;
                return _parametro
            }
        })()



        let tomUnidadesDeTrabalho: TomSelect;
        let tomPrincipalTipo: TomSelect;

        let carregarParamPrincipal = (param: Param = getParametroEmBranco()) => {
            setParametro(param);
            _parametroEditado = JSON.parse(JSON.stringify(param));

            if (tomUnidadesDeTrabalho) tomUnidadesDeTrabalho.destroy();
            if (tomPrincipalTipo) tomPrincipalTipo.destroy();
            //limpar divs outros parametros
            while (_outros_parametros.firstChild) _outros_parametros.removeChild(_outros_parametros.firstChild);
            //limpar options locais de trabalho
            while (_principalUnidadesDeTrabalho.firstChild) _principalUnidadesDeTrabalho.removeChild(_principalUnidadesDeTrabalho.firstChild);

            while (_select_editar_parametro.firstChild) _select_editar_parametro.removeChild(_select_editar_parametro.firstChild);
            let op = document.createElement('option');
            op.value = '';
            op.innerText = '';

            _select_editar_parametro.add(op)
            //carregar tipos de anexos existentes
            cfg.meusTiposDeAnexos.forEach((p) => {
                let op = document.createElement('option');
                op.value = p.nomeParametro;
                op.innerText = p.nomeParametro;
                _select_editar_parametro.add(op)
                if (param.nomeParametro === p.nomeParametro) op.selected = true;
            });



            // desativar btn excluir e salvar quando o parametro não existir na lista
            if (cfg.meusTiposDeAnexos.find((_p) => {
                return _p === getParametro();
            })) {
                _btn_salvar_parametro.disabled = false;
                _btn_excluir_parametro.disabled = false;

            } else {
                _btn_salvar_parametro.disabled = true;
                _btn_excluir_parametro.disabled = true;
            }

            createSubParametro(_parametroEditado, _parametro_principal);


            _principalDesativado.checked = _parametroEditado.desativado || false;
            _principalAtualizarJuntoComAExtensao.checked = _parametroEditado.dados.atualizarJuntoComAExtensao || false;
            _principalNomeParametro.value = _parametroEditado.nomeParametro;
            // _principalTipo.value = JSON.stringify(_parametroPrincipalObj.tipo);
            _principalExemploUtilizado.value = _parametroEditado.exemploUtilizado || '';
            _principalLerArquivoComoTexto.checked = _parametroEditado.lerArquivoComoTexto || false;



            if (Array.isArray(_parametroEditado.outrosParametros)) {
                _parametroEditado.outrosParametros.forEach((p, i, arr) => {
                    createSubParametro(p);
                })
            }


            _hipoteseLegal.value = _parametroEditado.dados.hipoteseLegal;

            for (let index = 0; index < _nivelAcesso.options.length; index++) {
                let op = _nivelAcesso.options[index];
                if (op.value === _parametroEditado.dados.nivelAcesso) {
                    op.selected = true;
                    break;
                }

            }

            addEventsInput(_hipoteseLegal, () => {

                if (!_parametroEditado.dados) _parametroEditado.dados = getParametroEmBranco().dados;
                _parametroEditado.dados.hipoteseLegal = <Hipoteselegal>_hipoteseLegal.value; gerarJson();
            });
            addEventsInput(_nivelAcesso, () => {
                if (!_parametroEditado.dados) _parametroEditado.dados = getParametroEmBranco().dados;
                if (_nivelAcesso.value !== 'público') {
                    _hipoteseLegal.parentElement.hidden = false;
                    _parametroEditado.dados.nivelAcesso = <NivelAcesso>_nivelAcesso.value;
                    _parametroEditado.dados.hipoteseLegal = <Hipoteselegal>_hipoteseLegal.value;

                } else {
                    _hipoteseLegal.parentElement.hidden = true;
                    _parametroEditado.dados.hipoteseLegal = '';
                }
                gerarJson();
            });

            addEventsInput(_principalNomeParametro, () => { _parametroEditado.nomeParametro = _principalNomeParametro.value; gerarJson(); });
            addEventsInput(_principalDesativado, () => { _parametroEditado.desativado = _principalDesativado.checked; gerarJson(); });
            addEventsInput(_principalAtualizarJuntoComAExtensao, () => { _parametroEditado.dados.atualizarJuntoComAExtensao = _principalAtualizarJuntoComAExtensao.checked; gerarJson(); });
            addEventsInput(_principalInserirAnexo, () => { _parametroEditado.dados.inserirAnexo = _principalInserirAnexo.checked; gerarJson(); });
            addEventsInput(_principalLerArquivoComoTexto, () => { _parametroEditado.lerArquivoComoTexto = _principalLerArquivoComoTexto.checked; gerarJson(); });
            addEventsInput(_principalExemploUtilizado, () => { _parametroEditado.exemploUtilizado = _principalExemploUtilizado.value; gerarJson(); });


            //UPDATE TOM #unidadesDeTrabalho
            let tomSettingsUnidadesDeTrabalho = Object.assign({}, tomSettings);
            let arry: string[] = [].concat(cfg.formulariosConfig).concat(cfg.processosConfig).concat(cfg.coordenadasPdf).concat(cfg.meusTiposDeAnexos).reduce((p: string[], c: UnidadesDeTrabalho, arr) => {

                if (Array.isArray(c.unidadesDeTrabalho)) {
                    p.push(...c.unidadesDeTrabalho);
                }
                return <string[]>p;
            }, []);
            arry = [...new Set(arry)];

            let unidadesTrabalhoTom = arry.reduce((p, u, arr) => {
                p.push({ value: u, text: u });
                return p;
            }, <{ value: string, text: string }[]>[]);

            tomSettingsUnidadesDeTrabalho.options = unidadesTrabalhoTom;
            tomSettingsUnidadesDeTrabalho.items = _parametroEditado.unidadesDeTrabalho || [];
            tomUnidadesDeTrabalho = new TomSelect('#unidadesDeTrabalho', <TomSettings>tomSettingsUnidadesDeTrabalho);

            tomUnidadesDeTrabalho.on('change', (itens: string[]) => {
                _parametroEditado.unidadesDeTrabalho = <(keyof ListUnidadesDeTrabalho)[]>itens;
            })


            //UPDATE TOM #tipo
            //carregar anexos existentes
            let anexosTipos: string[] = [];
            cfg.meusTiposDeAnexos.forEach((a) => {
                if (Array.isArray(a.dados.nomeAnexo)) {
                    anexosTipos.push(...a.dados.nomeAnexo);
                } else {
                    if (a.dados.nomeAnexo) anexosTipos.push(a.dados.nomeAnexo);
                }
            });

            let allAnexos = (Array.from(new Set(cfg.anexosExistentes.concat(anexosTipos)))).reduce((prev, cur, index, arr) => {
                prev.push({
                    text: cur,
                    value: cur
                })
                return prev;
            }, <{ value: string, text: string }[]>[]);
            let tomSettingsTipoFormulario = Object.assign({}, tomSettings);
            let tiposFormulario: string[];
            if (Array.isArray(_parametroEditado.dados.nomeAnexo)) {
                tiposFormulario = _parametroEditado.dados.nomeAnexo;
            } else {
                tiposFormulario = [_parametroEditado.dados.nomeAnexo]
                _parametroEditado.dados.nomeAnexo = tiposFormulario;

            }
            tomSettingsTipoFormulario.items = tiposFormulario;
            tomSettingsTipoFormulario.options = allAnexos;

            tomPrincipalTipo = new TomSelect('#tipo', <TomSettings>tomSettingsTipoFormulario);

            tomPrincipalTipo.on('change', (itens: string[]) => {
                _parametroEditado.dados.nomeAnexo = itens;

            })

            gerarJson();

        }


        let gerarJson = async () => {
            if (_parametroEditado.outrosParametros && _parametroEditado.outrosParametros.length === 0) {
                delete _parametroEditado.outrosParametros;
            }
            let dados = new ExtrairDados().extrairDadosPeloTexto(_principalExemploUtilizado.value, _parametroEditado);
            delete dados.dadosIniciais;
            _principalValorSaida.innerText = '\nDados gerados/capturados:\n' + JSON.stringify(dados, null, '  ');// + '\n\nConfiguração gerada:\n' + JSON.stringify(getParametro(), null, '    ');;
        };

        let _select_modelo_parametro = <HTMLSelectElement>document.getElementById('select_modelo_parametro');
        _select_modelo_parametro.value = _select_modelo_parametro.options[0].value;

        let _modelosSubParametro: SubParam[] = [
            {
                flags: 'i',
                descricao: 'Capturar data a partir dos formatos: (01-01-2020 ou 01_01_2020 ou 01 01 2020)',
                rx: '(?<data>[0-9]{2}[_ -\\/][0-9]{2}[_ -\\/][0-9]{4})'
            },
            {
                flags: 'i',
                descricao: 'Captura o nome do fornecedor, pesquisa fornecedor e captura o que ver a diante no texto',
                rx: 'fornecedor[_ -](?<fornecedor>.*)'
            },
            {
                flags: 'ig',
                descricao: 'com a flag g,  a captura vira uma lista. Exemplo uma lista de produtos com nome, unidade de medida e quantidade (dados separados por tab \\t)',
                rx: '(?<nome>[a-zA-Zãõâêîôûáéíóúàèìòù]+)\t(?<unidade>[a-zA-Zãõâêîôûáéíóúàèìòù]+)\t(?<quantidade>[0-9,\.]+)',
                nomeLista: 'produtos'
            },
            {
                flags: 'i',
                descricao: 'Iniciar um parametro em branco',
                rx: '(?<digitarValorAqui>.*)'
            }
        ];
        for (let param of _modelosSubParametro) {
            let op = document.createElement('option');
            op.value = JSON.stringify(param);
            op.innerText = param.descricao;
            _select_modelo_parametro.add(op);
        }


        /**
         * adicionar parametro
         */
        btn_add_modelo_parametro.onclick = (e) => {
            e.preventDefault();
            if (_select_modelo_parametro.value.length > 0) {
                let param: Param = JSON.parse(_select_modelo_parametro.value);
                if (!_parametroEditado.outrosParametros) _parametroEditado.outrosParametros = [];
                _parametroEditado.outrosParametros.push(param);
                createSubParametro(param);
            }
        }



        let file: File;

        inputFileTentarLerArquivo.onchange = async (ev) => {
            file = ev.target.files[0];
            let extrair = new ExtrairDados();
            let str = await extrair.readFileAsText(file, file.name, true);
            _principalExemploUtilizado.value = str;
            gerarJson();
        }

        document.getElementById('btn_input_tentar_ler_arquivo_como_texto').onclick = () => {
            inputFileTentarLerArquivo.click();
        }




        carregarParamPrincipal();




    }




    async function addEditRemoveParamAnexo(paramAnexo: Param, remove: boolean) {
        let meusTiposDeAnexos = (await ComunicacaoBGWorker.getAppCfg()).meusTiposDeAnexos;
        let f = () => {
            for (let index = 0; index < meusTiposDeAnexos.length; index++) {
                if (meusTiposDeAnexos[index].nomeParametro === paramAnexo.nomeParametro) {
                    if (remove) {
                        meusTiposDeAnexos = meusTiposDeAnexos.filter((p) => {
                            return p.nomeParametro !== paramAnexo.nomeParametro;
                        });
                        return;
                    } else {
                        meusTiposDeAnexos[index] = paramAnexo;
                        return;
                    }
                }
            }
            meusTiposDeAnexos.push(paramAnexo);
        }
        f();
        cfg = await ComunicacaoBGWorker.saveCfg({ meusTiposDeAnexos: meusTiposDeAnexos });
    }

    onload = () => {
        iniciar();
    }


}

