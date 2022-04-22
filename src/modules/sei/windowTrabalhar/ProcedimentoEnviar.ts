class ProcedimentoEnviar extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'ProcedimentoEnviar';
    }
    async iniciar() {
        await super.iniciar();
    }
    setorDeDestino(setor:string) {
    }
}
