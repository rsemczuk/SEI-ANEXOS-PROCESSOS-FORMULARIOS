class ExtrairDados {

    defaultAnexo(): Anexo {
        return {
            inserirAnexo: true,
            dadosIniciais: true,
            numeroAnexo: '',
            data: new Date().toLocaleDateString(),
            nomeAnexo: '',
            formato: 'Nato-digital',
            hipoteseLegal: '',
            interessados: [],
            nivelAcesso: 'público',
            // file: null,
            nomeCompleto: '',
            observacoes: '',
            atualizarJuntoComAExtensao: false,
        }
    };

    private async readFile(file_or_url: string | File, fileName: string) {
        let file: File;
        if (typeof file_or_url === 'string') {
            if (file_or_url.match(/controlador\.php/)) {
                let request = await AnexosTools.getRequest(file_or_url, 'GET', 'blob');
                let responseBlob: Blob = request.response;
                if (typeof responseBlob === 'object' && responseBlob.type) {
                    file = new File([responseBlob], fileName, { type: responseBlob.type });
                }
            }
        } else {
            file = file_or_url;
        }
        return file;
    }

    async readFileAsText(file_or_url: string | File, fileName: string, force?: boolean) {
        let file: File = await this.readFile(file_or_url, fileName);
        if (file.type === "application/pdf") {
            let arrayBuffer = await file.arrayBuffer();
            let typedarray = new Uint8Array(arrayBuffer);
            let pdf = await this.getPdf(typedarray);
            return await this.getPdfText(pdf);
        } else if (file.type === 'text/plain' || force) {
            return await file.text();
        }
        return '';
    }


    private async extrairDadosPdf(file: File): Promise<DadosEquiplanoPDF> {
        let dados = <DadosEquiplanoPDF>{};
        let coordenadas = AnexosTools.getCfg().coordenadasPdf;
        if (file.type === "application/pdf") {
            let arrayBuffer = await file.arrayBuffer();
            let typedarray = new Uint8Array(arrayBuffer);
            let pdf = await this.getPdf(typedarray);
            let pdfText = await this.getPdfText(pdf);

            for (let coordenada of coordenadas) {
                if (pdfText.match(coordenada.pdfContain)) {
                    let pdfPage = await this.getPdfPage(pdf, coordenada.pdfPage);
                    dados = await this.processarLeituraDasCoordenadas(coordenada, pdfPage, dados);
                    dados.dadosIniciais = false;
                    break;
                }
            }

        }

        if (!dados.nomeAnexo || dados.nomeAnexo == '') {
            return null;
        } else {
            dados = Object.assign(this.defaultAnexo(), dados);
            this.fixDados(dados);
            return dados;
        }

    }

    checkRegexPattern(pattern: string, regexFlags: string) {
        try {
            new RegExp(pattern, regexFlags);
            return true;
        }
        catch (error) {
            return false;
        }
    }



    private getParam(fileName: string, paramss?: Param[]) {
        for (let param of (paramss || AnexosTools.getCfg().meusTiposDeAnexos)) {
            if (!this.checkRegexPattern(param.rx, param.flags)) continue;
            let rx = new RegExp(param.rx, param.flags);
            if (fileName.match(rx)) {
                return <Param>JSON.parse(JSON.stringify(param));
            }
        }
        return null;
    }

    async extrairDadosDoArquivoOuTexto(file_or_url: string | File, fileName: string, param: Param = this.getParam(fileName)): Promise<Anexo> {
        let dados: Anexo;
        let file = await this.readFile(file_or_url, fileName);
        if (file) {
            file_or_url = file;
            dados = await this.extrairDadosPdf(file);

        }
        if (!dados) {
            let text: string;
            if (param) param = JSON.parse(JSON.stringify(param));//clone
            if (param) {
                if (typeof file_or_url === 'string') {
                    text = file_or_url;
                } else {
                    if (param.lerArquivoComoTexto) {
                        text = await this.readFileAsText(file_or_url, file_or_url.name, true);
                        if (text.length === 0) {
                            text = file_or_url.name;
                        }
                    } else {
                        text = fileName;
                    }
                }


            } else {
                if (typeof file_or_url === 'string') {
                    text = file_or_url;
                } else {
                    text = fileName;
                }
            }
            dados = this.extrairDadosPeloTexto(text, param);

        }
        if (typeof file_or_url !== 'string') {
            dados.fileName = file_or_url.name;
        }
        return dados;
    }

    private fixDados(dados: Anexo) {
        let cfg = AnexosTools.getCfg();
        // colocar barra em ref 08-2020 --> ref 08/2020
        if (cfg.formatarNumeroAnexoDiaMesAno) {
            let rxFormatarNumeroAnexoDiaMesAno = /(?:[0-9]{2}[\-_]+)?[0-9]{2}[\-_]+[0-9]{4}/ig;
            let match = dados.numeroAnexo.match(rxFormatarNumeroAnexoDiaMesAno);
            if (match) {
                dados.numeroAnexo = dados.numeroAnexo.replace(match[0], match[0].replace(/[_\-]+/g, '/'));
            }
        }
        if (cfg.formatarNumeroAnexoMesAno) {
            let rxFormatarNumeroAnexoMesAno = /[0-9]{2}[\-_]+[0-9]{4}/ig;
            let match = dados.numeroAnexo.match(rxFormatarNumeroAnexoMesAno);
            if (match) {
                dados.numeroAnexo = dados.numeroAnexo.replace(match[0], match[0].replace(/[ _\-]+/g, '/'));
            }
        }
        if (cfg.formatarNumeroAnexoNumeros) {
            let rxFormatarNumero = /^[0-9]{3,30}$/ig;
            let match = dados.numeroAnexo.match(rxFormatarNumero);
            if (match) {
                let numero = parseInt(dados.numeroAnexo);
                dados.numeroAnexo = numero.toLocaleString('pt-BR');
            }
        }
        // criar nome completo;
        if (!dados.nomeCompleto) {
            dados.nomeCompleto = <string>dados.nomeAnexo + ' ' + <string>dados.numeroAnexo;
        }

        if (cfg.restritoSeEncontrarCPF) {
            if (this.checarCpf(dados)) {
                dados.nivelAcesso = 'restrito';
                dados.hipoteseLegal = <Hipoteselegal>'Informação Pessoal';

            }
        }


        //fix captura de datas
        dados.data = dados.data.replace(/^[ _\-]+/g, '').replace(/[ _\-]/g, '/');
        let testDate = new Date(parseInt(dados.data.split("/")[2]), parseInt(dados.data.split("/")[1]) - 1, parseInt(dados.data.split("/")[0]));
        if (!testDate) {
            dados.data = new Date().toLocaleDateString();
        }

        // console.log(JSON.stringify(dados,null,'  '));
    }

    private checarCpf = (obj: object) => {
        if (typeof obj === 'object' && !Array.isArray(obj)) {
            for (let key in obj) {
                if (key.match(/^CPF$/i)) {
                    return true;
                } else if (key.match(/CPFCNPJ/i)) {
                    if (AnexosTools.validarCPF(obj[key])) {
                        return true;
                    }
                }
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    if (this.checarCpf(obj[key])) return true;
                }

            }
        }
        return false;
    }

    extrairDadosPeloTexto(textOrFileName: string, param: Param = this.getParam(textOrFileName)): Anexo {
        param = JSON.parse(JSON.stringify(param));//clone param para não ser alterado

        let dados = <Anexo>{};

        // dados.numeroAnexo = textOrFileName.replace(/(?:[\r]?\n|\.)(?:.*|\n|\r)*/, '').trim();

        if (param) {
            if (!param.outrosParametros) param.outrosParametros = [];
            for (let o of [<SubParam>param].concat(param.outrosParametros)) {
                let rx = new RegExp(o.rx, o.flags);
                let rxArr: RegExpExecArray;
                if (rx.global) {
                    let itens: { [key: string]: string }[] = [];
                    while (rxArr = rx.exec(textOrFileName)) {
                        if (rxArr.groups) {
                            itens.push(rxArr.groups);
                        }
                    }
                    if (o.nomeGrupo) {
                        if (!dados[o.nomeGrupo]) dados[o.nomeGrupo] = {};
                        dados[o.nomeGrupo][o.nomeLista] = itens;
                    } else {
                        dados[o.nomeLista] = itens;
                    }
                } else {
                    rxArr = rx.exec(textOrFileName);
                    if (rxArr && rxArr.groups) {
                        if (o.nomeGrupo) {
                            if (!dados[o.nomeGrupo]) dados[o.nomeGrupo] = {};
                            dados[o.nomeGrupo] = { ...dados[o.nomeGrupo], ...rxArr.groups };
                        } else {
                            Object.assign(dados, rxArr.groups, param.dados);
                        }
                    }
                }
            }
        }
        if (!dados.nomeAnexo || dados.nomeAnexo === '') {
            let _docExistentes = AnexosTools.getCfg().anexosExistentes.concat(AnexosTools.getCfg().formulariosExistentes).sort(AnexosTools.SORT_LENGTH_MAIOR_PARA_MENOR).concat(["E-mail"]);
            for (let _doc of _docExistentes) {
                if (!_doc || _doc.length === 0) continue;
                let optionNome = _doc.replace(/[\(\)\[\]\{\}\*\.\\]/ig, '.?').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                let fileNameNormalized = textOrFileName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                let rx = new RegExp('^' + optionNome, 'i');
                if (fileNameNormalized.match(rx)) {
                    dados.nomeAnexo = _doc;
                    let rxData = /(?<data>[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}|[0-9]{2}[ ][0-9]{2}[ ][0-9]{4}|[0-9]{2}[_][0-9]{2}[_][0-9]{4}|[0-9]{2}[\-][0-9]{2}[\-][0-9]{4})/;
                    if (rxData.test(fileNameNormalized)) {
                        dados.data = rxData.exec(fileNameNormalized).groups.data.replace(/[ _\-]/g, '/');
                    }
                    let rxInserirAnexo = /(?<inserirAnexo>\.ia_sim|\.ia_nao)/;
                    if (rxInserirAnexo.test(fileNameNormalized)) {
                        dados.inserirAnexo = rxInserirAnexo.exec(fileNameNormalized).groups.inserirAnexo.startsWith('.ia_sim');
                    }

                    dados.numeroAnexo = textOrFileName.substring(_doc.length).replace(/^[_\- ]+/, '');
                    dados.numeroAnexo = /([^\.]+)?/.exec(dados.numeroAnexo)[1];// copiar até o ponto
                    //criar adicionar ponto se for número
                    if (!dados.numeroAnexo) dados.numeroAnexo = '';
                    dados.numeroAnexo = dados.numeroAnexo.trim();
                    break;
                }
            }
            if (dados.nomeAnexo === '') {
                dados.nomeAnexo = 'Anexo';
            }
        }
        dados = Object.assign(this.defaultAnexo(), dados);
        this.fixDados(dados);
        return dados;
    }




    private async getPdf(uint8Array: Uint8Array) {
        var loadingTask = pdfjsLib.getDocument(uint8Array);
        let pdf: Pdf = await loadingTask.promise;
        let pages: Promise<PdfPage>[] = []
        for (let i = 1; i < pdf.numPages + 1; i++) {
            pages.push(pdf.getPage(i));
        }
        await Promise.all(pages);
        return pdf;
    }

    private async getPdfPage(pdf: Pdf, pageNumber: number) {
        let page = await pdf.getPage(pageNumber);
        return page;
    };

    /**
     * 
     * @param pdf arquivo psfjs
     * @param fix variação de pontos para considerar na mesma linha
     * @returns 
     */
    private async getPdfText(pdf: Pdf, fix = 2) {
        let pdfText = '';
        for (let i = 1; i < pdf.numPages + 1; i++) {
            pdfText += await this.getPageText(pdf, i, fix);
        }
        return pdfText;
    }

    private async getPageText(pdf: Pdf, pageNo: number, fix = 2) {
        let page = await pdf.getPage(pageNo);
        let tokenizedText = await page.getTextContent();
        let pageText = '';
        let itens = tokenizedText.items.sort((a, b) => {
            return (a.transform[4] - b.transform[4])
        })
        itens = tokenizedText.items.sort((a, b) => {
            let v = (b.transform[5] + b.transform[3]) - (a.transform[5] + a.transform[3]);
            if (v >= -fix && v <= fix) {
                return 0;
            } else {
                return v;
            }
        })
        let referenceItem = itens[0];
        for (let i = 0; i < itens.length; i++) {
            let item = itens[i];
            let v = (item.transform[5] + item.transform[3]) - (referenceItem.transform[5] + referenceItem.transform[3]);
            let str = item.str.replace(/[\x09]/g, '   ').trim();
            if (v >= -fix && v <= fix) {
                pageText += (i > 0 ? '\t' : '') + str;
            } else {
                referenceItem = item;
                pageText += '\n' + str;
            }
        }
        return pageText;
    }

    private checarCoordenada(item: PdfTextItem, coordenadaPdf: CoordenadaPdf, scale: number) {
        return item.transform[4] >= scale * coordenadaPdf.x1 && item.transform[4] <= scale * coordenadaPdf.x2 &&
            item.transform[5] <= (scale * 29.7 - scale * coordenadaPdf.y1) && item.transform[5] >= (scale * 29.7 - scale * coordenadaPdf.y2);
    };

    private async processarLeituraDasCoordenadas(coordenadasDados: DadosEquiplanoPDF, pdfPage: PdfPage, dados: DadosEquiplanoPDF) {
        let scale = pdfPage._pageInfo.view[2] / 21;
        let pdfItens: PdfTextItens = (await pdfPage.getTextContent()).items;

        for (let curNameCoordenadasDados in coordenadasDados) {
            if (curNameCoordenadasDados.endsWith('Format') || curNameCoordenadasDados.endsWith('ConcatSepatator')) {
                continue;
            }
            let curCoordenadasDados: CoordenadaPdf = coordenadasDados[curNameCoordenadasDados];
            if (typeof curCoordenadasDados !== 'object') {
                dados[curNameCoordenadasDados] = curCoordenadasDados;
            } else {
                if (curCoordenadasDados.x1 && curCoordenadasDados.x2) {
                    let concatSepatator = coordenadasDados[curNameCoordenadasDados + 'ConcatSepatator'] || ' ';
                    let format: FormatFunction = coordenadasDados[curNameCoordenadasDados + 'Format'];
                    for (let item of pdfItens) {
                        if (this.checarCoordenada(item, curCoordenadasDados, scale)) {
                            let str = item.str;
                            if (format && typeof format === 'function') {
                                str = format(str, <DadosEquiplanoPDF>dados);
                            }
                            if (str) {
                                if (!dados[curNameCoordenadasDados]) {
                                    dados[curNameCoordenadasDados] = str;
                                } else {
                                    dados[curNameCoordenadasDados] += concatSepatator + str;
                                }
                            }
                        }
                    }
                } else {
                    if (!dados[curNameCoordenadasDados]) {
                        dados[curNameCoordenadasDados] = {};
                    }
                    await this.processarLeituraDasCoordenadas(coordenadasDados[curNameCoordenadasDados], pdfPage, dados[curNameCoordenadasDados]);
                }
            }
        }
        return dados;
    };

}