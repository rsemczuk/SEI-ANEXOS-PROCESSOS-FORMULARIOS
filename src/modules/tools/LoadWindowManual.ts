module LoadWindowManual {

    async function handler(acao: string) {
        switch (acao) {
          
            case 'editor_montar': {
                console.log('SEI_INIT: editor_montar');
                let procedimentoTrabalhar = (<WindowTrabalhar>window.opener.top).procedimentoTrabalhar;
                procedimentoTrabalhar.editor.setWindow(window);
                break;
            }
            case 'procedimento_gerar': {
                console.log('SEI_INIT: procedimento_gerar');
                let procedimentoControlar = (<WindowControlar>window.opener.top).procedimentoControlar || (<WindowControlar>window.top).procedimentoControlar;
                procedimentoControlar.procedimentoGerar.setWindow(window);
                break;
            }

            default: {
                console.log('SEI_INIT: URL sem implementação: ' + acao);
            }
        }
    }

    addEventListener("load", () => {

        let rx = /controlador\.php\?acao=([\w_]+)&/.exec(document.baseURI);
        let acao = "";
        if (rx) {
            acao = rx[1];
            if (acao) {
                handler(acao)
            }
        }


    })
}
