class ArvoreOrdenar extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'ArvoreOrdenar';
    }
    async iniciar() {
        await super.iniciar();
    }
}
