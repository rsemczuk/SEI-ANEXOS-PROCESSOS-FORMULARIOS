class ProcedimentoAlterar extends ProcedimentoTrabalharClassModel {
    // tela para alterar dados do processo SEI
    private procedimentoGerar: ProcedimentoGerar;
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.procedimentoGerar = new ProcedimentoGerar();
        this.className = 'ProcedimentoAlterar';
    }
    async iniciar() {
        await super.iniciar();
    }
    async alterarDadosProcesso(processo: ProcessoConfig, docs: DocSEI[]) {
        await this.waitLoadWindow();
        this.procedimentoGerar.setWindow(this.window)
        await this.procedimentoGerar.preencherFormulario(processo, docs, this.procedimentoTrabalhar);
    }
    async abrirFormularioDoProcesso() {
        if (!this.window) {
            await this.procedimentoTrabalhar.abrirLink('procedimento_alterar');    
        }
        
    }
}
