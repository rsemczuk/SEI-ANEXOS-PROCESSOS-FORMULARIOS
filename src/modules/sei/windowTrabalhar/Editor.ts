interface DadosLinkSEI {
    numeroInterno: string;
    protocoloFormatado: string;
    identificacao: string;
}

class Editor extends ProcedimentoTrabalharClassModel {
    private editableWindows: Window[];
    DOC_GERADO: DocSEI;
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'Editor';
    }

    linksCarregados: DadosLinkSEI[] = [];

    save() {
        return new Promise<boolean>(async (resolve, reject) => {
            for (let instance of Object.values(this.window.CKEDITOR.instances)) {
                await (<any>instance).updateElement();
            }
            setTimeout(() => {
                let form = <HTMLFormElement><unknown>this.document.getElementById('frmEditor');
                form.submit();
                this.editableWindows.forEach((b) => {
                    if (b.dispatchEvent) {
                        b.dispatchEvent(new Event('focus'));
                        b.dispatchEvent(new Event('click'));
                        b.dispatchEvent(new Event('change'));
                        b.dispatchEvent(new Event('keyup'));
                        b.dispatchEvent(new Event('keydown'));
                        let p = b.document.body.querySelector('p');
                        if (p) p.dispatchEvent(new Event('focus'));
                    }
                    // b.dispatchEvent(new Event('submit'));
                });
                resolve(true);
            }, 500);
        });
    }
    async loadWindowsEditable(formularioConfig: FormularioConfig, documentos: DocSEI[]) {
        return new Promise<Window[]>(async (resolve: (body: Window[]) => void) => {
            await this.waitLoadElements('#divEditores>.cke');

            // CARREGAR WINDOWS EDITAVEIS
            this.editableWindows = [];
            for (let instance of Object.values<any>(this.window.CKEDITOR.instances)) {
                let ab = new AbstractSubClassEngine();
                ab.setWindow(instance.window.$);
                await ab.waitLoadElements('[contenteditable]', 2000);
                if (ab.document.body.contentEditable === "true") {
                    this.editableWindows.push(ab.window);
                }
            }
            // PRÉ CARREGAR ITENS
            let allStr = '';
            allStr += formularioConfig.observacoesDaUnidade;
            allStr += formularioConfig.descricaoDoFormulario;
            formularioConfig.procurarInserirParagrafos?.forEach((procurar) => {
                procurar.paragrafos?.forEach((paragrafo) => {
                    allStr += paragrafo?.texto;
                })
            })
            this.editableWindows.forEach((w) => {
                allStr += w.document.body.innerText;
            });
            //carregar links externos, caso encontre a chamada no formulário
            let plinksExternos: Promise<DocSEI[]>[] = [];
            let rxLinkExterno = /LINK_EXTERNO/;
            if (allStr.match(rxLinkExterno)) {
                for (let doc of (documentos || [])) {
                    if (doc.eFormulario && doc.assinado && doc.nivelAcesso === 'público' || !doc.eFormulario && doc.nivelAcesso === 'público') {
                        plinksExternos.push(this.procedimentoTrabalhar.carregarLinkExterno([doc]));
                    } else {
                        doc.LINK_EXTERNO = doc.LINK;
                    }
                }
            }
            //carregar links SEI caso encontre a chamada no formulário
            let rx = /LINK_SEI\(['"](?<numero>(.+?(?=(?:'|"))))['"]\)/g;
            for (let r of allStr.matchAll(rx)) {
                if (!this.getIDProcessoSEI(r.groups.numero)) {
                    let l = await this.getIDProcesso(r.groups.numero);
                    if (l) this.linksCarregados.push(l);
                }
            }
            await Promise.all(plinksExternos);
            let form = <HTMLFormElement>this.document.getElementById('frmEditor');
            let idDocumento = /id_documento=(\d+)/.exec(form.action)[1];
            this.DOC_GERADO = Object.assign({}, await this.procedimentoTrabalhar.procedimentoVisualizar.getDocSEI(idDocumento));
            delete this.DOC_GERADO.checkBox;
            delete this.DOC_GERADO.imgCopiar;
            delete this.DOC_GERADO.span;
            resolve(this.editableWindows);
        });
    }
    async iniciar() {
        await super.iniciar();
    }

    private getLinkExternoDeOutrosProcessos(numeroDocumento: string) {


    }

    getIDProcessoSEI(protocoloFormatado: string) {
        for (let l of this.linksCarregados) {
            if (l.protocoloFormatado.replace(/[^0-9]/gm, '') === protocoloFormatado.replace(/[^0-9]/gm, '')) {
                return l;
            }
        }
        return null;
    }

    private async getIDProcesso(numero: string) {
        await this.waitLoadElements('#frmEditor');
        numero = numero.replace(/[^0-9]/gm, '');
        let frmEditor = <HTMLFormElement><unknown>this.document.getElementById('frmEditor');
        let action = /(controlador_ajax\.php\?acao_ajax\=protocolo_link_editor\&infra_sistema\=[0-9]+\&infra_unidade_atual\=[0-9]+\&infra_hash\=[0-9a-zA-Z]+)/.exec(this.document.head.outerHTML)[1];
        let idProcedimento = /id_procedimento\=([0-9]+)/.exec(frmEditor.action)[1];
        let idDocumento = /id_documento\=([0-9]+)/.exec(frmEditor.action)[1];
        let formData = new FormData();
        formData.set('idProtocoloDigitado', numero);
        formData.set('idProcedimento', idProcedimento);
        formData.set('idDocumento', idDocumento);
        let httpResponse = await AnexosTools.getRequest(action, 'POST', 'text', formData);
        let response: string = httpResponse.response;
        let rxId = /IdProtocolo"\>([^<]+)/im;
        if (response.match(rxId)) {
            let idProtocolo = rxId.exec(response)[1];
            let protocoloFormatado = /ProtocoloFormatado"\>([^<]+)/im.exec(response)[1];
            let identificacao = /Identificacao"\>([^<]+)/im.exec(response)[1];
            return { numeroInterno: idProtocolo, protocoloFormatado: protocoloFormatado, identificacao: identificacao };

        } else {
            return null;
        }

    }
}
