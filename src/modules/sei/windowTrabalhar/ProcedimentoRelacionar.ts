class ProcedimentoRelacionar extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'ProcedimentoRelacionar';
    }
    async iniciar() {
        await super.iniciar();
    }
    relacionar(sei:string) {
    }
}
