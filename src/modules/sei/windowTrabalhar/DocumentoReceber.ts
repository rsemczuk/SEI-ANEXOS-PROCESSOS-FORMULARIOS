class DocumentoReceber extends ProcedimentoTrabalharClassModel {
    //tela de gerar anexos externos;
    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'DocumentoReceber';
    }
    async preencherSalvarAnexo(anexo: Anexo) {
        return new Promise<boolean>(async (resolve, reject) => {
            await this.waitLoadElements('#txtNumero');
            let fun = async () => {
                let optNato = <HTMLInputElement>this.querySelector('#optNato');
                let optDigitalizado = <HTMLInputElement>this.querySelector('#optDigitalizado');
                let optPublico = <HTMLInputElement>this.querySelector('#optPublico');
                let optRestrito = <HTMLInputElement>this.querySelector('#optRestrito');
                let optSigiloso = <HTMLInputElement>this.querySelector('#optSigiloso');
                if (anexo.nivelAcesso === "restrito" && !optRestrito.disabled) {
                    optRestrito.click();
                    let selHipoteseLegal = <HTMLSelectElement>this.querySelector('#selHipoteseLegal');
                    for (let index = 0; index < selHipoteseLegal.options.length; index++) {
                        let option = selHipoteseLegal.options[index];
                        if (option.innerText.startsWith(anexo.hipoteseLegal)) {
                            option.selected = true;
                        }
                    }

                } else if (anexo.nivelAcesso === "público" && !optPublico.disabled) {
                    optPublico.click();
                } else if (anexo.nivelAcesso === "sigiloso" && !optSigiloso.disabled) {
                    console.log('não implementado');
                } else {
                    console.log('a opção de nivel de acesso "' + anexo.nivelAcesso + '" está desabilitada, será selecionado o que tiver habilitado para clicar');
                    if (!optRestrito.checked && !optPublico.checked && !optSigiloso.checked) {
                        if (!optPublico.disabled) {
                            optPublico.click();
                        } else if (!optRestrito.disabled) {
                            optRestrito.click();
                        } else if (!optSigiloso.disabled) {
                            optSigiloso.click();
                            console.log('não implementado');
                        }

                    }
                }

                if (anexo.formato === "Nato-digital") {
                    optNato.click();
                } else {
                    optDigitalizado.click();
                    let selTipoConferencia = <HTMLElement>this.querySelector('#selTipoConferencia');
                    let optionsTipoConferencia = Array.from(selTipoConferencia.querySelectorAll('option'));
                    for (let option of optionsTipoConferencia) {
                        if (option.innerHTML === anexo.formato) {
                            option.selected = true;
                        }
                    }
                }
                let filArquivo = <HTMLElement>this.querySelector('#filArquivo');
                filArquivo.files = anexo.file;
                filArquivo.dispatchEvent(new Event('change'));
                await this.waitLoadElements('#tblAnexos>thead>tr>td');
                let btnSalvar = <HTMLElement>this.querySelector('#btnSalvar');
                let unloadProcedimentoVisualizar = false;
                let wait1 = this.procedimentoTrabalhar.procedimentoVisualizar.onUnloadRun().then(() => {
                    unloadProcedimentoVisualizar = true;
                });
                let wait2 = this.onUnloadRun().then(async () => {
                    await this.procedimentoTrabalhar.arvoreVisualizar.waitLoadWindow();
                    await this.procedimentoTrabalhar.arvoreVisualizar.onUnloadRun();
                });
                btnSalvar.click();
                await wait2;
                if (!unloadProcedimentoVisualizar)
                    await wait1;
                await this.procedimentoTrabalhar.procedimentoVisualizar.waitLoadWindow();
                await this.procedimentoTrabalhar.arvoreVisualizar.waitLoadWindow();
                resolve(true);
            };


            let txtNumero = <HTMLInputElement>this.querySelector('#txtNumero');
            let txtDataElaboracao = <HTMLInputElement>this.querySelector('#txtDataElaboracao');
            //fix erro data futura
            let dateAnexo = new Date(parseInt(anexo.data.split("/")[2]), parseInt(anexo.data.split("/")[1]) - 1, parseInt(anexo.data.split("/")[0]));
            let dateHoje = new Date();
            dateHoje = new Date(dateHoje.getFullYear(), dateHoje.getMonth(), dateHoje.getDate());
            if (dateAnexo > dateHoje) {
                txtDataElaboracao.value = dateHoje.toLocaleDateString('pt-BR');
            } else {
                txtDataElaboracao.value = anexo.data;
            }
            let txaObservacoes = <HTMLInputElement>this.querySelector('#txaObservacoes');
            if (anexo.observacoes)
                txaObservacoes.value = anexo.observacoes;
            let selSerie = <HTMLSelectElement>this.querySelector('#selSerie');
            let options = Array.from(selSerie.options);
            if (anexo.nomeAnexo != '') {
                for (let option of options) {
                    if (option.innerText == anexo.nomeAnexo) {
                        option.selected = true;
                        option.setAttribute('selected', 'selected');
                    }
                    else {
                        if (option.getAttribute('selected') == 'selected') {
                            option.removeAttribute('selected');
                        }
                    }
                }
            }
            else {
                console.log('Não encontrou o documento, rever documentos existentes...');
                options = options.sort(AnexosTools.SORT_ELEMENT_TEXT_LENGTH_MAIOR_PARA_MENOR);
                let _documentosExistentes = AnexosTools.getCfg().anexosExistentes.concat(AnexosTools.getCfg().formulariosExistentes);
                let appDocumentosExistentes = _documentosExistentes.sort(AnexosTools.SORT_LENGTH_MAIOR_PARA_MENOR);
                let curDocumentosExistentes: string[] = [];
                for (let option of options) {
                    curDocumentosExistentes.push(option.innerText);
                    if (option.getAttribute('selected') == 'selected') {
                        option.removeAttribute('selected');
                    }
                }
                let isNotEquals = appDocumentosExistentes.toString() !== curDocumentosExistentes.toString();
                if (isNotEquals) {
                    let selected = false;
                    for (let option of options) {
                        let optionNome = option.innerText.replace(/[\(\)\[\]\{\}\*\.\\]/ig, '.?').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        let curNome = anexo.fileName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        let rx = new RegExp('^' + optionNome, 'i');
                        if (curNome.match(rx)) {
                            anexo.nomeAnexo = option.innerText;
                            let curString = anexo.fileName.substring(option.innerText.length).replace(/^[_\- ]+/, '');
                            curString = /([^.]+)?/.exec(curString)[1];
                            if (!curString)
                                curString = '';
                            option.selected = true;
                            option.setAttribute('selected', 'selected');
                            selected = true;
                            break;
                        }
                    }
                    if (!selected) {
                        for (let option of options) {
                            if (option.innerText.trim().match(/^Anexo[s]?$/ig)) {
                                option.selected = true;
                                option.setAttribute('selected', 'selected');
                                break;
                            }
                        }
                        anexo.nomeCompleto = /(.*).[a-zA-Z0-9]+$/gi.exec(anexo.fileName)[1];
                    }
                }
                else {
                    console.log('A lista de opções é a mesma da extensão');
                }
            }
            let limitarTexto = parseInt(/infraLimitarTexto\(this,event,(\d+)\)/.exec(txtNumero.outerHTML)[1]) || 50;
            txtNumero.value = anexo.numeroAnexo.slice(0, limitarTexto);
            await this.onUnloadRun(null, async () => {
                await this.waitLoadElements('#txtNumero');
                if (anexo.nivelAcesso === 'restrito') {
                    if (this.window.objAjaxTipoProcedimentoSugestoes == null) {
                        this.window.inicializar();
                    }
                    let optRestrito = <HTMLElement>this.querySelector('#optRestrito');
                    optRestrito.click();
                    optRestrito.dispatchEvent(new Event('change'));
                    await this.waitLoadElements('#selHipoteseLegal>option');
                    fun();
                }
                else {
                    fun();
                }
            }, () => {
                selSerie.dispatchEvent(new Event('change'));
            });
        });
    }

    async iniciar() {
        await super.iniciar();
        this.waitLoadElements<HTMLOptionElement>('#selHipoteseLegal>option').then((hipoteseLegais) => {
            if (hipoteseLegais) AnexosTools.updateHipoteses(hipoteseLegais.reduce((p, cur) => { p.push(cur.innerText); return p; }, <string[]>[]));
        });

    }


}
