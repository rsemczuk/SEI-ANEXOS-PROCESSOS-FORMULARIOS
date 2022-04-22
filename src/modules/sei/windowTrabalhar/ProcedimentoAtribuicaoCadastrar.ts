class ProcedimentoAtribuicaoCadastrar extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'ProcedimentoAtribuicaoCadastrar';
    }
    async iniciar() {
        await super.iniciar();
    }
    atribuir(servidor:string) {
    }
}
