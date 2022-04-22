class DocumentoGerar extends ProcedimentoTrabalharClassModel {
    // tela de gerar formulário
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'DocumentoReceber';
    }
    async iniciar() {
        await super.iniciar();
    }

    async selecionarNivelAcesso(nivelAcesso: NivelAcesso) {
        await this.waitLoadWindow();
        let idBtn = '';
        switch (nivelAcesso) {
            case 'público':
                idBtn = 'optPublico';
                break;
            case 'restrito':
                idBtn = 'optRestrito';
                break;
            case 'sigiloso':
                idBtn = 'optSigiloso';
                break;
            default:
                idBtn = 'optPublico';
                break;
        }
        let btn = await this.waitLoadElements('#' + idBtn);
        btn[0].click();
    }

    async gerarFormulario() {
        await this.waitLoadWindow();
        let btnSalvar = this.document.getElementById('btnSalvar');
        btnSalvar.click();
    }

    async selecionarModeloDeDocumento(numeroDocumento: string) {
        await this.waitLoadWindow();
        let modelo = this.document.getElementById('optProtocoloDocumentoTextoBase');
        modelo.click();
        let numeroModelo = <HTMLInputElement>this.document.getElementById('txtProtocoloDocumentoTextoBase');
        numeroModelo.value = numeroDocumento;
    }

}
