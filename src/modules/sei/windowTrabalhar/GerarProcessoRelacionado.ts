class GerarProcessoRelacionado extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'GerarProcessoRelacionado';
    }
    async gerarProcesso(processoConfig: ProcessoConfig) {
        let documentos = await this.procedimentoTrabalhar.procedimentoVisualizar.getListClicados();
        await this.procedimentoTrabalhar.abrirLink('procedimento_escolher_tipo_relacionado');
        let selecionarProcesso = '';

        for (let tipoProcesso of processoConfig.tipoProcesso) {
            if (AnexosTools.getCfg().processosExistentes.some((p) => {
                if (p === tipoProcesso) { selecionarProcesso = p; return true; } else return false;
            })) {
                break;
            };
        }


        await this.procedimentoTrabalhar.procedimentoEscolherTipo.selecionarProcesso(selecionarProcesso);
        await this.procedimentoTrabalhar.procedimentoGerar.preencherFormulario(processoConfig, documentos);
    }
    async iniciar() {
        await super.iniciar();
    }
}
