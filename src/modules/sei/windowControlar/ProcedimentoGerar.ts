class ProcedimentoGerar extends AbstractSubClassEngine {
    className = 'ProcedimentoGerar';
    async iniciar() {
        await super.iniciar();
    }
    async preencherFormulario(processoConfig: ProcessoConfig, docs: DocSEI[], procedimentoTrabalhar?: ProcedimentoTrabalhar, procedimentoControlar?: ProcedimentoControlar) {
        await this.waitLoadWindow();
        let gerarEntidadesTexto = new GerarEntidadesTexto();
        let _especificacao = this.querySelector<HTMLInputElement>('#txtDescricao');
        if (processoConfig.especificacao) {
            _especificacao.value = (gerarEntidadesTexto.adicionarEntidadesTexto(processoConfig.especificacao, procedimentoTrabalhar, docs, true)).toString().replace(/[ ]+/g, ' ').slice(0, _especificacao.maxLength);
        }
        if (processoConfig.observacoes) {
            let txaObservacoes = this.querySelector<HTMLInputElement>('#txaObservacoes');
            let size = parseInt(/infraLimitarTexto\(this,event,([0-9]+)\);/.exec(txaObservacoes.onkeypress.toString() || '1000')[1]);
            txaObservacoes.value = (gerarEntidadesTexto.adicionarEntidadesTexto(processoConfig.observacoes, procedimentoTrabalhar, docs, true)).toString().replace(/[ ]+/g, ' ').slice(0, size);
        }
        if (processoConfig.interessados && processoConfig.interessados.length > 0) {
            let interessados: string[] = [];
            for (let interessado of processoConfig.interessados) {
                if (interessado.replace(/ /gm, '').length > 0) {
                    interessados.push(gerarEntidadesTexto.adicionarEntidadesTexto(interessado, procedimentoTrabalhar, docs, true));
                }
            }
            await this.preencherInteressados(interessados);
        }
        if (processoConfig.nivelAcesso) {
            this.selecionarNivelAcesso(processoConfig.nivelAcesso);
        }
        let salvar = this.querySelector<HTMLSelectElement>('#btnSalvar');
        if (!processoConfig.salvarProcessoManualmente) {
            salvar.click();
        } else {
            this.document.getElementById('divInfraBarraComandosSuperior').insertAdjacentHTML('beforeend',
                `<style>#notification {
                    width:95%; 
                    text-align:center;
                    font-weight:normal;
                    font-size:14pt;
                    font-weight:bold;
                    color:white;
                    background-color:orange;
                    padding:5px;
                }
                #notification a {
                    padding:0 5px;
                    cursor:pointer;
                    float:right;
                    margin-right:5px;
                }
                </style>
                <div id="notification" style="display: none;">
            <span id="dismiss">Após conferência/Alterações clicar em salvar para continuar o processo <a title="Para continuar clique no botão salvar">X</a></span>
          </div>`);
            $(this.document.getElementById('notification')).fadeIn("slow");
            this.document.getElementById('dismiss').onclick = () => {
                $(this.document.getElementById('notification')).fadeOut("slow");
            };
        }
        let _procedimentoTrabalhar: ProcedimentoTrabalhar;
        if (!procedimentoTrabalhar) {
            _procedimentoTrabalhar = await procedimentoControlar.waitLoadProcedimentoTrabalhar(999999);
        }
        else {
            _procedimentoTrabalhar = procedimentoTrabalhar;
        }
        await _procedimentoTrabalhar.arvoreVisualizar.waitLoadWindow();
        await _procedimentoTrabalhar.procedimentoVisualizar.waitLoadWindow();
        return true;
    }
    async preencherInteressados(interessados: string[]) {
        let txtInteressadoProcedimento = this.querySelector<HTMLInputElement>('#txtInteressadoProcedimento');
        if (interessados) {
            for (let interessado of interessados) {
                let div_ul = this.querySelector<HTMLDivElement>('#divInfraAjaxtxtInteressadoProcedimento');
                AnexosTools.clearInnerHTML(div_ul);
                txtInteressadoProcedimento.value = interessado.replace(/[\.\/\!\@\#\$\%\&\*\(\)\-\+\,\=\_\\\|]/gm, " ");
                txtInteressadoProcedimento.dispatchEvent(new Event('keyup'));
                await this.waitLoadElements('#divInfraAjaxtxtInteressadoProcedimento>ul');
                let selInteressadosProcedimento = this.querySelector<HTMLSelectElement>('#selInteressadosProcedimento');
                let lis = <HTMLLinkElement[]>this.querySelectorAll('#divInfraAjaxtxtInteressadoProcedimento>ul>li');
                let interessadoCadastrado = false;
                let list_li = lis.sort(AnexosTools.SORT_ELEMENT_TEXT_LENGTH_MAIOR_PARA_MENOR);
                for (let li of list_li) {
                    if (selInteressadosProcedimento.innerText.replace(/[\.\/\!\@\#\$\%\&\*\(\)\-\+\,\=\_\\\|]/gm, " ").startsWith(li.innerText.replace(/[\.\/\!\@\#\$\%\&\*\(\)\-\+\,\=\_\\\|]/gm, " "))) {
                        if (this.verbose) console.log('Interessado já cadastrado');
                        interessadoCadastrado = true;
                    }
                }
                if (lis.length > 0 && !interessadoCadastrado) {
                    let clickLi = false;
                    for (let li of list_li) {
                        if (li.innerText.replace(/[\.\/\!\@\#\$\%\&\*\(\)\-\+\,\=\_\\\|]/gm, " ").startsWith(interessado.replace(/[\.\/\!\@\#\$\%\&\*\(\)\-\+\,\=\_\\\|]/gm, " "))) {
                            clickLi = true;
                            li.dispatchEvent(new Event('mousedown'));
                        }
                    }
                    if (this.verbose) console.log('Cadastrando interessado');
                    if (!clickLi) lis[0].dispatchEvent(new Event('mousedown'));

                }
            }
        }
    }
    selecionarNivelAcesso(acesso: NivelAcesso) {
        let idBtn = '#optPublico';
        switch (acesso) {
            case 'restrito':
                idBtn = '#optRestrito';
                break;
            case 'sigiloso':
                idBtn = '#optSigiloso';
                break;
            default:
                idBtn = '#optPublico';
                break;
        }
        let opt = this.querySelector<HTMLSelectElement>(idBtn);
        opt.click();
    }

}
