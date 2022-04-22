/// <reference path="../../../app.d.ts" />
class ProcedimentoEscolherTipo extends AbstractSubClassEngine {

    async selecionarProcesso(nome: string) {
        let itens = await this.waitLoadElements('[title = "' + nome + '"]');
        let a = <HTMLAnchorElement><any>itens[0];
        let ancoraOpcao = <HTMLAnchorElement><any>a.parentElement.querySelector('[class="ancoraOpcao"]');
        ancoraOpcao.click();
    }

    async iniciar() {
        await super.iniciar();   
    }

}