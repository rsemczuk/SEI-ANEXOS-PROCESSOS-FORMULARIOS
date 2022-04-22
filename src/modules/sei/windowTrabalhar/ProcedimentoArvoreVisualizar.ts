class ProcedimentoArvoreVisualizar extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'ProcedimentoArvoreVisualizar';
    }



    async iniciar() {
        await super.iniciar();
        if (/id_documento=([0-9]+)/i.test(this.document.baseURI)) {
            let docNumero = /id_documento=([0-9]+)/i.exec(this.document.baseURI)[1];
            this.waitLoadElements('[class="ancoraArvoreDownload"]').then(async (anchors) => {
                if (anchors !== null) {
                    let a = <HTMLAnchorElement>anchors[0];
                    let docSei = await this.procedimentoTrabalhar.procedimentoVisualizar.getDocSEI(docNumero);
                    let dados = await new ExtrairDados().extrairDadosDoArquivoOuTexto(a.href, docSei.nomeCompleto);
                    if (docSei !== null) {
                        let nomeDocumento = docSei.nomeCompleto;
                        for (let coordenada of AnexosTools.getCfg().coordenadasPdf) {
                            if (nomeDocumento.match(new RegExp('^' + coordenada.nomeAnexo, 'i'))) {
                                if (docSei.dadosIniciais) {
                                    Object.assign(docSei, dados);
                                    docSei.dadosIniciais = false;
                                    this.procedimentoTrabalhar.procedimentoVisualizar.processarBtns(this.procedimentoTrabalhar.procedimentoVisualizar.processoAbertoNaUnidade);
                                }
                                break;
                            }
                        }
                    }
                }
            });

        }

        /**
         * incluir botões adicionar / personalizar botões
         */
        this.waitLoadElements('#divArvoreAcoes>a').then((anchors: HTMLAnchorElement[]) => {
            let div = anchors[0].parentElement;
            if (!(/sei_gerar_processo_relacionado.gif/i.test(div.innerHTML))) {
                let rxBtnRelacionado = /(<a href="controlador.php\?acao=procedimento_escolher_tipo_relacionado.*?<\/a>)/i;
                let linkBtnRelacionado = rxBtnRelacionado.exec(this.procedimentoTrabalhar.procedimentoVisualizar.window.document.head.innerHTML);
                if (linkBtnRelacionado) {
                    div.insertAdjacentHTML('afterbegin', linkBtnRelacionado[1]);
                }
            }
            if (!(/sei_incluir_documento.gif/i.test(div.innerHTML))) {
                let rxBtnIncluirDocumento = /(<a href="controlador.php\?acao=documento_escolher_tipo&.*?<\/a>)/i;
                let linkBtnIncluirDocumento = rxBtnIncluirDocumento.exec(this.procedimentoTrabalhar.procedimentoVisualizar.window.document.head.innerHTML);
                if (linkBtnIncluirDocumento) {
                    div.insertAdjacentHTML('afterbegin', linkBtnIncluirDocumento[1]);
                }
            }
            anchors.forEach((anchor) => {
                if (anchor.onclick && anchor.onclick.toString().match('excluirDocumento')) {
                    anchor.setAttribute('accesskey', 'X');
                }
                if (anchor.href.match(/^controlador.php\?acao=documento_escolher_tipo&/)) {
                    anchor.setAttribute('accesskey', 'N');
                }
                if (anchor.onclick && anchor.onclick.toString().match('concluirProcesso')) {
                    anchor.addEventListener('click', () => {
                        this.window.addEventListener('unload', () => {
                            setTimeout(() => this.procedimentoTrabalhar.procedimentoVisualizar.processarBtns(false), 1000);
                            this.procedimentoTrabalhar.procedimentoVisualizar.lerUnidadesAbertas();
                        })
                    })
                }
            })

        });

        this.waitLoadElements<HTMLOptionElement>('#selHipoteseLegal>option').then((hipoteseLegais) => {
            if (hipoteseLegais)
            AnexosTools.updateHipoteses(hipoteseLegais.reduce((p, cur) => { p.push(cur.innerText); return p; }, <string[]>[]));
        });
    }



    async reabrirProcesso() {
        if (this.window === null) {
            let anchorIrPaginaInicial = (<HTMLAnchorElement>this.procedimentoTrabalhar.procedimentoVisualizar.document.getElementById('anchor' + this.procedimentoTrabalhar.idProcedimento));
            anchorIrPaginaInicial.click();
        }
        let anchorReabrirProcesso = <HTMLAnchorElement>(await this.waitLoadElements('a[onclick="reabrirProcesso();"]', 10000))[0];
        anchorReabrirProcesso.click();
    }




}
