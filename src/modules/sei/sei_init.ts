module SEI {
    
    let verbose = false;

    if (verbose) console.log('SEI-INIT');

    function addScriptToPage(scriptName: string) {

        return new Promise<HTMLScriptElement>((resolve, reject) => {
            if (!document.scripts.namedItem(scriptName)) {
                let script = document.createElement('script');
                script.charset = "UTF-8";
                script.async = false;
                script.id = scriptName;
                (document.head || document.documentElement).appendChild(script);
                script.src = chrome.runtime.getURL(scriptName);
                script.onload = () => resolve(script);
            } else {
                resolve(document.scripts.namedItem(scriptName));
            }
        })


    }
    async function handler(acao: string) {
        switch (acao) {
            case 'procedimento_trabalhar': {
                if (verbose) console.log('SEI_INIT: procedimento_trabalhar');
                addScriptToPage('lib/pdf.worker.js');
                addScriptToPage('lib/pdf.js');
                /**
                 * necessário aguardar o carregamento do script geral
                 */
                addScriptToPage('modules/tools/ExtrairDados.js');
                addScriptToPage('modules/tools/GerarEntidadesTexto.js');
                addScriptToPage('modules/tools/MessagingBackGround.js');

                addScriptToPage('modules/tools/Geral.js');
                addScriptToPage('modules/AbstractSubClassEngine.js');
                addScriptToPage('modules/sei/windowTrabalhar/ProcedimentoTrabalharClassModel.js');
                addScriptToPage('modules/sei/windowTrabalhar/GerarProcessoRelacionado.js');
                addScriptToPage('modules/sei/windowTrabalhar/DocumentoReceber.js');
                addScriptToPage('modules/sei/windowTrabalhar/DocumentoAlterar.js');
                addScriptToPage('modules/sei/windowTrabalhar/ProcedimentoArvoreHtml.js');
                addScriptToPage('modules/sei/windowTrabalhar/DocumentoGerar.js');
                addScriptToPage('modules/sei/windowTrabalhar/Editor.js');
                addScriptToPage('modules/sei/windowTrabalhar/EscolherTipoDocumento.js');
                addScriptToPage('modules/sei/windowTrabalhar/InserirAnexos.js');
                addScriptToPage('modules/sei/windowTrabalhar/InserirFormulario.js');
                addScriptToPage('modules/sei/windowTrabalhar/ProcedimentoPaginar.js');
                addScriptToPage('modules/sei/windowTrabalhar/ProcedimentoArvoreVisualizar.js');
                addScriptToPage('modules/sei/windowTrabalhar/ProcedimentoVisualizar.js');
                addScriptToPage('modules/sei/windowTrabalhar/ProcedimentoAlterar.js');
                addScriptToPage('modules/sei/windowTrabalhar/AcompanhamentoCadastrar.js');
                addScriptToPage('modules/sei/windowTrabalhar/ProcedimentoEnviar.js');
                addScriptToPage('modules/sei/windowTrabalhar/ProcedimentoAtualizarAndamento.js');
                addScriptToPage('modules/sei/windowTrabalhar/ProcedimentoAtribuicaoCadastrar.js');
                addScriptToPage('modules/sei/windowTrabalhar/ProcedimentoRelacionar.js');
                addScriptToPage('modules/sei/windowTrabalhar/ArvoreOrdenar.js');
                addScriptToPage('modules/sei/windowTrabalhar/AcessoExternoGerenciar.js');
                addScriptToPage('modules/sei/windowTrabalhar/AnotacaoRegistrar.js');
                addScriptToPage('modules/sei/windowTrabalhar/AndamentoMarcadorGerenciar.js');
                addScriptToPage('modules/sei/windowControlar/ProcedimentoEscolherTipo.js');
                addScriptToPage('modules/sei/windowControlar/ProcedimentoGerar.js');
                addScriptToPage('modules/sei/ProcedimentoTrabalhar.js');
                break;
            }
            case 'procedimento_controlar': {
                if (verbose) console.log('SEI_INIT: procedimento_controlar');
                addScriptToPage('lib/pdf.worker.js');
                addScriptToPage('lib/pdf.js');
                /**
                 * necessário aguardar o carregamento do script geral
                 */

                addScriptToPage('modules/tools/ExtrairDados.js');
                addScriptToPage('modules/tools/GerarEntidadesTexto.js');
                addScriptToPage('modules/tools/MessagingBackGround.js');
                addScriptToPage('modules/tools/Geral.js');
                addScriptToPage('modules/AbstractSubClassEngine.js');
                addScriptToPage('modules/sei/windowControlar/ProcedimentoControlarClassModel.js');
                addScriptToPage('modules/sei/windowControlar/ProcedimentoEscolherTipo.js');
                addScriptToPage('modules/sei/windowControlar/ProcedimentoGerar.js');
                addScriptToPage('modules/sei/windowControlar/ProcedimentoGerarProcessoSEI.js');
                addScriptToPage('modules/sei/ProcedimentoControlar.js');
                break;
            }
            case 'documento_upload_anexo': {
                if (verbose) console.log('SEI_INIT: documento_upload_anexo');
                break;
            }
            case 'editor_montar': {
                if (verbose) console.log('SEI_INIT: editor_montar');
                addScriptToPage('modules/tools/LoadWindowManual.js');
                break;
            }
            case 'procedimento_gerar': {
                if (verbose) console.log('SEI_INIT: procedimento_gerar');
                addScriptToPage('modules/tools/LoadWindowManual.js');
                break;
            }
            case 'pesquisa': {
                if (verbose) console.log('SEI_INIT: pesquisa');
                addScriptToPage('modules/AbstractSubClassEngine.js');
                addScriptToPage('modules/sei/PesqSEI.js');
                break;
            }
            default: {
                if (verbose) console.log('SEI_INIT: URL sem implementação: ' + acao);
            }
        }
    }

    let rx = /controlador\.php\?acao=([\w_]+)&/.exec(document.baseURI);
    let acao = "";
    if (rx) {
        acao = rx[1];
        if (acao) {
            handler(acao);
        }
    }
    if (document.baseURI.match('md_pesq_processo_pesquisar')) {
        if (verbose) console.log(document.baseURI);
        acao = 'pesquisa';
        handler(acao);
    }


}

