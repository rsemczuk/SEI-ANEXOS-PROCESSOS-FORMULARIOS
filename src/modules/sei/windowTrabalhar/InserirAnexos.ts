class InserirAnexos {
    private procedimentoTrabalhar: ProcedimentoTrabalhar;
    anexos: Anexos;
    private dialog: boolean;
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar, anexos: Anexos, dialog?: boolean) {
        this.procedimentoTrabalhar = procedimentoTrabalhar;
        this.anexos = anexos;
        this.dialog = dialog;
    }

    carregarAnexos() {
        return new Promise<boolean>(async (resolve, reject) => {
            let a = await this.iniciar();
            if (a) {
                for (let anexo of this.anexos) {
                    if (anexo.inserirAnexo) {
                        await this.inserirAnexo(anexo);
                    }
                }
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
    private async inserirAnexo(anexo: Anexo) {
        await this.procedimentoTrabalhar.escolherTipoDocumento.abrirFormularioSemCarregarTela(/Externo/);
        await this.procedimentoTrabalhar.documentoReceber.preencherSalvarAnexo(anexo);
    }
    private iniciar() {
        return new Promise<boolean>(async (resolve, reject) => {
            if (this.anexos.length > 0) {
                let dialogResult: DialogTrabalharResult = { formato: 'manter', hipoteselegal: 'manter' };
                if (this.dialog) dialogResult = await this.procedimentoTrabalhar.loadDialog(true, false, null, 'Inserir','SEI: Opções do(s) anexo(s)');
                if (dialogResult !== null) {
                    if (dialogResult.hipoteselegal.match(/^manter$/i)) {

                    } else {
                        for (let anexo of this.anexos) {
                            anexo.hipoteseLegal = dialogResult.hipoteselegal;
                            anexo.nivelAcesso = 'restrito';
                        }
                    }

                    if (dialogResult.formato.match(/^manter$/i)) {

                    } else {
                        for (let anexo of this.anexos) {
                            anexo.formato = dialogResult.formato;
                        }
                    }



                    if (this.anexos.length > 1) {
                        this.anexos.sort(function (a, b) {
                            // let rx = /^([\w]+[_ -]+)(\d+)(?:[-_ ]?([0-9]{4}))?([^\.]*)/i;
                            let nameA = a.nomeAnexo + ' ' + a.nomeCompleto;
                            let nameB = b.nomeAnexo + ' ' + b.nomeCompleto;
                            return nameA.localeCompare(nameB);
                        });
                    }
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                console.log('a inserção de anexo(s) cancelada, não há arquivos a serem inseridos');
                resolve(false);
            }
        });
    }

}
