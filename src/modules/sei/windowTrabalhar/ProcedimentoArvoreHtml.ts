class ProcedimentoArvoreHtml extends ProcedimentoTrabalharClassModel {
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'ProcedimentoArvoreHtml';
    }



    async iniciar() {
        await super.iniciar();
        //this.window.onload = () => 
        this.loadFormatacaoParagrafos();
    }


    private loadFormatacaoParagrafos() {
        let stileLinks = Array.from(this.document.getElementsByTagName('style'));//.filter((l) => { return l.href == '' });
        let listFomatacao: string[] = []
        stileLinks.forEach((l) => {
            Array.from(l.sheet.cssRules).forEach((rule) => {
                let txtRule = (<CSSRule & { selectorText: string }>rule).selectorText;
                if (txtRule.match(/^p\./)) {
                    listFomatacao.push(txtRule.replace('p.', '').replace('::before', ''));
                }
            });
        });

        AnexosTools.getCfg().formatacaoParagrafos = Array.from(new Set(listFomatacao.concat(AnexosTools.getCfg().formatacaoParagrafos)));
        AnexosTools.saveCfg();

    }


}
