class AnotacaoRegistrar extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'AnotacaoRegistrar';
    }
    async iniciar() {
        await super.iniciar();
    }
}
