class ProcedimentoPaginar extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'ProcedimentoPaginar';
    }
    async iniciar() {
        await super.iniciar();
        let links = AnexosTools.loadLinks(this.document);
        this.procedimentoTrabalhar.procedimentoVisualizar.addLinks(links);
    }
}
