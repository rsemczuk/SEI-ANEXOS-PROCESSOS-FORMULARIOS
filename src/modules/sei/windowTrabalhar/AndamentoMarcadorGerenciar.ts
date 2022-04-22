class AndamentoMarcadorGerenciar extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'AndamentoMarcadorGerenciar';
    }
    async iniciar() {
        await super.iniciar();
    }

}
