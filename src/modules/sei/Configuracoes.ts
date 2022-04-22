class Configuracoes extends AbstractSubClassEngine {
    constructor(window: Window) {
        super();
        this.className = 'Configuracoes';
        this.window = window;
        this.document = window.document;
    }
    async iniciar() {
        await super.iniciar();   
        let acao = /controlador\.php\?acao=([\w_]+)&/.exec(document.baseURI)[1];
        switch (acao) {
            case 'procedimento_trabalhar':
                break;
            case 'procedimento_controlar':
                break;
            default:
                break;
        }
    }
}
