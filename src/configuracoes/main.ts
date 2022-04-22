module MainCfg {

    let _cfg: AppCfg;




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
    async function iniciar() {


        _cfg = await ComunicacaoBGWorker.getAppCfg();

        let manter_atualizado_procedimentos = <HTMLInputElement>document.getElementById('manter_atualizado_procedimentos');
        let inserir_drop_zone = <HTMLInputElement>document.getElementById('inserir_drop_zone');
        let testar_formulario = <HTMLInputElement>document.getElementById('testar_formulario');
        let inserir_anexos = <HTMLInputElement>document.getElementById('inserir_anexos');
        let copiar_lista = <HTMLInputElement>document.getElementById('copiar_lista');
        let copiar_lista_numerada = <HTMLInputElement>document.getElementById('copiar_lista_numerada');
        let filtrar_processos = <HTMLInputElement>document.getElementById('filtrar_processos');
        let prazo_processos = <HTMLInputElement>document.getElementById('prazo_processos');

        
        let formatarNumeroAnexoNumeros = <HTMLInputElement>document.getElementById('formatarNumeroAnexoNumeros');
        let formatarNumeroAnexoMesAno = <HTMLInputElement>document.getElementById('formatarNumeroAnexoMesAno');
        let formatarNumeroAnexoDiaMesAno = <HTMLInputElement>document.getElementById('formatarNumeroAnexoDiaMesAno');
        

        let sempre_mostrar_check_copy = <HTMLInputElement>document.getElementById('mostrar_check_copy');
        let mostrar_copy = <HTMLInputElement>document.getElementById('mostrar_copy');
        let copiar_link_externo = <HTMLInputElement>document.getElementById('copiar_link_externo');
        let alterar_acesso_documento = <HTMLInputElement>document.getElementById('alterar_acesso_documento');

        manter_atualizado_procedimentos.checked = _cfg.manter_atualizado_procedimentos;
        inserir_anexos.checked = _cfg.inserir_anexos;
        testar_formulario.checked = _cfg.testar_formulario;
        inserir_drop_zone.checked = _cfg.inserir_drop_zone;
        copiar_lista.checked = _cfg.copiar_lista;
        copiar_lista_numerada.checked = _cfg.copiar_lista_numerada;
        filtrar_processos.checked = _cfg.filtrar_processos;
        prazo_processos.checked = _cfg.prazo_processos;

        formatarNumeroAnexoDiaMesAno.checked = _cfg.formatarNumeroAnexoDiaMesAno;
        formatarNumeroAnexoMesAno.checked = _cfg.formatarNumeroAnexoMesAno;
        formatarNumeroAnexoNumeros.checked = _cfg.formatarNumeroAnexoNumeros;

        sempre_mostrar_check_copy.checked = _cfg.sempre_mostrar_check_copy;
        mostrar_copy.checked = _cfg.mostrar_copy;

        copiar_link_externo.checked = _cfg.copiar_link_externo;
        alterar_acesso_documento.checked = _cfg.alterar_acesso_documento;

        manter_atualizado_procedimentos.onchange = () => { _cfg.manter_atualizado_procedimentos = manter_atualizado_procedimentos.checked; updateCfg(); };
        inserir_anexos.onchange = () => { _cfg.inserir_anexos = inserir_anexos.checked; updateCfg(); };
        testar_formulario.onchange = () => { _cfg.testar_formulario = testar_formulario.checked; updateCfg(); };
        inserir_drop_zone.onchange = () => { _cfg.inserir_drop_zone = inserir_drop_zone.checked; updateCfg(); };
        copiar_lista.onchange = () => { _cfg.copiar_lista = copiar_lista.checked; updateCfg(); };
        copiar_lista_numerada.onchange = () => { _cfg.copiar_lista_numerada = copiar_lista_numerada.checked; updateCfg(); };
        filtrar_processos.onchange = () => { _cfg.filtrar_processos = filtrar_processos.checked; updateCfg(); };
        prazo_processos.onchange = () => { _cfg.prazo_processos = prazo_processos.checked; updateCfg(); };

        formatarNumeroAnexoNumeros.onchange = () => { _cfg.formatarNumeroAnexoNumeros = formatarNumeroAnexoNumeros.checked; updateCfg(); };
        formatarNumeroAnexoMesAno.onchange = () => { _cfg.formatarNumeroAnexoMesAno = formatarNumeroAnexoMesAno.checked; updateCfg(); };
        formatarNumeroAnexoDiaMesAno.onchange = () => { _cfg.formatarNumeroAnexoDiaMesAno = formatarNumeroAnexoDiaMesAno.checked; updateCfg(); };

        sempre_mostrar_check_copy.onchange = () => { _cfg.sempre_mostrar_check_copy = sempre_mostrar_check_copy.checked; updateCfg(); };
        mostrar_copy.onchange = () => { _cfg.mostrar_copy = mostrar_copy.checked; updateCfg(); };
        
        copiar_link_externo.onchange = () => { _cfg.copiar_link_externo = copiar_link_externo.checked; updateCfg(); };
        alterar_acesso_documento.onchange = () => { _cfg.alterar_acesso_documento = alterar_acesso_documento.checked; updateCfg(); };

        document.getElementById('resetAll').onclick = async (e) => {
            e.preventDefault();
            if (confirm('Restaurar?')) {
                await ComunicacaoBGWorker.resetCfg();
                document.location.reload();
            }
            

        }


        let formularioModel = <HTMLDivElement>document.getElementById('formularioModel');
        let processoModel = <HTMLDivElement>document.getElementById('processoModel');
        formularioModel.remove();
        processoModel.remove();

        let formulariosContainer = <HTMLDivElement>document.getElementById('formularios');
        let processosContainer = <HTMLDivElement>document.getElementById('processos');


        for (let processo of _cfg.processosConfig) {
            let _processoModel = <HTMLDivElement>processoModel.cloneNode(true);

            let _nome = <HTMLInputElement>_processoModel.querySelector('#nome');
            let _gerar = <HTMLInputElement>_processoModel.querySelector('#gerar');
            let _alterar = <HTMLInputElement>_processoModel.querySelector('#alterar');
            let _relacionado = <HTMLInputElement>_processoModel.querySelector('#relacionado');


            _nome.innerText = processo.nome;
            _gerar.checked = processo.gerarProcessoSei;
            _alterar.checked = processo.btnAlterarProcesso;
            _relacionado.checked = processo.btnGerarProcessoRelacionado;

            _gerar.onchange = () => { processo.gerarProcessoSei = _gerar.checked; updateCfg(); };
            _alterar.onchange = () => { processo.btnAlterarProcesso = _alterar.checked; updateCfg(); };
            _relacionado.onchange = () => { processo.btnGerarProcessoRelacionado = _relacionado.checked; updateCfg(); };
            processosContainer.append(_processoModel);
        }
        _cfg.formulariosConfig.forEach((formulario, i) => {
            let _formularioModel = <HTMLDivElement>formularioModel.cloneNode(true);
            let _nome = <HTMLInputElement>_formularioModel.querySelector('#nome');
            let _gerar = <HTMLInputElement>_formularioModel.querySelector('#gerar');
            let _sempreMostrar = <HTMLInputElement>_formularioModel.querySelector('#sempreMostrar');
            let _desativar = <HTMLInputElement>_formularioModel.querySelector('#desativar');
            let _editar = <HTMLInputElement>_formularioModel.querySelector('#editar');

            let _gerarLabel = <HTMLLabelElement>_gerar.parentNode.querySelector('label');
            let _sempreMostrarLabel = <HTMLLabelElement>_sempreMostrar.parentNode.querySelector('label');
            let _desativarLabel = <HTMLLabelElement>_desativar.parentNode.querySelector('label');


            _gerarLabel.onclick = () => _gerar.click();
            _sempreMostrarLabel.onclick = () => _sempreMostrar.click();
            _desativarLabel.onclick = () => _desativar.click();


            _editar.onclick = () => {
                let _w = open(document.location.href.replace('main.html', 'formularios.html'))
                _w['nomeFormularioParaAbrir'] = formulario.nome;

            }

            _nome.innerText = formulario.nome;
            _gerar.checked = formulario.btnGerarFormulario;
            _sempreMostrar.checked = formulario.sempreMostarBtn;
            _desativar.checked = formulario.desativado;
            _gerar.onchange = () => { formulario.btnGerarFormulario = _gerar.checked; updateCfg(); };
            _sempreMostrar.onchange = () => { formulario.sempreMostarBtn = _sempreMostrar.checked; updateCfg(); };
            _desativar.onchange = () => { formulario.desativado = _desativar.checked; updateCfg(); };
            formulariosContainer.append(_formularioModel);

        });
        carregarAlert();
        carregarFuncoes();
    }



    function carregarAlert() {
        let _alert = <HTMLInputElement>document.getElementById('alert');
        let _alert_itens = <HTMLInputElement>document.getElementById('alert_itens');

        let alert = false;
        if (_cfg.anexosExistentes.length === 0) {
            let _txt = document.createElement('li');
            _txt.style.marginLeft = '10px';
            _txt.innerText = 'não foi carregado a lista com os nomes dos anexos, favor entrar dentro de um processo SEI para carregar';
            _alert_itens.insertAdjacentElement('afterbegin', _txt);
            alert = true;
        }
        if (_cfg.formulariosExistentes.length === 0) {
            let _txt = document.createElement('li');
            _txt.style.marginLeft = '10px';
            _txt.innerText = 'não foi carregado a lista com os nomes formulários, favor entrar dentro de um processo SEI para carregar';
            _alert_itens.insertAdjacentElement('afterbegin', _txt);
            alert = true;
        }

        if (_cfg.formatacaoParagrafos.length === 0) {
            let _txt = document.createElement('li');
            _txt.style.marginLeft = '10px';
            _txt.innerText = 'não foi carregado a lista de formatação de paragrafos, favor entrar dentro de um processo SEI e clicar num formulário para carregar';
            _alert_itens.insertAdjacentElement('afterbegin', _txt);
            alert = true;
        }

        if (_cfg.todosAnexosFormularios.length === 0) {
            let _txt = document.createElement('li');
            _txt.style.marginLeft = '10px';
            _txt.innerText = 'não foi carregado a lista completa de com os nomes de anexos e de formularios, entre pelo menos uma vez na página inicial do ambiente de produção';
            _alert_itens.insertAdjacentElement('afterbegin', _txt);
            alert = true;
        }
        if (_cfg.processosExistentes.length === 0) {
            let _txt = document.createElement('li');
            _txt.style.marginLeft = '10px';
            _txt.innerText = 'não foi carregado a lista completa com os nomes de processos, entre pelo menos uma vez na página inicial do ambiente de produção';
            _alert_itens.insertAdjacentElement('afterbegin', _txt);
            alert = true;
        }

        if (_cfg.hipotesesExistentes.length === 0) {
            let _txt = document.createElement('li');
            _txt.style.marginLeft = '10px';
            _txt.innerText = 'não foi carregado a lista com os niveis de acesso restrito, favor entrar dentro de um processo SEI para carregar';
            _alert_itens.insertAdjacentElement('afterbegin', _txt);
            alert = true;
        }

        if (alert) {
            let _txt = document.createElement('strong');
            _txt.innerText = 'Atenção os seguintes itens não foram carregados:';
            _alert.insertAdjacentElement('afterbegin', _txt)
            _alert.classList.add('alert-warning');
            _alert.classList.add('show');
        } else {
            let _txt = document.createElement('span');
            _txt.innerText = 'Tudo certo com o carregamento dos itens da extensão!';
            _alert.insertAdjacentElement('afterbegin', _txt)
            _alert.classList.add('alert-success');
            _alert.classList.add('show');
        }
    }



    async function updateCfg() {
        await ComunicacaoBGWorker.saveCfg(_cfg);
        log('Configuração atualizada:');
    }
    function carregarFuncoes() {
        let btn_cfg = <HTMLButtonElement[]><any>document.querySelectorAll('button[id^="btn_editar_"]');
        btn_cfg.forEach((b) => {
            b.addEventListener('click', (e) => {
                e.preventDefault();
                ComunicacaoBGWorker.loadPageConfig(<pageKeys>b.id.replace('btn_editar_', ''));
            });

        })
    }
    onload = () => {
        iniciar();
    };
}
