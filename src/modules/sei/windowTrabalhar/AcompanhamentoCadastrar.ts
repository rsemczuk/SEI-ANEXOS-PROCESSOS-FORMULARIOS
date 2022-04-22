class AcompanhamentoCadastrar extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'AcompanhamentoCadastrar';
    }
    async iniciar() {
        await super.iniciar();
    }

}
