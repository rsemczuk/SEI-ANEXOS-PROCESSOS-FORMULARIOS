class AcessoExternoGerenciar extends ProcedimentoTrabalharClassModel {

    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = "AcessoExternoGerenciar";
    }
    async iniciar() {
        await super.iniciar();
    }
}
