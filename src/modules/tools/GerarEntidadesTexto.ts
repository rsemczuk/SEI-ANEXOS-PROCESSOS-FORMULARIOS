
interface OptionText {
    // separador?: string,
    //  filtrarSe?: () => boolean, 
    //  modelListaManual?: string, 
    classFormatacaoList?: string,
    //  docIndex?: number;
}
class GerarEntidadesTexto {
    constructor() {
    }

    private rxAcessosIndevidos = /<[/]?(?:script|style|link|title|meta)>|function|\)[ \t]*=>|return|eval/g;


    gerarEntities(procedimentoTrabalhar: ProcedimentoTrabalhar, documentos: DocSEI[]): ListaEntidades {
        let ol = document.createElement('ol');
        let ul = document.createElement('ul');
        for (let docSei of documentos) {
            let li = document.createElement('li');
            li.insertAdjacentHTML('afterbegin', docSei.copyLinkFull + ";");
            ol.append(li);
            let li_ul = document.createElement('li');
            li_ul.insertAdjacentHTML('afterbegin', docSei.copyLinkFull + ";");
            ul.append(li_ul);
        }

        let LINK_SEI = (numeroSEI: string): string => {
            return numeroSEI;
        }

        let LINK_SEI_RELACIONADO = (numeroSEI: string): string => {
            return numeroSEI;
        }

        if (procedimentoTrabalhar && procedimentoTrabalhar.editor?.window !== null) {
            LINK_SEI = (numeroSEI: string): string => {
                let sei = procedimentoTrabalhar?.editor?.getIDProcessoSEI(numeroSEI);
                if (sei) {
                    let link = AnexosTools.createLinkHtmlDoc(sei.numeroInterno, sei.protocoloFormatado, '', false, '');
                    return link;
                }
                return numeroSEI;
            }
            LINK_SEI_RELACIONADO = (processos: string | RegExp | string[] | RegExp[]) => {
                return (procedimentoTrabalhar.procedimentoVisualizar.getLinkProcessoRelacionado(processos)) || 'Link';
            }
        }

        let GET = (numeroAnexo: string, nomeAnexo?: string | RegExp) => {
            let ob = documentos.filter((d) => {
                if (nomeAnexo && numeroAnexo) {
                    if (typeof nomeAnexo === 'string') {
                        return d.numeroAnexo === numeroAnexo && d.nomeAnexo === nomeAnexo;
                    } else {
                        return d.numeroAnexo === numeroAnexo && nomeAnexo.test(<string>d.nomeAnexo);
                    }
                } else if (numeroAnexo) {
                    return d.numeroAnexo === numeroAnexo;
                } else {
                    if (typeof nomeAnexo === 'string') {
                        return d.nomeAnexo === nomeAnexo;
                    } else {
                        return nomeAnexo.test(<string>d.nomeAnexo);
                    }
                }
            });
            return ob[0];
        }

        let listaPorExtensoReduzida = '';
        let listaPorExtensoCompleta = '';
        let listaPorExtensoReduzidaSemLink = '';
        let listaPorExtensoCompletaSemLink = '';
        let listaManual = '';
        let lista = '';
        for (let i = 0; i < documentos.length; i++) {
            let listaSeparador = ', ';
            listaPorExtensoReduzida += (i > 0 ? listaSeparador : '') + documentos[i].numeroAnexo + ' <b>(' + documentos[i].LINK + ')</b>';
            listaPorExtensoCompleta += (i > 0 ? listaSeparador : '') + documentos[i].nomeCompleto + ' <b>(' + documentos[i].LINK + ')</b>';
            listaPorExtensoReduzidaSemLink += (i > 0 ? listaSeparador : '') + documentos[i].numeroAnexo;
            listaPorExtensoCompletaSemLink += (i > 0 ? listaSeparador : '') + documentos[i].nomeCompleto;
            let p = document.createElement('p');
            p.innerHTML = documentos[i].copyLinkFull;
            lista += p.outerHTML;
        }

        listaPorExtensoReduzida = listaPorExtensoReduzida.replace(this.rxAcessosIndevidos, '');
        listaPorExtensoCompleta = listaPorExtensoCompleta.replace(this.rxAcessosIndevidos, '');
        listaPorExtensoReduzidaSemLink = listaPorExtensoReduzidaSemLink.replace(this.rxAcessosIndevidos, '');
        listaPorExtensoCompletaSemLink = listaPorExtensoCompletaSemLink.replace(this.rxAcessosIndevidos, '');
        listaManual = listaManual.replace(this.rxAcessosIndevidos, '');
        lista = lista.replace(this.rxAcessosIndevidos, '');


        let dados: Anexo[] = [];
        for (let doc of documentos) {
            dados.push(<Anexo>doc);
        }

        let __doc = Object.assign({}, documentos[0]) || <DocSEI>{ LINK: '' };
        if (__doc.checkBox) delete __doc.checkBox;
        if (__doc.imgCopiar) delete __doc.imgCopiar;
        if (__doc.span) delete __doc.span;

        let entidades: ListaEntidades = {
            documentos: documentos.reduce((p, cur, arr) => {
                let _c = Object.assign({}, cur);
                if (_c.checkBox) delete _c.checkBox;
                if (_c.imgCopiar) delete _c.imgCopiar;
                if (_c.span) delete _c.span;
                p.push(_c);
                return p;
            }, []),
            textoPadrao: { ...AnexosTools.getCfg().textoPadrao },
            TABELA: this.TABELA,
            GET: GET,
            DIA: AnexosTools.getDataPorExtenso(new Date(), false, false, false, true),
            ANO: new Date().getFullYear().toLocaleString(),
            HOJE: new Date().toLocaleDateString(),
            HOJE_EXTENSO: AnexosTools.getDataPorExtenso(new Date()),
            HOJE_EXTENSO_MA: AnexosTools.getDataPorExtenso(new Date()).toLocaleUpperCase(),
            HOJE_EXTENSO_COM_SEMANA: AnexosTools.getDataPorExtenso(new Date(), true),
            HOJE_EXTENSO_COM_SEMANA_MA: AnexosTools.getDataPorExtenso(new Date(), true).toLocaleUpperCase(),
            HOJE_EXTENSO_COM_SEMANA_1MA: AnexosTools.primeiraLetraMaiuscula(AnexosTools.getDataPorExtenso(new Date(), true)),
            MES: AnexosTools.getDataPorExtenso(new Date(), false, true),
            MES_MA: AnexosTools.getDataPorExtenso(new Date(), false, true).toLocaleUpperCase(),
            MES_1MA: AnexosTools.primeiraLetraMaiuscula(AnexosTools.getDataPorExtenso(new Date(), false, true)),
            DIA_DA_SEMANA: AnexosTools.getDataPorExtenso(new Date(), false, false, true),
            DIA_DA_SEMANA_MA: AnexosTools.getDataPorExtenso(new Date(), false, false, true).toLocaleUpperCase(),
            DIA_DA_SEMANA_1MA: AnexosTools.primeiraLetraMaiuscula(AnexosTools.getDataPorExtenso(new Date(), false, false, true)),
            LINK_SEI: LINK_SEI,
            LINK_SEI_RELACIONADO: LINK_SEI_RELACIONADO,
            DOC_GERADO: procedimentoTrabalhar?.editor?.DOC_GERADO,
            LISTA: lista,
            LISTA_COM_MARCADORES: documentos?.length > 0 ? ul.outerHTML : '',
            LISTA_NUMERADA: documentos?.length > 0 ? ol.outerHTML : '',
            LISTA_POR_EXTENSO_REDUZIDA: listaPorExtensoReduzida,
            LISTA_POR_EXTENSO_COMPLETA: listaPorExtensoCompleta,
            LISTA_POR_EXTENSO_REDUZIDA_SEM_LINK: listaPorExtensoReduzidaSemLink,
            LISTA_POR_EXTENSO_COMPLETA_SEM_LINK: listaPorExtensoCompletaSemLink,
            LISTA_MANUAL: listaManual,
            ADD_S: documentos?.length > 1 ? "S" : '',
            ADD_s: documentos?.length > 1 ? "s" : '',
            anexos: dados.reduce((p, cur, arr) => {
                let _c = Object.assign({}, cur);
                if (_c.dadosIniciais) delete _c.dadosIniciais;
                if (_c.atualizarJuntoComAExtensao) delete _c.atualizarJuntoComAExtensao;
                if (_c.inserirAnexo) delete _c.inserirAnexo;
                p.push(_c);
                return p
            }, []),
            COUNT: documentos?.length,
            ...__doc

        };
        return entidades;
    }



    // CRIAR = (model: string, separador?: string, filtrarSe?: () => boolean, classFormatacaoList?: string, raw_docs?: DocSEI[]): string => {
    //     let op: OptionText = {
    //         separador: separador,
    //         classFormatacaoList: classFormatacaoList,
    //         filtrarSe: filtrarSe,
    //         modelListaManual: model
    //     }
    //     let e = this.gerarEntities(procedimentoTrabalhar, raw_docs, op);
    //     if (e && e.LISTA_MANUAL && e.LISTA_MANUAL.length > 0) {
    //         return e.LISTA_MANUAL;
    //     } else {
    //         return '';
    //     }
    // }

    SOMA = (item: string, places: number = 2, somarSe: string, objectlist?: []) => {
        let curDados: object[] = objectlist;
        let soma = 0;
        for (let curItem of curDados) {
            let obj = this.getCurVar<string>(curItem, '(somarSe)?' + item + ':""');
            if (typeof obj === 'string') {
                obj = obj.replace(/[^0-9,]/ig, '').replace(',', '.')
                let i = Number.parseFloat(obj);
                soma += i;
            }
        }
        return soma.toLocaleString('pt-BR', {
            minimumFractionDigits: places,
            maximumFractionDigits: places
        });
    }

    TABELA = (dados: { [key: string]: string }[],
        tabelaCfg?: TabelaCfg,
        colunasCfg?: ColunaCfg[]) => {

        let _colunas: { nomeColuna: string, chaveColuna: string }[] = [];

        let strToNumber = (number: string) => {
            if (number) {
                number = number.replace(/[^0-9,]/g, '').replace(',', '.');
                let result = parseFloat(number);// | parseInt(number);
                return result;

            } else {
                return 0;
            }
        };

        let numberToStr = (numero: number, digitos: number) => {
            if (numero) {
                return numero.toLocaleString('pt-BR', {
                    minimumFractionDigits: digitos,
                    maximumFractionDigits: digitos
                })
            } else {
                return '';
            }
        }
        let _tabelaCfg: TabelaCfg = {
            nomesNaPrimeiraLinha: false,
            styleTable: 'font-family: Arial, Helvetica, sans-serif;border-spacing: 0;border-collapse: collapse;padding:8px;',
            cellBodyStyle: { impar: 'border: 1px solid black;text-align: left;padding: 8px;background-color: #dddddd;', par: 'border: 1px solid black;text-align: left;padding: 8px;' },
            cellFooterStyle: 'border: 1px solid black;text-align: left;padding: 8px;background-color: #999999;',
            cellHeadStyle: 'border: 1px solid black;text-align: center;padding: 8px;background-color: #999999;',
            nomeTotal: 'TOTAL GERAL'
        }
        let _colCfgPadrao: ColunaCfg = {
            cellBodyStyle: _tabelaCfg.cellBodyStyle,
            cellFooterStyle: _tabelaCfg.cellFooterStyle,
            cellHeadStyle: _tabelaCfg.cellHeadStyle,
            casasDecimais: 2,
            formato: 'texto',
            criarTotal: false,
            chaveColuna: '',
            simboloMoeda: 'R$ '
        }
        if (tabelaCfg) {
            _tabelaCfg = { ..._tabelaCfg, ...tabelaCfg }

        } else {
            _tabelaCfg = tabelaCfg;
        }

        let getStyle = (chaveColuna: string, type: 'footer' | 'body' | 'head', index?: number): string => {
            let _cols: ColunaCfg[] = colunasCfg.filter((col) => {
                return col.chaveColuna === chaveColuna;
            });
            if (_cols.length > 0) {
                let __col = _cols[0];
                switch (type) {
                    case 'body':
                        if (index % 2 === 1) {
                            return __col.cellBodyStyle.impar;
                        } else {
                            return __col.cellBodyStyle.par;
                        }
                    case 'footer':
                        return __col.cellFooterStyle
                    case 'head':
                        return __col.cellHeadStyle
                    default:
                        console.log('selecionar body, head ou footer')
                        break
                }

            } else {
                switch (type) {
                    case 'body':
                        if (index % 2 === 1) {
                            return _tabelaCfg.cellBodyStyle.impar;
                        } else {
                            return _tabelaCfg.cellBodyStyle.par;
                        }
                    case 'footer':
                        return _tabelaCfg.cellFooterStyle;
                    case 'head':
                        return _tabelaCfg.cellHeadStyle;
                }

            }

            return null;
        }


        if (_tabelaCfg.styleTable) {
            _tabelaCfg.styleTable = ' style="' + _tabelaCfg.styleTable + '"';
        }


        let result = [`<table${_tabelaCfg.styleTable}>`];
        if (!colunasCfg || !Array.isArray(colunasCfg)) colunasCfg = [];

        // alterar formatação conforme moeda ou número
        for (let i = 0; i < colunasCfg.length; i++) {
            if (!colunasCfg[i].cellBodyStyle && colunasCfg[i].formato && (colunasCfg[i].formato === 'moeda' || colunasCfg[i].formato === 'numero')) {
                colunasCfg[i].cellBodyStyle = <ColunaCfg['cellBodyStyle']>{}
                colunasCfg[i].cellBodyStyle.impar = _colCfgPadrao.cellBodyStyle.impar.replace('left', 'right');
                colunasCfg[i].cellBodyStyle.par = _colCfgPadrao.cellBodyStyle.par.replace('left', 'right');
            }
            if (!colunasCfg[i].cellFooterStyle && colunasCfg[i].formato && (colunasCfg[i].formato === 'moeda' || colunasCfg[i].formato === 'numero')) {
                colunasCfg[i].cellFooterStyle = _colCfgPadrao.cellFooterStyle.replace('left', 'right');
            }
            colunasCfg[i] = { ..._colCfgPadrao, ...colunasCfg[i] };
        }

        // excluir a primeira linha se for cabeçário
        if (_tabelaCfg.nomesNaPrimeiraLinha) {
            let dado = dados.shift();
            for (let key in dado) {
                _colunas.push({ chaveColuna: key, nomeColuna: dado[key] });
            }
        } else {
            for (let key in dados[0]) {
                let cols = colunasCfg.filter((col, index) => {
                    return col.chaveColuna === key;
                });
                if (cols.length > 0 && cols[0].nomeColuna) {
                    _colunas.push({ nomeColuna: cols[0].nomeColuna, chaveColuna: key });
                } else {
                    _colunas.push({ nomeColuna: key, chaveColuna: key });
                }
            }
        }

        // adicionar colunas extras
        colunasCfg.forEach((colCfg) => {
            let find = _colunas.find((col) => {
                return colCfg.chaveColuna === col.chaveColuna;
            });
            if (!find) {
                if (colCfg.posicaoColuna && colCfg.posicaoColuna <= _colunas.length + 1) {
                    let cols1 = _colunas.slice(0, colCfg.posicaoColuna - 1).concat([{ chaveColuna: colCfg.chaveColuna, nomeColuna: colCfg.nomeColuna || colCfg.chaveColuna }]).concat(_colunas.slice(colCfg.posicaoColuna - 1));
                    _colunas = cols1

                } else {
                    _colunas.push({ chaveColuna: colCfg.chaveColuna, nomeColuna: colCfg.nomeColuna || colCfg.chaveColuna })
                }

            }

        })

        //formatar numero e moeda
        for (let indexColunas = 0; indexColunas < colunasCfg.length; indexColunas++) {
            for (let dado of dados) {
                switch (colunasCfg[indexColunas].formato) {
                    case 'moeda':
                        dado[colunasCfg[indexColunas].chaveColuna] = colunasCfg[indexColunas].simboloMoeda + numberToStr(strToNumber(dado[colunasCfg[indexColunas].chaveColuna]), colunasCfg[indexColunas].casasDecimais);
                        break;
                    case 'numero':
                        dado[colunasCfg[indexColunas].chaveColuna] = numberToStr(strToNumber(dado[colunasCfg[indexColunas].chaveColuna]), colunasCfg[indexColunas].casasDecimais);
                        break;
                    default:
                        break;
                }
            }

        }

        //calcular valores de uma coluna pré definida
        for (let indexColunas = 0; indexColunas < colunasCfg.length; indexColunas++) {
            if (colunasCfg[indexColunas].resultadoDe && colunasCfg[indexColunas].resultadoDe.length > 0) {
                let calculoArr = colunasCfg[indexColunas].resultadoDe.replace(/ /g, '').split(/[*+-/\[\]\(\).]/);
                let rxArr = Array.from(colunasCfg[indexColunas].resultadoDe.matchAll(/[*+-/]/g));
                let operadores = rxArr.reduce((arr, curRexgArr) => { arr.push(curRexgArr[0]); return arr; }, <string[]>[]);
                if (calculoArr.length - 1 === operadores.length) {
                    let calcEval = colunasCfg[indexColunas].resultadoDe.replace(/([*+-/])/g, ')$1strToNumber(dado.');
                    calcEval = 'strToNumber(dado.' + calcEval + ')';
                    for (let dado of dados) {
                        let resultado = eval(calcEval);
                        dado[colunasCfg[indexColunas].chaveColuna] = (colunasCfg[indexColunas].formato === 'moeda' ? colunasCfg[indexColunas].simboloMoeda : '') + numberToStr(resultado, colunasCfg[indexColunas].casasDecimais);
                    }
                }
            }
        }
        //calcular totais
        let totaisColunas: { [key: string]: string } = {};
        for (let indexColunas = 0; indexColunas < colunasCfg.length; indexColunas++) {
            if (colunasCfg[indexColunas].criarTotal && (colunasCfg[indexColunas].formato === 'numero' || colunasCfg[indexColunas].formato === 'moeda')) {
                let soma = dados.reduce((soma, dadoAtual: { [key: string]: string; }) => {
                    let str = strToNumber(dadoAtual[colunasCfg[indexColunas].chaveColuna]);
                    return soma + (str || 0);
                }, 0);
                totaisColunas[colunasCfg[indexColunas].chaveColuna] = (colunasCfg[indexColunas].formato === 'moeda' ? colunasCfg[indexColunas].simboloMoeda : '') + numberToStr(soma, colunasCfg[indexColunas].casasDecimais);
            }
        }

        //head table
        result.push('<thead>');
        result.push('<tr>');

        _colunas.forEach((_col) => {
            let style = getStyle(_col.chaveColuna, 'head');
            if (style) {
                style = ' style="' + style + '"';
            }
            result.push(`<td${style}>${_col.nomeColuna}</td>`);
        });
        result.push('</tr>');
        result.push('</thead>');

        //body table
        result.push('<tbody>');
        dados.forEach((row, index) => {
            result.push('<tr>');
            for (let o of _colunas) {
                let style = getStyle(o.chaveColuna, 'body', index);
                if (style) {
                    style = ' style="' + style + '"';
                }
                result.push(`<td${style}>${row[o.chaveColuna]}</td>`);
            }
            result.push('</tr>');
        });
        result.push('</tbody>');

        //head footer
        if (Object.values(totaisColunas).length > 0) {
            result.push('<tfooter>');
            result.push('<tr>');
            _colunas.forEach((_col, index) => {
                let style = getStyle(_col.chaveColuna, 'footer');
                if (style) {
                    style = ' style="' + style + '"';
                }
                if (index === 0 && !totaisColunas[_col.chaveColuna]) {
                    totaisColunas[_col.chaveColuna] = _tabelaCfg.nomeTotal || 'TOTAL';
                }
                result.push(`<td${style}>${totaisColunas[_col.chaveColuna] || ''}</td>`);
            });
            //'colspan="3"'
            result.push('</tr>');
            result.push('</tfooter>');
        }
        result.push('</table>');
        return result.join('\n');
    }

    private decodeHtml(html: string) {
        let txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    adicionarEntidadesTexto(texto: string, procedimentoTrabalhar: ProcedimentoTrabalhar, docs: DocSEI[], somenteTexto: boolean) {
        let rxDados = /(?:<<<|&lt;&lt;&lt;)(.+?(?=(?:>>>|&gt;&gt;&gt;)))(?:>>>|&gt;&gt;&gt;)/m;
        let arr: RegExpExecArray;
        let dados = this.gerarEntities(procedimentoTrabalhar, docs);
        texto = texto.replace(/\r?\n/gm, '');
        while (arr = rxDados.exec(texto)) {

            let curVar: string
            if (arr[1]) curVar = this.getCurVar(dados, arr[1]);
            if (!curVar) {
                curVar = arr[1] + ':!';
                // curVar = '"VARIAVEL INEXISTENTE"';
            }
            texto = texto.replace(arr[0], curVar);
        }
        texto = texto.replace(this.rxAcessosIndevidos, '');

        if (somenteTexto) {
            return this.htmlToText(texto);
        } else {
            return texto;
        }
    }

    private htmlToText(texto: string) {
        let p = document.createElement('p');
        p.innerHTML = texto;
        return p.innerText;
    }


    private getCurVar<T>(dados: object, model: string): T {
        let _model = this.removeSpansEntities(model);
        let functionStr = '';
        for (let o in dados) {
            functionStr += "var " + o + " = dados['" + o + "'];\n";
        }
        functionStr = '((window, document, undefined, chrome, browser, procedimentoTrabalhar, procedimentoControlar) => {\n' + functionStr + 'return (' + _model + ');\n})()';
        let f: T = eval(functionStr)
        return f;
    }

    private removeSpansEntities(model: string) {
        model = this.decodeHtml(model);
        let removerSpan = /<[/]?span>/ig;
        model = model.replace(removerSpan, '');
        return model;
    }


}

