class InserirFormulario {
    className: string;
    documentos: DocSEI[];
    rxMatchEntities = /(?:<<<|&lt;&lt;&lt;)(.+?(?=(?:>>>|&gt;&gt;&gt;)))(?:>>>|&gt;&gt;&gt;)/;

    private procedimentoTrabalhar: ProcedimentoTrabalhar;
    private formularioConfig: FormularioConfig;
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        this.className = 'InserirFormulario';
        this.procedimentoTrabalhar = procedimentoTrabalhar;
    }



    private async inserirFormulario() {
        // await this.procedimentoTrabalhar.selecionarOpcao("Incluir Documento");
        // await this.procedimentoTrabalhar.escolherTipoDocumento.escolherFormulario(this.formularioConfig.nomeFormulario);
        await this.procedimentoTrabalhar.escolherTipoDocumento.abrirFormularioSemCarregarTela(<string>this.formularioConfig.nomeFormulario)
        if (this.formularioConfig.numeroModelo && this.formularioConfig.numeroModelo.length > 0 && parseInt(this.formularioConfig.numeroModelo)) {
            await this.procedimentoTrabalhar.documentoGerar.selecionarModeloDeDocumento(this.formularioConfig.numeroModelo);
        }
        await this.procedimentoTrabalhar.documentoGerar.selecionarNivelAcesso(this.formularioConfig.nivelAcesso);
        await this.procedimentoTrabalhar.documentoGerar.gerarFormulario();
        let btnSalvar = this.procedimentoTrabalhar.documentoGerar.document.getElementById('btnSalvar');
        btnSalvar.click();
        let windows = await this.procedimentoTrabalhar.editor.loadWindowsEditable(this.formularioConfig, this.documentos);
        for (let w of windows) {
            if (w.document.body.innerHTML.length > 0)
                this.run(w.document.body);
        }
    }



    private run(body: HTMLElement) {
        if (this.formularioConfig.procurarInserirParagrafos && this.formularioConfig.procurarInserirParagrafos.length > 0) {

            let listAdd: { elBase: HTMLElement, elCriado: HTMLElement, posicao: string }[] = [];
            let listRemove: HTMLElement[] = [];
            let elOk: HTMLElement[] = [];


            let percorrerAll = (el: HTMLElement) => {
                let jaAdd = elOk.some((_el) => {
                    return el === _el;
                });
                if (!jaAdd) { elOk.push(el) } else return;
                for (let index = 0; index < el.children.length; index++) {
                    let element = el.children[index];
                    percorrerAll(<HTMLElement>element);
                }
                // let remover = false;
                for (let inserirParagrafo of this.formularioConfig.procurarInserirParagrafos) {
                    if (el.innerHTML.match(inserirParagrafo.textoParaProcurar) || el.innerText.match(inserirParagrafo.textoParaProcurar)) {

                        if (el.tagName === 'P') {
                            if (inserirParagrafo.novoEstilo && inserirParagrafo.novoEstilo.length > 0) {
                                if (AnexosTools.getCfg().formatacaoParagrafos.some((p) => {
                                    return inserirParagrafo.novoEstilo === p;
                                })) {
                                    el.className = inserirParagrafo.novoEstilo;
                                }
                            }

                            if (inserirParagrafo.remover === true) {
                                listRemove.push(el);
                            }
                        }

                        for (let paragrafo of inserirParagrafo.paragrafos || []) {

                            let htmlParagrafos: HTMLParagraphElement[] = [];

                            for (let paragrafo of inserirParagrafo.paragrafos || []) {
                                let pCriado = this.criarParagrafo(paragrafo);
                                if (pCriado) htmlParagrafos.push(pCriado);
                            }
                            if (inserirParagrafo.posicaoParaInserir === 'substituir_texto') {
                                if (el.innerHTML.match(inserirParagrafo.textoParaProcurar)) {
                                    let texto = new GerarEntidadesTexto().adicionarEntidadesTexto(paragrafo.texto, this.procedimentoTrabalhar, this.documentos, false);
                                    el.innerHTML = el.innerHTML.replace(inserirParagrafo.textoParaProcurar, texto);
                                    if (el.tagName === 'P' && paragrafo.estilo) {
                                        el.className === paragrafo.estilo;
                                    }
                                } else if (el.innerText.match(inserirParagrafo.textoParaProcurar)) {
                                    let texto = new GerarEntidadesTexto().adicionarEntidadesTexto(paragrafo.texto, this.procedimentoTrabalhar, this.documentos, false);
                                    el.innerHTML = el.innerText.replace(inserirParagrafo.textoParaProcurar, texto);
                                    if (el.tagName === 'P' && paragrafo.estilo) {
                                        el.className === paragrafo.estilo;
                                    }
                                }
                            } else if (el.tagName === 'P') {
                                switch (inserirParagrafo.posicaoParaInserir) {
                                    case 'antes':
                                        for (let pCriado of htmlParagrafos.reverse()) {
                                            listAdd.push({ elBase: el, elCriado: pCriado, posicao: 'beforebegin' })
                                        }
                                        break;
                                    case 'apos':
                                        for (let pCriado of htmlParagrafos.reverse()) {
                                            listAdd.push({ elBase: el, elCriado: pCriado, posicao: 'afterend' })
                                        }
                                        break;
                                    case 'substituir_paragrafo':
                                        for (let pCriado of htmlParagrafos.reverse()) {
                                            el.insertAdjacentElement('afterend', pCriado);
                                        }
                                        el.remove();
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                }
            }
            percorrerAll(body);

            listAdd.forEach((obj) => {
                obj.elBase.insertAdjacentElement(<InsertPosition>obj.posicao, obj.elCriado);
            });
            listRemove.forEach((obj) => {
                obj.remove();
            });
        }
        this.adicionarEntidades(body);
    };
    private async iniciar(documentos: DocSEI[]) {
        if (documentos) {
            this.documentos = documentos;
        } else {
            this.documentos = await this.procedimentoTrabalhar.procedimentoVisualizar.getListClicados(this.formularioConfig.filtrarNomes);
        }
        if (AnexosTools.getCfg().testar_formulario) {
            let div = document.createElement('div');


            if (this.formularioConfig.numeroModelo) {
                let bodyModel = await this.procedimentoTrabalhar.loadBodyFormulario(this.formularioConfig.numeroModelo);

                div.innerHTML = bodyModel.innerHTML;
                this.run(div);
                div.innerHTML += bodyModel.ownerDocument.head.innerHTML
                Array.from(div.querySelectorAll('meta title')).forEach(el => el.remove());
                // AnexosTools.download('h',bodyModel.innerHTML);
            } else {
                for (let pa of this.formularioConfig.procurarInserirParagrafos) {
                    if (pa.paragrafos)
                        for (let paa of pa.paragrafos) {
                            let p = document.createElement('p');
                            let html = new GerarEntidadesTexto().adicionarEntidadesTexto(paa.texto, this.procedimentoTrabalhar, this.documentos, false);
                            p.insertAdjacentHTML('afterbegin', html);
                            div.append(p);
                        }
                }
            }


            this.startDialog();
            let modalBody = document.getElementById('dialog-testar-formulario');
            while (modalBody.firstChild) {
                modalBody.removeChild(modalBody.firstChild);
            }
            modalBody.append(div);
            this.testerModal.show();
            return false;
        } else {
            if (this.documentos.length < this.formularioConfig.qntItensSelecionados) {
                alert('Favor marcar pelo menos ' + AnexosTools.extenso(this.formularioConfig.qntItensSelecionados) + ' item dos quais deseja criar o formulário.');
                return false;
            }
            return true;
        }
    }

    async criarFormulario(formularioConfig: FormularioConfig, documentos: DocSEI[]) {
        this.formularioConfig = formularioConfig;
        if (!await this.iniciar(documentos)) return false;
        await this.inserirFormulario();
        await this.procedimentoTrabalhar.editor.save();
        await this.procedimentoTrabalhar.procedimentoVisualizar.onUnloadRun();
        return true;
    }


    private decodeHtml(html: string) {
        let txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    private encodeHtml(str: string) {
        let txt = document.createElement("textarea");
        txt.textContent = str;
        return txt.innerHTML;
    }
    private criarParagrafo(paragrafo: Paragrafo) {
        let p = document.createElement('p');
        p.className = paragrafo.estilo;
        let gerarEntidadesTexto = new GerarEntidadesTexto();
        p.innerHTML = gerarEntidadesTexto.adicionarEntidadesTexto(paragrafo.texto, this.procedimentoTrabalhar, this.documentos, false);
        if (paragrafo.estilo && paragrafo.estilo.length > 0) {
            p.className = paragrafo.estilo;
            p.innerHTML = p.innerHTML.replace(/__formatacao__/g, paragrafo.estilo);
        }
        else {
            p.innerHTML = p.innerHTML.replace(/__formatacao__/g, '');
        }
        return p;
    }
    private adicionarEntidades(element: HTMLElement) {
        let percorrerAll = (el: Element) => {
            Array.from(el.children).forEach(el1 => {
                percorrerAll(el1);
            });

            if (el.innerHTML.match(this.rxMatchEntities)) {
                el.innerHTML = new GerarEntidadesTexto().adicionarEntidadesTexto(el.innerHTML, this.procedimentoTrabalhar, this.documentos, false);
            }
        }
        percorrerAll(element);
    }

    testerModal: JQuery<Element>;
    private startDialog() {
        let d = document.getElementById('dialog-testar-formulario');
        if (!d) {
            document.body.insertAdjacentHTML('afterend', `
            <div id="dialog-testar-formulario" title="Testar formulário">

            </div>
        `);

        }
        this.testerModal = $("#dialog-testar-formulario").dialog({
            autoOpen: true,
            height: 600,
            width: 900,
            modal: true,
        });
    }

}


