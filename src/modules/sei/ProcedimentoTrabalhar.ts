
class ProcedimentoTrabalhar extends AbstractSubClassEngine {
    arvoreVisualizar: ProcedimentoArvoreVisualizar;
    procedimentoVisualizar: ProcedimentoVisualizar;
    documentoReceber: DocumentoReceber;
    editor: Editor;
    escolherTipoDocumento: EscolherTipoDocumento;
    documentoGerar: DocumentoGerar;
    inserirFormulario: InserirFormulario;
    procedimentoPaginar: ProcedimentoPaginar;
    procedimentoEscolherTipo: ProcedimentoEscolherTipo;
    procedimentoGerar: ProcedimentoGerar;
    gerarProcessoRelacionado: GerarProcessoRelacionado;
    procedimentoAlterar: ProcedimentoAlterar;
    acompanhamentoCadastrar: AcompanhamentoCadastrar;
    procedimentoEnviar: ProcedimentoEnviar;
    procedimentoAtualizarAndamento: ProcedimentoAtualizarAndamento;
    procedimentoAtribuicaoCadastrar: ProcedimentoAtribuicaoCadastrar;
    procedimentoRelacionar: ProcedimentoRelacionar;
    arvoreOrdenar: ArvoreOrdenar;
    acessoExternoGerenciar: AcessoExternoGerenciar;
    anotacaoRegistrar: AnotacaoRegistrar;
    andamentoMarcadorGerenciar: AndamentoMarcadorGerenciar;
    procedimentoArvoreHtml: ProcedimentoArvoreHtml;
    documentoAlterar: DocumentoAlterar;
    private dialogAnexos: JQuery<HTMLElement>;

    numeroSEI: string;
    tipoProcessoSEI: string;
    unidadeAtual: string;
    idProcedimento: string;
    linksExternos: Map<string, string> = new Map();

    constructor() {
        super();
        this.className = 'ProcedimentoTrabalhar';
        this.arvoreVisualizar = null;
        this.procedimentoVisualizar = null;
        this.documentoReceber = null;
        this.editor = null;
        this.escolherTipoDocumento = null;
        this.documentoGerar = null;
        this.inserirFormulario = null;
        this.procedimentoPaginar = null;
        this.procedimentoArvoreHtml = null;
        this.procedimentoEscolherTipo = null;
        this.procedimentoGerar = null;
        this.gerarProcessoRelacionado = null;
        this.procedimentoAlterar = null;
        this.acompanhamentoCadastrar = null;
        this.procedimentoEnviar = null;
        this.procedimentoAtualizarAndamento = null;
        this.procedimentoAtribuicaoCadastrar = null;
        this.procedimentoRelacionar = null;
        this.arvoreOrdenar = null;
        this.acessoExternoGerenciar = null;
        this.anotacaoRegistrar = null;
        this.andamentoMarcadorGerenciar = null;
        this.numeroSEI = '';
        this.tipoProcessoSEI = '';
        this.procedimentoVisualizar = new ProcedimentoVisualizar(this);
        this.documentoReceber = new DocumentoReceber(this);
        this.arvoreVisualizar = new ProcedimentoArvoreVisualizar(this);
        this.escolherTipoDocumento = new EscolherTipoDocumento(this);
        this.documentoGerar = new DocumentoGerar(this);
        this.inserirFormulario = new InserirFormulario(this);
        this.procedimentoPaginar = new ProcedimentoPaginar(this);
        this.procedimentoEscolherTipo = new ProcedimentoEscolherTipo();
        this.procedimentoGerar = new ProcedimentoGerar();
        this.gerarProcessoRelacionado = new GerarProcessoRelacionado(this);
        this.procedimentoAlterar = new ProcedimentoAlterar(this);
        this.acompanhamentoCadastrar = new AcompanhamentoCadastrar(this);
        this.procedimentoEnviar = new ProcedimentoEnviar(this);
        this.procedimentoAtualizarAndamento = new ProcedimentoAtualizarAndamento(this);
        this.procedimentoAtribuicaoCadastrar = new ProcedimentoAtribuicaoCadastrar(this);
        this.procedimentoRelacionar = new ProcedimentoRelacionar(this);
        this.arvoreOrdenar = new ArvoreOrdenar(this);
        this.acessoExternoGerenciar = new AcessoExternoGerenciar(this);
        this.anotacaoRegistrar = new AnotacaoRegistrar(this);
        this.andamentoMarcadorGerenciar = new AndamentoMarcadorGerenciar(this);
        this.procedimentoArvoreHtml = new ProcedimentoArvoreHtml(this);
        this.documentoAlterar = new DocumentoAlterar(this);

        this.editor = new Editor(this);
    }


    async loadBodyFormulario(numeroDocumento: string): Promise<HTMLBodyElement> {
        let formPesquisa = <HTMLFormElement>this.document.getElementById('frmProtocoloPesquisaRapida');
        let form = new FormData(formPesquisa);
        form.set('txtPesquisaRapida', numeroDocumento);
        let r1 = await AnexosTools.getRequest(formPesquisa.action, "POST", 'document', form);

        let ifr = <HTMLIFrameElement>(<Document>r1.response).getElementById('ifrArvore');
        let r2 = await AnexosTools.getRequest(ifr.src, "POST", 'document');
        let links = AnexosTools.loadLinks(r2.response);
        let linkComTodosIds = links.filter((l) => {
            if (l.acao && l.idExternoDocumento) {
                if (l.acao === 'arvore_visualizar' && l.idExternoDocumento === numeroDocumento) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }

        });
        if (linkComTodosIds.length > 0) {
            let linkVisualizar = links.filter((l) => {
                if (l.acao && l.idDocumento) {
                    if (l.acao === 'documento_visualizar' && l.idDocumento === linkComTodosIds[0].idDocumento) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }

            });
            if (linkVisualizar.length > 0) {
                let r3 = await AnexosTools.getRequest(linkVisualizar[0].link, "POST", 'document');
                if (r3.response) {
                    return <HTMLBodyElement>(<Document>r3.response).body;
                }
            }
        }
        return null;
    }

    async iniciar() {
        await super.iniciar();
        this.escolherTipoDocumento.preLoad();
        this.addHiddenInputFile();
        this.startDialogAnexos();
        pdfjsLib.GlobalWorkerOptions.workerSrc = this.document.scripts.namedItem('lib/pdf.worker.js').src;
        let selInfraUnidades = <HTMLSelectElement>this.querySelector('#selInfraUnidades')
        let selectedOptions = selInfraUnidades.selectedOptions;
        this.unidadeAtual = selectedOptions[0].innerText;
        this.idProcedimento = /(?:id_procedimento|id_protocolo)=([0-9]+)/.exec(this.document.baseURI)[0];
    }

    private calcCaptcha(id1: number, id2: number) {
        //91-96; caracteres especiais
        //58-64;
        let id3 = Math.round((id1 + id2) / 2 + 0.1);
        let id4 = Math.round((id1 + id2) / 2 - 0.1);
        if (id3 >= 91 && id3 <= 96 || id3 >= 58 && id3 <= 64) if (id1 > id2) id3 = id2; else id3 = id1;
        if (id4 >= 91 && id4 <= 96 || id4 >= 58 && id4 <= 64) if (id1 > id2) id4 = id1; else id4 = id2;
        let cap = String.fromCharCode(id1, id2, id3, id4);
        return cap;
    }
    async carregarLinkExterno(docSEIs: DocSEI[]) {

        // let r = await AnexosTools.getRequest('https://' + this.document.location.host + '/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0', 'GET', 'document');
        // let doc = <Document>r.response;
        // if (!doc) return null;

        let pesquisar = async (doc?: Document, numeroDocumento?: string, numeroProcessoSei?: string) => {
            let formData: FormData;
            if (doc) {
                let form = <HTMLFormElement>doc.getElementById('seiSearch');
                let imgCaptcha = doc.querySelector<HTMLImageElement>('#lblCaptcha>img');
                let rx = /codetorandom=(?<id1>\d+)\-(?<id2>\d+)/;
                let imgSrc = rx.exec(imgCaptcha.src);
                let id1 = parseInt(imgSrc.groups.id1);
                let id2 = parseInt(imgSrc.groups.id2);
                let captcha = this.calcCaptcha(id1, id2);
                formData = new FormData(form);
            } else {
                formData = new FormData();
            }

            formData.set("txtProtocoloPesquisa", (numeroDocumento ? numeroDocumento : numeroProcessoSei));
            // formData.set("txtCaptcha", captcha);
            formData.set("txtCaptcha", "5I5I");
            formData.set("sbmPesquisar", "Pesquisar");
            formData.set("q", "");
            numeroDocumento ? formData.set("chkSinDocumentosGerados", "G") : null;
            numeroDocumento ? formData.set("chkSinDocumentosRecebidos", "R") : null;
            numeroProcessoSei ? formData.set("chkSinProcessos", "P") : null;
            formData.set("txtParticipante", "");
            formData.set("hdnIdParticipante", "");
            formData.set("txtUnidade", "");
            formData.set("hdnIdUnidade", "");
            formData.set("selTipoProcedimentoPesquisa", "");
            formData.set("selSeriePesquisa", "");
            formData.set("txtDataInicio", "");
            formData.set("txtDataFim", "");
            formData.set("txtNumeroDocumentoPesquisa", "");
            formData.set("txtAssinante", "");
            formData.set("hdnIdAssinante", "");
            formData.set("txtDescricaoPesquisa", "");
            formData.set("txtAssunto", "");
            formData.set("hdnIdAssunto", "");
            formData.set("txtSiglaUsuario1", "");
            formData.set("txtSiglaUsuario2", "");
            formData.set("txtSiglaUsuario3", "");
            formData.set("txtSiglaUsuario4", "");
            formData.set("hdnSiglasUsuarios", "");
            formData.set("hdnSiglasUsuarios", "");
            formData.set("hdnCaptchaMd5", "ab64b90dec9cb168038107820d36af71");

            numeroDocumento ? formData.set("partialfields", "prot_pesq:*" + numeroDocumento + "* AND sta_prot:G;R") : null;
            numeroProcessoSei ? formData.set("partialfields", "prot_pesq:*" + numeroProcessoSei.replace(/[^0-9]/g, '') + "* AND sta_prot:P") : null;
            formData.set("requiredfields", "");
            formData.set("as_q", "");
            formData.set("hdnFlagPesquisa", "1");
            let r1 = await AnexosTools.getRequest('https://' + this.document.location.host + '/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0', 'POST', 'document', formData);
            let doc1 = <Document>r1.response;
            return doc1;
        }
        let carregarLink = async (docSEI: DocSEI) => {
            let pesquisarDocumento = await pesquisar(null, docSEI.numeroDePesquisaSei);
            let anchors = pesquisarDocumento.querySelectorAll('a');
            let href: string;
            for (let index = 0; index < anchors.length; index++) {
                let a = anchors[index];
                if (a.innerText.trim().length > 0 && (a.innerText.trim() === docSEI.numeroDePesquisaSei.trim() || a.innerText.trim() === docSEI.nomeCompletoSpan.trim() || a.innerText.trim() === (<string>docSEI.nomeAnexo).trim())) {
                    href = a.href;
                    break;
                }
            }
            if (href) {
                docSEI.LINK_EXTERNO = '<a href="' + href + '" target="_blank">' + docSEI.numeroDePesquisaSei + '</a>';
                return href;
            } else {


            }
        }
        let linkExternoProcessoSEI: string;



        let carregarDocSEI = (link: string, txtLink: string) => {
            docSEIs.some((docSEI) => {
                if (txtLink.trim() === docSEI.numeroDePesquisaSei.trim()) {
                    docSEI.LINK_EXTERNO = '<a href="' + link + '" target="_blank">' + docSEI.numeroDePesquisaSei + '</a>';
                    docSEI.linkExterno = link;
                    let arnchor = <HTMLAnchorElement>this.procedimentoVisualizar.document?.getElementById('anchor' + docSEI.numeroInternoDoDocumento);
                    if (arnchor && arnchor.href === 'about:blank') {
                        arnchor.href = link;
                        arnchor.querySelector('span')?.removeAttribute('style');
                        arnchor.onclick = () => {
                            let ifrVisualizacao = <HTMLIFrameElement>this.document.getElementById('ifrVisualizacao');
                            if (ifrVisualizacao) {
                                ifrVisualizacao.contentDocument.location.href = arnchor.href;
                            }
                        }
                    }
                    return true;
                }
                return false;
            });
        }


        if (this.linksExternos.values.length > 0) {
            docSEIs.forEach((docSEI) => {
                let href = this.linksExternos.get(docSEI.numeroDePesquisaSei);
                if (href) {
                    carregarDocSEI(href, docSEI.numeroDePesquisaSei);
                }
            });
            return docSEIs;
        }


        let pesquisarProcesso = await pesquisar(null, null, this.numeroSEI);
        let anchors = pesquisarProcesso.querySelectorAll('a');
        for (let index = 0; index < anchors.length; index++) {
            let a = anchors[index];
            if (a.innerText.trim().length > 0 && (a.innerText.trim() === this.numeroSEI.trim())) {
                linkExternoProcessoSEI = a.href;
                break;
            }
        }
        if (linkExternoProcessoSEI) {
            let abrirDocumentosProcesso = await AnexosTools.getRequest(linkExternoProcessoSEI, 'GET', 'document');
            let documentoProcesso = <Document>abrirDocumentosProcesso.response;
            if (documentoProcesso) {
                let anchors = documentoProcesso.querySelectorAll('a');

                for (let index = 0; index < anchors.length; index++) {
                    let a = anchors[index];

                    if (a.innerText.trim().length > 0) {
                        let rc = /\('(?<link>.*)'\)/;
                        let arr = rc.exec(a.outerHTML);
                        if (arr) {
                            a.href = arr.groups.link;
                            this.linksExternos.set(a.innerText.trim(), a.href);//carregar links externos
                            carregarDocSEI(a.href, a.innerText);
                        }
                    }
                }



            }
        }


        return docSEIs;

    }

    private addHiddenInputFile() {
        let formFileUpload = <HTMLFormElement>this.document.getElementById('formFileUpload');
        if (!formFileUpload) {
            formFileUpload = this.document.createElement('form');
            formFileUpload.id = 'formFileUpload';
            let input = this.document.createElement("input");
            input.type = 'file';
            input.id = 'inputFileUpload';
            input.setAttribute("style", "visibility:hidden;");
            input.setAttribute("multiple", 'multiple');
            let div = <HTMLElement>this.querySelector("#divInfraBarraSistemaE");
            div.append(formFileUpload);
            formFileUpload.append(input);
            input.onchange = async (evt) => {
                let files = evt.target.files;
                let anexos = await AnexosTools.gerarAnexos(files);
                await this.inserirAnexos(anexos, true);
            };
        }
    }
    async inserirAnexos(anexos: Anexos, dialog: boolean) {
        if (!anexos || anexos.length === 0) return;
        await this.waitLoadWindow();
        let inserir = new InserirAnexos(this, anexos, dialog);
        await inserir.carregarAnexos();
        return inserir;
    }
    async selecionarOpcao(opcao: 'Iniciar Processo Relacionado' | "Incluir Documento") {
        if (opcao == 'Iniciar Processo Relacionado') {
            return this.abrirLink('procedimento_escolher_tipo_relacionado');
        }
        else {
            return await this.abrirLink('documento_escolher_tipo');
        }
    }
    async abrirLink(acao: 'documento_escolher_tipo' | 'procedimento_escolher_tipo_relacionado' | 'procedimento_alterar') {
        let ifrArvoreVisualizar = <HTMLIFrameElement>document.getElementById('ifrVisualizacao');
        await AnexosTools.onWindowload(ifrArvoreVisualizar.contentWindow);
        let linkBtnIncluirDocumento = await this.procedimentoVisualizar.getLink(acao);
        let w = ifrArvoreVisualizar.contentWindow;
        w.location.href = linkBtnIncluirDocumento.link;
        return true;
    }
    private startDialogAnexos() {
        let d = this.document.getElementById('dialog-inserir-anexos');
        if (!d) {
            this.document.body.insertAdjacentHTML('afterend', `
            <div id="dialog-inserir-anexos">
            <fieldset id="fieldFormato">
            <legend>Formato</legend>
            <select id="extensionFormatoArquivo" name="extensionFormatoArquivo">
            <option value="manter" selected="selected">Manter o que foi configurado anexo por anexo</option>
            <option value="Nato-digital">Nato-digital</option>
            <option value="Cópia Autenticada Administrativamente">Cópia Autenticada Administrativamente</option>
            <option value="Cópia Autenticada por Cartório">Cópia Autenticada por Cartório</option>
            <option value="Cópia Simples">Cópia Simples</option>
            <option value="Documento Original">Documento Original</option>
            </select>
            </fieldset>
            <fieldset>
            <legend>Tipo de acesso</legend>
            <select id="extensionTipoDeAcesso" name="extensionTipoDeAcesso">
            <option value="manter" selected="selected">Manter o que foi configurado anexo por anexo</option>
            <option value="Público">Público</option>
            </select>
            </fieldset>
            </div>
        `);


            let selTrabalharHipoteses = <HTMLSelectElement>this.document.getElementById('extensionTipoDeAcesso');
            AnexosTools.getCfg().hipotesesExistentes.forEach((h) => {
                let op = this.document.createElement('option');
                op.value = h;
                op.innerText = h;
                selTrabalharHipoteses.append(op);
            })


            this.dialogAnexos = $("#dialog-inserir-anexos").dialog({
                autoOpen: false,
                height: 200,
                width: 600,
                modal: true
            });
        }
    }

    loadDialog(formato: boolean, ocultarManter: boolean, preSelecionar: string | RegExp, txtBtnCarregar: string, titulo: string) {
        let _fieldFormato = this.document.getElementById('fieldFormato');
        let _extensionTipoDeAcesso = <HTMLSelectElement>this.document.getElementById('extensionTipoDeAcesso');
        if (formato) {
            _fieldFormato.hidden = false;
        } else {
            _fieldFormato.hidden = true;
        }
        if (ocultarManter) {
            _extensionTipoDeAcesso.querySelector('[value="manter"]')?.remove();
        } else {
            if (!_extensionTipoDeAcesso.querySelector('[value="manter"]')) {
                let op = this.document.createElement('option');
                op.value = 'manter';
                op.innerText = 'Manter o que foi configurado anexo por anexo';
                _extensionTipoDeAcesso.insertAdjacentElement('afterbegin', op);
                op.selected = true;
            }
        }
        if (preSelecionar) {
            for (let index = 0; index < _extensionTipoDeAcesso.options.length; index++) {
                let op = _extensionTipoDeAcesso.options[index];
                if (typeof preSelecionar === 'string') {
                    if (op.value.startsWith(preSelecionar)) {
                        op.selected = true;
                        break;
                    }
                } else {
                    if (op.value.match(preSelecionar)) {
                        op.selected = true;
                        break;
                    }
                }

            }

        }

        return new Promise<{ formato: FormatoDoArquivo, hipoteselegal: Hipoteselegal }>((resolve, reject) => {
            this.dialogAnexos.dialog({
                autoOpen: false,
                height: 200,
                width: 600,
                modal: true,
                title: titulo,
                buttons: [
                    {
                        text: txtBtnCarregar,
                        id: '_inserirAnexos',
                        click: () => {

                            let formato = <FormatoDoArquivo>(<HTMLInputElement>this.document.getElementById("extensionFormatoArquivo")).value;
                            let hipoteselegal = <Hipoteselegal>(<HTMLInputElement>this.document.getElementById("extensionTipoDeAcesso")).value;
                            resolve({ formato: formato, hipoteselegal: hipoteselegal });
                            this.dialogAnexos.dialog("close");
                        }
                    },
                    {
                        text: 'Cancelar',
                        click: () => {
                            resolve(null);
                            this.dialogAnexos.dialog("close");
                        }
                    }
                ]
            });
            this.dialogAnexos.dialog("open");
            this.document.getElementById('_inserirAnexos').focus();
        });
    }


    loadFrames(_doc: Document) {
        let frames = Array.from(_doc.getElementsByTagName('iframe'));
        frames.forEach(iframe => {
            let f = (w: Window) => {
                let rx = /acao=([a-zA-Z_]+)/.exec(w.document.URL);
                let acao: string;
                if (rx && rx[1].length > 1) acao = rx[1];

                if (acao) this.handlerVisualização(acao, w);
                if (w.document) this.loadFrames(w.document);
            }

            AnexosTools.onWindowload(iframe.contentWindow).then((w) => {
                iframe.addEventListener('load', () => f(w));
                f(w);
            });
        });

    }


    handlerVisualização(acao: string, window: Window) {
        switch (acao) {
            case 'procedimento_visualizar': {
                if (this.verbose) console.log('VIEW: procedimento_visualizar');
                this.procedimentoVisualizar.setWindow(window);
                break;
            }
            case 'arvore_visualizar': {
                if (this.verbose) console.log('VIEW: arvore_visualizar');
                this.arvoreVisualizar.setWindow(window);
                break;
            }
            case 'documento_alterar_recebido': {
                if (this.verbose) console.log('VIEW: documento_alterar');
                this.documentoAlterar.setWindow(window);
                break;
            }
            case 'documento_alterar': {
                if (this.verbose) console.log('VIEW: documento_alterar');
                this.documentoAlterar.setWindow(window);
                break;
            }
            case 'documento_upload_anexo': {
                if (this.verbose) console.log('VIEW: documento_upload_anexo');
                break;
            }
            case 'documento_escolher_tipo': {
                if (this.verbose) console.log('VIEW: documento_escolher_tipo');
                this.escolherTipoDocumento.setWindow(window);
                break;
            }
            case 'documento_gerar': {
                if (this.verbose) console.log('VIEW: documento_gerar');
                this.documentoGerar.setWindow(window);
                break;
            }
            case 'editor_montar': {
                if (this.verbose) console.log('VIEW: editor_montar');
                let procedimentoTrabalhar = (<WindowTrabalhar>window.opener.top).procedimentoTrabalhar;
                procedimentoTrabalhar.editor.setWindow(window);
                break;
            }
            case 'documento_receber': {
                if (this.verbose) console.log('VIEW: documento_receber');
                this.documentoReceber.setWindow(window);
                break;
            }
            case 'procedimento_escolher_tipo': {
                if (this.verbose) console.log('VIEW: procedimento_escolher_tipo');
                if (window.opener && (<WindowControlar>window.opener).procedimentoControlar)
                    (<WindowControlar>window.opener).procedimentoControlar.procedimentoEscolherTipo.setWindow(window);
                this.procedimentoEscolherTipo.setWindow(window);
                break;
            }
            case 'procedimento_escolher_tipo_relacionado': {
                if (this.verbose) console.log('VIEW: procedimento_escolher_tipo_relacionado');
                this.procedimentoEscolherTipo.setWindow(window);
                break;
            }
            case 'procedimento_gerar_relacionado': {
                if (this.verbose) console.log('VIEW: procedimento_gerar_relacionado');
                this.procedimentoGerar.setWindow(window);
                break;
            }
            case 'procedimento_gerar': {
                if (this.verbose) console.log('VIEW: procedimento_gerar');
                if (window.opener && (<WindowControlar>window.opener).procedimentoControlar)
                    (<WindowControlar>window.opener).procedimentoControlar.procedimentoGerar.setWindow(window);
                this.procedimentoGerar.setWindow(window);
                break;
            }
            case 'procedimento_alterar': {
                if (this.verbose) console.log('VIEW: procedimento_alterar');
                this.procedimentoAlterar.setWindow(window);
                break;
            }
            case 'acompanhamento_cadastrar': {
                if (this.verbose) console.log('VIEW: acompanhamento_cadastrar');
                this.acompanhamentoCadastrar.setWindow(window);
                break;
            }
            case 'procedimento_enviar': {
                if (this.verbose) console.log('VIEW: procedimento_enviar');
                this.procedimentoEnviar.setWindow(window);
                break;
            }
            case 'procedimento_atualizar_andamento': {
                if (this.verbose) console.log('VIEW: procedimento_atualizar_andamento');
                this.procedimentoAtualizarAndamento.setWindow(window);
                break;
            }
            case 'procedimento_atribuicao_cadastrar': {
                if (this.verbose) console.log('VIEW: procedimento_atribuicao_cadastrar');
                this.procedimentoAtribuicaoCadastrar.setWindow(window);
                break;
            }
            case 'procedimento_relacionar': {
                if (this.verbose) console.log('VIEW: procedimento_relacionar');
                this.procedimentoRelacionar.setWindow(window);
                break;
            }
            case 'arvore_ordenar': {
                if (this.verbose) console.log('VIEW: arvore_ordenar');
                this.arvoreOrdenar.setWindow(window);
                break;
            }
            case 'acesso_externo_gerenciar': {
                if (this.verbose) console.log('VIEW: acesso_externo_gerenciar');
                this.acessoExternoGerenciar.setWindow(window);
                break;
            }
            case 'anotacao_registrar': {
                if (this.verbose) console.log('VIEW: anotacao_registrar');
                this.anotacaoRegistrar.setWindow(window);
                break;
            }
            case 'andamento_marcador_gerenciar': {
                if (this.verbose) console.log('VIEW: andamento_marcador_gerenciar');
                this.andamentoMarcadorGerenciar.setWindow(window);
                break;
            }
            case 'documento_visualizar': {
                if (this.verbose) console.log('VIEW: documento_visualizar');
                this.procedimentoArvoreHtml.setWindow(window);
                break;
            }
            default: {
                if (this.verbose) console.log('VIEW: URL sem implementação: ' + acao);
            }
        }
    }

}

var procedimentoTrabalhar = new ProcedimentoTrabalhar();
AnexosTools.onWindowload(window).then(async () => {
    procedimentoTrabalhar.setWindow(window);
    procedimentoTrabalhar.loadFrames(window.document);
});

if (window.opener && (<WindowControlar>window.opener).procedimentoControlar) {
    (<WindowControlar>window.opener).procedimentoControlar.setProcedimentoTrabalhar(procedimentoTrabalhar);
}


