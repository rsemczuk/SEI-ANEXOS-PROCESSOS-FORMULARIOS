

module BackGroundPageFormularios {


    function log(message: string, logError = false) {
        let p = document.createElement('p');
        p.className = 'tempHide';
        p.textContent = message;
        if (logError) {
            p.classList.add('bg-danger')
        } else {
            p.classList.add('bg-success')
        }
        document.getElementById('log').append(p);
    }


    onload = async () => {
        startFormulario();
        // new DragDropDivContainer(<HTMLFieldSetElement>document.getElementById('paragrafos'));
        // let div = <HTMLFieldSetElement>document.getElementById('procurarInserirParagrafos')
        // div.append(div.children[1].cloneNode(true));

        // new DragDropDivContainer(div);
    }


    let addEventsInput = (input: HTMLElement | HTMLElement[], funcao: (input: HTMLElement) => void) => {
        if (Array.isArray(input)) {
            input.forEach((_input) => {
                _input.onchange = () => funcao(_input);
                _input.onkeydown = () => funcao(_input);
                _input.onkeyup = () => funcao(_input);
            })
        } else {
            input.onchange = () => funcao(input);
            input.onkeydown = () => funcao(input);
            input.onkeyup = () => funcao(input);
        }
    }


    let tomSettings: Partial<TomSettings> = {
        // maxItems: 3,
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

    /**
     * formulário
     *  
     * */

    async function startFormulario() {

        
        cfg = await ComunicacaoBGWorker.getAppCfg();
        AnexosTools.setCfg(cfg);

        let _select_editar_formulario = <HTMLSelectElement>document.querySelector('#select_editar_formulario');
        let _btn_editar_formulario = <HTMLButtonElement>document.querySelector('#btn_editar_formulario');
        let _btn_salvar_formulario = <HTMLButtonElement>document.querySelector('#btn_salvar_formulario');
        let _btn_adicionar_formulario = <HTMLButtonElement>document.querySelector('#btn_adicionar_formulario');
        let _btn_excluir_formulario = <HTMLButtonElement>document.querySelector('#btn_excluir_formulario');
        let _btn_limpar_formulario = <HTMLButtonElement>document.querySelector('#btn_limpar_formulario');

        let _btn_download = <HTMLButtonElement>document.querySelector('#btn_download');
        let _btn_upload = <HTMLButtonElement>document.querySelector('#btn_upload');
        let _input_upload = <HTMLButtonElement>document.querySelector('#input_upload');

        let _nome = <HTMLInputElement>document.querySelector('#nome');
        let _btnColor = <HTMLInputElement>document.querySelector('#btnColorFormulario');
        let _qntItensSelecionados = <HTMLInputElement>document.querySelector('#qntItensSelecionados');
        let _nivelAcesso = <HTMLSelectElement>document.querySelector('#nivelAcesso');
        let _numeroModelo = <HTMLInputElement>document.querySelector('#numeroModelo');
        let _btnGerarFormulario = <HTMLInputElement>document.querySelector('#btnGerarFormulario');
        let _sempreMostarBtn = <HTMLInputElement>document.querySelector('#sempreMostarBtn');
        let _descricaoDoFormulario = <HTMLTextAreaElement>document.querySelector('#descricaoDoFormulario');
        let _observacoesDoFormulario = <HTMLTextAreaElement>document.querySelector('#observacoesDoFormulario');
        let _procurarInserirParagrafos = <HTMLFieldSetElement>document.querySelector('#procurarInserirParagrafos');


        _btn_download.onclick = () => {
            AnexosTools.download("regex_cfg_" + AnexosTools.normalizedID(_formularioEditado.nome) + '.json', JSON.stringify(_formularioEditado, null, '    '), 'text/json');
        }

        _btn_upload.onclick = () => {
            _input_upload.click();
        }

        _input_upload.onchange = async (e) => {
            if (e.target.files?.length > 0) {
                let file = e.target.files[0];
                let _jsonObject = <FormularioConfig>JSON.parse(await file.text());

                if (typeof _jsonObject.atualizarJuntoComAExtensao === 'boolean' &&
                    typeof _jsonObject.btnGerarFormulario === 'boolean' &&
                    typeof _jsonObject.desativado === 'boolean' &&
                    typeof _jsonObject.descricaoDoFormulario === 'string' &&
                    typeof _jsonObject.nome === 'string'
                ) {
                    carregarFormulario(_jsonObject);
                }

            }

            try {
                _input_upload.type = 'text';
                _input_upload.type = 'file';
            } catch (error) {
                console.log(error);
            }

        }



        _btn_editar_formulario.onclick = () => {
            let f = cfg.formulariosConfig.filter((a) => {
                return a.nome === _select_editar_formulario.value;
            });
            if (f.length > 0) {
                carregarFormulario(f[0])
                log("Configuração carregada com sucesso");
            } else if (_select_editar_formulario.value === '') {
                carregarFormulario()
            }


        }

        _btn_salvar_formulario.onclick = async () => {
            if (checkErrors()) {
                return;
            }
            cfg.formulariosConfig.every((f, i, arr) => {
                if (_formulario === f) {
                    Object.assign(f, _formularioEditado);
                    return false;
                }
                return true;
            })
            cfg = await ComunicacaoBGWorker.saveCfg(cfg);
            log("Configuração salva com sucesso");

        }

        _btn_adicionar_formulario.onclick = async () => {

            if (checkErrors()) {
                return;
            }

            if (!cfg.formulariosConfig.every((f, i, arr) => {
                if (_formularioEditado.nome === f.nome) {
                    return false;
                }
                return true;
            })) {
                _nome.focus();
                alert("Existe um formulário com este mesmo nome, favor alterar e tentar novamente")
            } else {
                let _f: FormularioConfig = JSON.parse(JSON.stringify(_formularioEditado));
                cfg.formulariosConfig.push(_f);
                cfg = await ComunicacaoBGWorker.saveCfg(cfg);
                carregarFormulario(_f);
                _nome.focus();
                log("Configuração adicionada com sucesso");

            }


        }
        function checkErrors() {

            let erro = false;

            if (erro) {
                alert("Existem erros no formulário")
            }
            return false;
        }
        _btn_excluir_formulario.onclick = async () => {
            cfg.formulariosConfig.every((f, i, arr) => {
                if (_formulario === f) {
                    cfg.formulariosConfig.splice(i, 1);
                    return false;
                }
                return true;
            })
            cfg = await ComunicacaoBGWorker.saveCfg(cfg);
            carregarFormulario(_formularioEditado);
            _nome.focus();
            log("Configuração excluida com sucesso");

        }

        _btn_limpar_formulario.onclick = async () => {
            if (confirm("Confirma limpar o formulário, todas as alterações serão perdidas"))
                carregarFormulario();

        }


        let datalistEstilos = document.getElementById('estilos');
        cfg.formatacaoParagrafos.forEach((estilo) => {
            datalistEstilos.append(createOption('', estilo));
        });

        let modeloParagrafo = document.getElementById('paragrafo_0').cloneNode(true);
        document.getElementById('paragrafo_0').remove();
        let modeloProcurarInserirParagrafo = document.getElementById('procurarInserirParagrafo_0').cloneNode(true);
        document.getElementById('procurarInserirParagrafo_0').remove();

        function colorToHex(str: string) {
            let ctx2d = document.createElement('canvas').getContext('2d');
            ctx2d.fillStyle = str;
            return ctx2d.fillStyle;
        }

        let tomFiltrarNomes: TomSelect;
        let tomTipoFormulario: TomSelect;
        let _formulario: FormularioConfig;
        let _formularioEditado: FormularioConfig;

        let _formularioEmBranco: FormularioConfig = {
            atualizarJuntoComAExtensao: false,
            btnGerarFormulario: true,
            desativado: false,
            descricaoDoFormulario: '',
            nivelAcesso: 'público',
            nome: '',
            observacoesDaUnidade: '',
            qntItensSelecionados: 1,
            sempreMostarBtn: false,
            nomeFormulario: [],
            btnColor: '',
            filtrarNomes: [],
            numeroModelo: '',
            procurarInserirParagrafos: [{
                paragrafos: [{
                    estilo: '',
                    texto: ''
                }],
                posicaoParaInserir: 'substituir_paragrafo',
                textoParaProcurar: ''
            }],
            unidadesDeTrabalho: ["PML"]
        }

        let getFormularioEmBranco = () => {
            return <FormularioConfig>JSON.parse(JSON.stringify(_formularioEmBranco));
        }



        function carregarFormulario(formulario = getFormularioEmBranco()) {
            _formulario = formulario;

            if (cfg.formulariosConfig.find((_f) => {
                return _f === formulario;
            })) {
                _btn_salvar_formulario.disabled = false;
                _btn_excluir_formulario.disabled = false;

            } else {
                _btn_salvar_formulario.disabled = true;
                _btn_excluir_formulario.disabled = true;
            }


            AnexosTools.clearInnerHTML(_select_editar_formulario);
            _select_editar_formulario.options.add(createOption('', ''));
            let formulariosTipos: string[] = [];
            let anexosTipos: string[] = [];
            cfg.formulariosConfig.forEach((f) => {
                if (Array.isArray(f.nomeFormulario)) {
                    formulariosTipos.push(...f.nomeFormulario);
                } else {
                    if (f.nomeFormulario) formulariosTipos.push(f.nomeFormulario);
                }
                if (Array.isArray(f.filtrarNomes)) {
                    anexosTipos.push(...f.filtrarNomes);
                }
                let op = createOption(f.nome, f.nome);
                if (f.nome === _formulario.nome) op.selected = true;

                _select_editar_formulario.options.add(op)
            });

            let allAnexos = (Array.from(new Set(cfg.anexosExistentes.concat(anexosTipos)))).reduce((prev, cur, index, arr) => {
                prev.push({
                    text: cur,
                    value: cur
                })
                return prev;
            }, <{ value: string, text: string }[]>[]);
            let allFormularios = (Array.from(new Set(cfg.formulariosExistentes.concat(formulariosTipos)))).reduce((prev, cur, index, arr) => {
                prev.push({
                    text: cur,
                    value: cur
                })
                return prev;
            }, <{ value: string, text: string }[]>[]);

            /////    

            _formularioEditado = JSON.parse(JSON.stringify(formulario));
            if (tomFiltrarNomes) tomFiltrarNomes.destroy();
            if (tomTipoFormulario) tomTipoFormulario.destroy();
            AnexosTools.clearInnerHTML(_procurarInserirParagrafos);
            _nome.value = _formularioEditado.nome;
            _btnColor.value = colorToHex(_formularioEditado.btnColor);
            _qntItensSelecionados.valueAsNumber = _formularioEditado.qntItensSelecionados;

            Array.from(_nivelAcesso.options).forEach((op) => {
                if (op.value === _formularioEditado.nivelAcesso) {
                    op.selected = true;
                } else {
                    op.selected = false;
                }

            });

            _numeroModelo.value = _formularioEditado.numeroModelo || '';
            _btnGerarFormulario.checked = _formularioEditado.btnGerarFormulario;
            _sempreMostarBtn.checked = _formularioEditado.sempreMostarBtn;


            let tipos: string[];
            if (Array.isArray(_formularioEditado.nomeFormulario)) {
                tipos = _formularioEditado.nomeFormulario;
            } else {
                tipos = [_formularioEditado.nomeFormulario];
            }
            _descricaoDoFormulario.textContent = _formularioEditado.descricaoDoFormulario;
            _observacoesDoFormulario.textContent = _formularioEditado.observacoesDaUnidade;

            if (!Array.isArray(_formularioEditado.procurarInserirParagrafos)) {
                _formularioEditado.procurarInserirParagrafos = [];
            }

            let rodarProcura: (value: ProcurarInserirParagrafo, index: number, arr?: ProcurarInserirParagrafo[]) => void = (paragrafoParaInserir, i) => {
                let procurarInserirParagrafo = <HTMLDivElement>modeloProcurarInserirParagrafo.cloneNode(true);
                procurarInserirParagrafo.querySelector('#procuraNumero').textContent = "PROCURA " + (i + 1);
                let _textoParaProcurar = <HTMLTextAreaElement>procurarInserirParagrafo.querySelector('#textoParaProcurar');
                let _remover = <HTMLInputElement>procurarInserirParagrafo.querySelector('#remover');
                let _posicaoParaInserir = <HTMLSelectElement>procurarInserirParagrafo.querySelector('#posicaoParaInserir');

                let _adicionarProcura = <HTMLButtonElement>document.querySelector('#adicionarProcura');
                _adicionarProcura.onclick = () => {
                    let _newProcura = getFormularioEmBranco().procurarInserirParagrafos[0]
                    _formularioEditado.procurarInserirParagrafos.push(_newProcura);
                    rodarProcura(_newProcura, _formularioEditado.procurarInserirParagrafos.length - 1, _formularioEditado.procurarInserirParagrafos);
                }
                let _excluirProcura = <HTMLButtonElement>procurarInserirParagrafo.querySelector('#excluirProcura');

                _excluirProcura.onclick = () => {
                    _formularioEditado.procurarInserirParagrafos.every((cur, index) => {
                        if (cur === paragrafoParaInserir) {
                            _formularioEditado.procurarInserirParagrafos.splice(index, 1);
                            AnexosTools.clearInnerHTML(procurarInserirParagrafo);
                            procurarInserirParagrafo.remove();
                            return false;
                        }
                        return true;
                    })

                }


                let _paragrafos = <HTMLFieldSetElement>procurarInserirParagrafo.querySelector('#paragrafos');


                addEventsInput(_textoParaProcurar, () => { paragrafoParaInserir.textoParaProcurar = _textoParaProcurar.value; });
                addEventsInput(_remover, () => { paragrafoParaInserir.remover = _remover.checked; });
                addEventsInput(_posicaoParaInserir, () => { paragrafoParaInserir.posicaoParaInserir = <PosicaoParaInserir>_posicaoParaInserir.value; });

                if (typeof paragrafoParaInserir.textoParaProcurar === 'string') {
                    _textoParaProcurar.value = paragrafoParaInserir.textoParaProcurar;
                } else {
                    _textoParaProcurar.value = '/' + paragrafoParaInserir.textoParaProcurar.source + '/' + paragrafoParaInserir.textoParaProcurar.flags;
                }

                _remover.checked = paragrafoParaInserir.remover;
                _posicaoParaInserir.value = paragrafoParaInserir.posicaoParaInserir;
                if (!Array.isArray(paragrafoParaInserir.paragrafos)) {
                    paragrafoParaInserir.paragrafos = [];
                }
                let rodarParagrafo: (value: Paragrafo, index: number, array: Paragrafo[]) => void = (p, i) => {
                    let paragrafo = <HTMLDivElement>modeloParagrafo.cloneNode(true);
                    paragrafo.querySelector('#paragrafoNumero').textContent = "PARAGRAFO " + (i + 1);
                    let _estilo = <HTMLInputElement>paragrafo.querySelector('#estilo');
                    let _texto = <HTMLTextAreaElement>paragrafo.querySelector('#texto');

                    let _adicionarParagrafo = <HTMLButtonElement>procurarInserirParagrafo.querySelector('#adicionarParagrafo');
                    _adicionarParagrafo.onclick = () => {
                        let _newProcura = getFormularioEmBranco().procurarInserirParagrafos[0].paragrafos[0];
                        paragrafoParaInserir.paragrafos.push(_newProcura);
                        rodarParagrafo(_newProcura, paragrafoParaInserir.paragrafos.length - 1, paragrafoParaInserir.paragrafos);
                    }
                    let _excluirParagrafo = <HTMLButtonElement>paragrafo.querySelector('#excluirParagrafo');

                    _excluirParagrafo.onclick = () => {
                        paragrafoParaInserir.paragrafos.every((cur, index) => {
                            if (cur === p) {
                                paragrafoParaInserir.paragrafos.splice(index, 1);
                                AnexosTools.clearInnerHTML(paragrafo);
                                paragrafo.remove();
                                return false;
                            }
                            return true;
                        })

                    }

                    addEventsInput(_estilo, () => { p.estilo = _estilo.value; });
                    addEventsInput(_texto, () => { p.texto = _texto.value; });
                    _estilo.value = p.estilo;
                    _texto.textContent = p.texto;

                    _paragrafos.append(paragrafo);
                }
                paragrafoParaInserir.paragrafos.forEach(rodarParagrafo);
                _procurarInserirParagrafos.append(procurarInserirParagrafo);
            }

            _formularioEditado.procurarInserirParagrafos.forEach(rodarProcura);


            let tomSettingsFiltrarNomes: Partial<TomSettings> = {};
            Object.assign(tomSettingsFiltrarNomes, tomSettings);
            tomSettingsFiltrarNomes.items = _formularioEditado.filtrarNomes;
            tomSettingsFiltrarNomes.options = allAnexos;
            tomFiltrarNomes = new TomSelect('#filtrarNomes', <TomSettings>tomSettingsFiltrarNomes);
            tomFiltrarNomes.on('change', (itens: string[]) => {
                _formularioEditado.filtrarNomes = itens;

            });

            let tomSettingsTipoFormulario = Object.assign({}, tomSettings);
            let tiposFormulario: string[];
            if (Array.isArray(_formularioEditado.nomeFormulario)) {
                tiposFormulario = _formularioEditado.nomeFormulario;
            } else {
                tiposFormulario = [_formularioEditado.nomeFormulario]
            }
            tomSettingsTipoFormulario.items = tiposFormulario;
            tomSettingsTipoFormulario.options = allFormularios;
            tomTipoFormulario = new TomSelect('#nomeFormulario', <TomSettings>tomSettingsTipoFormulario);
            tomTipoFormulario.on('change', (itens: string[]) => {
                _formularioEditado.nomeFormulario = itens;
            })

            addEventsInput(_nome, () => { _formularioEditado.nome = _nome.value; })
            addEventsInput(_btnColor, () => { _formularioEditado.btnColor = _btnColor.value; })
            addEventsInput(_qntItensSelecionados, () => { _formularioEditado.qntItensSelecionados = parseInt(_qntItensSelecionados.value); })
            addEventsInput(_nivelAcesso, () => { _formularioEditado.nivelAcesso = <NivelAcesso>_nivelAcesso.value; })
            addEventsInput(_numeroModelo, () => { _formularioEditado.numeroModelo = _numeroModelo.value; })
            addEventsInput(_btnGerarFormulario, () => { _formularioEditado.btnGerarFormulario = _btnGerarFormulario.checked; })
            addEventsInput(_sempreMostarBtn, () => { _formularioEditado.sempreMostarBtn = _sempreMostarBtn.checked; })
            addEventsInput(_descricaoDoFormulario, () => { _formularioEditado.descricaoDoFormulario = _descricaoDoFormulario.value; })
            addEventsInput(_observacoesDoFormulario, () => { _formularioEditado.observacoesDaUnidade = _observacoesDoFormulario.value; })
        }

        if ((<any>window).nomeFormularioParaAbrir) {

            let f = cfg.formulariosConfig.filter((f) => {
                return f.nome === nomeFormularioParaAbrir;
            })
            if (f.length > 0) {
                carregarFormulario(f[0])
            }

        } else {
            carregarFormulario()
        }

    }

    let cfg: AppCfg;

    function createOption(text: string, value: string) {
        let op = document.createElement('option');
        op.value = value;
        op.innerText = text;
        return op;
    }
}
declare let nomeFormularioParaAbrir: string;
