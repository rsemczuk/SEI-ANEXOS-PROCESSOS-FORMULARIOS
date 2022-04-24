class ProcedimentoGerarProcessoSEI extends ProcedimentoControlarClassModel {
    className = "ProcedimentoGerarProcessoSEI";

    constructor(procedimentoControlar: ProcedimentoControlar) {
        super(procedimentoControlar);
        this.className = "ProcedimentoGerarProcessoSEI";
        this.window = procedimentoControlar.window;
        this.document = procedimentoControlar.document;
    }

    async iniciar() {
        await super.iniciar();
        await this.waitLoadElements('#divComandos');
        let formInput = <HTMLFormElement>this.querySelector('#custom-upload');
        if (!formInput) {
            let src = document.scripts.namedItem('modules/sei/windowControlar/ProcedimentoGerarProcessoSEI.js').src.replace('modules/sei/windowControlar/ProcedimentoGerarProcessoSEI.js', '') + 'icons/GERAR_PROCESSO.svg';
            let processoConfig: ProcessoConfig;
            let btnOnClick = async (e: Event) => {
                (<HTMLFormElement>document.getElementById('custom-upload')).reset();
                processoConfig = await this.procedimentoControlar.openDialogIniciarProcesso();
                if (processoConfig) document.getElementById('input-custom-upload').click();
            };
            await this.procedimentoControlar.addBtnComando('a-custom-upload', src, 'Inserir processo customizado', btnOnClick);
            let formInput = document.createElement('form');
            formInput.id = 'custom-upload';
            let input = this.document.createElement("input");
            input.id = 'input-custom-upload';
            formInput.append(input);
            input.type = 'file';
            input.setAttribute("style", "visibility:hidden;");
            input.setAttribute("multiple", 'multiple');
            let div = <HTMLElement>this.querySelector("#divInfraBarraSistemaE");
            div.append(formInput);
            input.onchange = async (evt) => {
                let files = evt.target.files;
                if (!files || files.length === 0) return;
                //
                let formulario = AnexosTools.getFormulario(processoConfig.formulario);
                let anexos = await AnexosTools.gerarAnexos(files);
                let ok = false;
                if (formulario && formulario.filtrarNomes && anexos && anexos.length > 0) {
                    formulario.filtrarNomes.forEach((nome) => {
                        anexos.forEach((anexo) => {
                            if (anexo.nomeAnexo === nome) {
                                ok = true;
                            }
                        })
                    })
                } else {
                    ok = true;
                }
                if (!ok) { alert('Favor selecionar pelo menos um dos seguintes documentos:\n' + formulario.filtrarNomes.join(';\n')); return };
                let itens = await this.procedimentoControlar.waitLoadElements('#main-menu>li>a[href^="controlador.php?acao=procedimento_escolher_tipo"]');
                let a = <HTMLAnchorElement>itens[0];

                let request = await AnexosTools.getRequest(a.href, 'GET', 'document');
                let doc = <Document>request.response;
                let links = AnexosTools.loadLinks(doc);
                let link = links.find((e) => {
                    return processoConfig.tipoProcesso.some((t) => { return t === e.nomeVisivel; });
                });
                if (!link) { console.log('Link não encontrado'); return; }
                let window_procedimento_gerar = this.procedimentoControlar.window.open(link.link);
                await AnexosTools.onWindowload(window_procedimento_gerar);
                // this.procedimentoControlar.procedimentoGerar.setWindow(window_procedimento_gerar);
                await this.procedimentoControlar.procedimentoGerar.preencherFormulario(processoConfig, AnexosTools.gerarDocSEIs(anexos), null, this.procedimentoControlar);
                await this.procedimentoControlar.waitLoadProcedimentoTrabalhar();
                let inserirAnexos = await this.procedimentoControlar.procedimentoTrabalhar.inserirAnexos(anexos, false);
                if (processoConfig.formulario) {
                    await this.procedimentoControlar.procedimentoTrabalhar.procedimentoVisualizar.selecionar(inserirAnexos.anexos);
                    let formulario = AnexosTools.getFormulario(processoConfig.formulario);
                    let formularioFiltrar: string[];
                    if (formulario && formulario.filtrarNomes) {
                        formularioFiltrar = formulario.filtrarNomes;
                    }
                    let clicados = await this.procedimentoControlar.procedimentoTrabalhar.procedimentoVisualizar.getListClicados(formularioFiltrar);
                    let extraAnexos: Anexo[] = anexos.filter((a) => { return !a.inserirAnexo; })
                    let extraDocSeis: DocSEI[] = AnexosTools.gerarDocSEIs(extraAnexos);
                    clicados = clicados.concat(extraDocSeis);
                    await this.procedimentoControlar.procedimentoTrabalhar.inserirFormulario.criarFormulario(formulario, clicados);
                }
                formInput.reset();
            };
        }

    }
}
