class ProcedimentoAtualizarAndamento extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'ProcedimentoAtualizarAndamento';
    }
    async iniciar() {
        await super.iniciar();    
    }
    inserirMensagem(msg: string) {
    }
}
