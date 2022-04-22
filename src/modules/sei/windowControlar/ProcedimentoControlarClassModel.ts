/// <reference path="../../../app.d.ts" />
class ProcedimentoControlarClassModel extends AbstractSubClassEngine {
    procedimentoControlar: ProcedimentoControlar;
    constructor(procedimentoControlar: ProcedimentoControlar) {
        super();
        this.procedimentoControlar = procedimentoControlar;
    }
    async iniciar(){
        await super.iniciar();   
    }
}