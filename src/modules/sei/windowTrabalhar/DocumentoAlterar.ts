class DocumentoAlterar extends ProcedimentoTrabalharClassModel {
    // tela de gerar dados do formulário formulário ou anexo obs. recebe a tela de anexo e de formulário
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'DocumentoAlterar';
    }
    async iniciar() {
        await super.iniciar();
        this.waitLoadElements<HTMLOptionElement>('#selHipoteseLegal>option').then((hipoteseLegais) => {
            if (hipoteseLegais) AnexosTools.updateHipoteses(hipoteseLegais.reduce((p, cur) => { p.push(cur.innerText); return p; }, <string[]>[]));
        });
    }
    async alterarNivelDeAcesso(docSEI: DocSEI, dialogResult?: DialogTrabalharResult) {
        if (docSEI.estaCancelado) return;
        let ifrArvoreVisualizar = <HTMLIFrameElement>this.procedimentoTrabalhar.document.getElementById('ifrVisualizacao');
        let _dialogResult = dialogResult ? dialogResult : await this.procedimentoTrabalhar.loadDialog(false, true, /^Informação Pessoal/i, 'Alterar', 'Opções para alterar')

        if (_dialogResult && _dialogResult.hipoteselegal !== 'manter' && _dialogResult.hipoteselegal.trim().length > 0) {
            let w = ifrArvoreVisualizar.contentWindow;
            w.location.href = docSEI.linkAlterarDocumento;
            await this.waitLoadWindow();
            let optRestrito = <HTMLInputElement>this.document.getElementById('optRestrito');
            let btnSalvar = <HTMLButtonElement>this.document.getElementById('btnSalvar');
            let salvar = false;
            if (_dialogResult.hipoteselegal.trim() === 'Público') {
                let optPublico = <HTMLInputElement>this.document.getElementById('optPublico');
                if (!optPublico.checked) optPublico.click();
                salvar = true;

            } else {
                optRestrito.click();
                let selHipoteseLegal = await this.waitLoadElements<HTMLOptionElement>('#selHipoteseLegal>option');
                let match = selHipoteseLegal.some((el, index) => {
                    if (el.innerText.trim() === _dialogResult.hipoteselegal.trim()) {
                        el.selected = true;
                        return true;
                    }
                    return false;
                });
                if (match) {
                    salvar = true;
                } else {
                    let msg = '';
                    if (AnexosTools.getCfg().hipotesesExistentes.length === 0) {
                        msg = 'A lista de hipoteses não foi carregada corretamente, caso queira que esse erro seja corrigido favor enviar um email para regsemc@gmail.com';
                    } else {
                        msg = 'Não foi possível encontrar a hipotese legal nas opções deste documento, ela pode estar desabilitada para esse tipo de documento, favor selecionar uma manualmente';
                    }
                    alert(msg);
                }

            }

            if (salvar) {
                let promises = [
                    ,
                    ,

                ];
                btnSalvar.click();
                await this.onUnloadRun();
                await this.procedimentoTrabalhar.arvoreVisualizar.waitLoad();
                await this.procedimentoTrabalhar.arvoreVisualizar.onUnloadRun();
                await this.procedimentoTrabalhar.arvoreVisualizar.waitLoad();
            };

        } else if (_dialogResult) {
            alert('Favor selecionar a opção público ou alguma hipotese legal para restringir o acesso');
        }
        return _dialogResult;
    }
}
