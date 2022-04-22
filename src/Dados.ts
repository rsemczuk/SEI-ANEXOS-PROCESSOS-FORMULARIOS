// ADICIONA UM NOME CURTO A UM ANEXO E COLETA DADOS COMPLEMENTARES
namespace DefaultData {
    function __getFormulario(nome: string, formularios?: FormularioConfig[]): FormularioConfig {
        for (let f of formularios || AnexosTools.getCfg().formulariosConfig) {
            if (f.nome === nome) return f;
        }
    }

    export var parametroAnexos: Param[] = [
        {
            desativado: false, //USAR PARAMETRO
            dados: {
                inserirAnexo: true, // SE FALSO ELE É USADO APENAS PARA CAPTURAR DADOS PARA GERAR UM FORMULÁRIO
                nomeAnexo: ["Nota de Estorno de Pagamento"],//NOME COMPLETO DO ANEXO
                atualizarJuntoComAExtensao: true, // MANTEM ATUALIZADO ESSA CONFIGURAÇÃO COM AS ATUALIZAÇÕES
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"], // UNIDADES DE TRABALHO QUE UTILIZAM, COM ISSO É POSSÍVEL MOSTRAR APENAS OS ITENS RELEVANTES PARA O SEU SETOR
            nomeParametro: 'Estorno de Pagamento', // NOME ÚNICO DO PARAMETRO
            descricao: ' seleciona estorno de pagamento se iniciar com EP',//BREVE RELATO DO QUE O PARAMETRO FAZ
            rx: /^EP[-_ ](?<numeroAnexo>[0-9\.]+[-_][0-9]{4})/i.source,// EXPRESSÃO REGULAR PARA CAPTURA DOS DADOS COMPLEMENTARES
            flags: 'i',//OPÇÕES DA EXPRESSÃO REGULAR "i = case insensitive"
            exemploUtilizado: 'EP 123-2020.PDF',
            lerArquivoComoTexto: false, //COLETA OS DADOS COMPLEMENTARES DE DENTRO DO ARQUIVO EM VEZ DO NOME

        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ["Nota de Estorno de Empenho"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"],
            nomeParametro: 'Estorno de nota de empenho',
            descricao: ' seleciona estorno de nota pagamento se iniciar com ENE',
            rx: /^ENE[-_ ](?<numeroAnexo>[0-9\.]+[-_][0-9]{4})/i.source,
            flags: 'i',

            exemploUtilizado: 'ENE 123-2020.PDF',

            lerArquivoComoTexto: false
        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ["Nota de Estorno de Liquidação"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"],
            nomeParametro: 'Estorno de nota de liquidação',
            descricao: ' seleciona estorno de nota de liquidação se iniciar com ENL',
            rx: /^ENL[-_ ](?<numeroAnexo>[0-9\.]+[-_][0-9]{4})/i.source,
            flags: 'i',
            exemploUtilizado: 'ENL 123-2020.PDF',

            lerArquivoComoTexto: false,
        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ['Previsão de Pagamento'],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"],
            nomeParametro: 'Previsão de pagamento',
            descricao: ' seleciona previsão de pagamento se iniciar com P',
            rx: /^P[-_ ](?<numeroAnexo>[0-9\.]+[-_][0-9]{4})/i.source,
            flags: 'i',
            exemploUtilizado: 'P 123-2020.PDF',

            lerArquivoComoTexto: false,
        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ["Nota de Liquidação", "Nota de Liquidação - Equiplano"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"],
            nomeParametro: 'Nota de liquidação',
            descricao: ' seleciona nota de liquidação se iniciar com NL',
            rx: /^NL[-_ ](?<numeroAnexo>[0-9\.]+[-_][0-9]{4})/i.source,
            flags: 'i',
            exemploUtilizado: 'NL 123-2020.PDF',
            lerArquivoComoTexto: false,
        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ["Nota de Empenho", "Nota de Empenho - Equiplano"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"],
            nomeParametro: 'Nota de empenho',
            descricao: ' seleciona nota de empenho se iniciar com NE',
            rx: /^NE[-_ ](?<numeroAnexo>[0-9\.]+[-_][0-9]{4})/i.source,
            flags: 'i',
            exemploUtilizado: 'NE 123-2020 11-11-2020.PDF',
            lerArquivoComoTexto: false,
            outrosParametros: [
                {
                    descricao: 'capturar data a partir do formato 11-11-2020 (obs. inserir um espaço ou underline ou traço antes da data)',
                    flags: 'im',
                    rx: /(?<data>[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}|[0-9]{2}[ ][0-9]{2}[ ][0-9]{4}|[0-9]{2}[_][0-9]{2}[_][0-9]{4}|[0-9]{2}[\-][0-9]{2}[\-][0-9]{4})/.source
                }
            ],
        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ["Boleto"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"],
            nomeParametro: 'Boleto',
            descricao: ' seleciona boleto se iniciar com Boleto',
            rx: /^Boleto[ _-]*(?:NF(?:[S]?[ _-]?[E])?[ _-]+|Fatura[ _-]+)?(?<numeroAnexo>[^.]*)/i.source,
            flags: 'i',
            exemploUtilizado: 'Boleto NFS-e 123. 11-11-2020.PDF',
            lerArquivoComoTexto: false,
            outrosParametros: [
                {
                    descricao: 'capturar data a partir do formato 11-11-2020 (obs. inserir um espaço ou underline ou traço antes da data)',
                    flags: 'im',
                    rx: /(?<data>[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}|[0-9]{2}[ ][0-9]{2}[ ][0-9]{4}|[0-9]{2}[_][0-9]{2}[_][0-9]{4}|[0-9]{2}[\-][0-9]{2}[\-][0-9]{4})/.source
                }
            ],
        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ["NFS-e"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"],
            nomeParametro: 'Nota fiscal de serviços',
            descricao: ' seleciona NFS-e se iniciar com NFS ou NFSe ou NFS-e',
            rx: /^NFS(?:[ _-]?[E])?[ _-]+(?<numeroAnexo>[^.]*)/i.source,
            flags: 'i',
            exemploUtilizado: 'NFS-e 123. 11-11-2020.PDF',
            lerArquivoComoTexto: false,
            outrosParametros: [
                {
                    descricao: 'capturar data a partir do formato 11-11-2020 (obs. inserir um espaço ou underline ou traço antes da data)',
                    flags: 'im',
                    rx: /(?<data>[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}|[0-9]{2}[ ][0-9]{2}[ ][0-9]{4}|[0-9]{2}[_][0-9]{2}[_][0-9]{4}|[0-9]{2}[\-][0-9]{2}[\-][0-9]{4})/.source
                }
            ],
        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ["Nota Fiscal Eletrônica"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"],
            nomeParametro: 'Nota fiscal de produtos',
            descricao: ' seleciona Nota Fiscal Eletrônica se iniciar com NF ou NF-e ou NFe',
            rx: /^NF(?:[ _-]?[E])?[ _-]+(?<numeroAnexo>[^.]*)/i.source,
            flags: 'i',
            exemploUtilizado: 'NF 123. 11-11-2020.PDF',
            lerArquivoComoTexto: false,
            outrosParametros: [
                {
                    descricao: 'capturar data a partir do formato 11-11-2020 (obs. inserir um espaço ou underline ou traço ou barra antes da data)',
                    flags: 'im',
                    rx: /(?<data>[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}|[0-9]{2}[ ][0-9]{2}[ ][0-9]{4}|[0-9]{2}[_][0-9]{2}[_][0-9]{4}|[0-9]{2}[\-][0-9]{2}[\-][0-9]{4})/.source
                }
            ],
        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ["Relatório"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"],
            nomeParametro: 'Relatório',
            rx: /^REL[ _-]+(?<numeroAnexo>[^\.]*)/i.source,
            descricao: ' seleciona Relatório se iniciar com REL',
            lerArquivoComoTexto: false,
            flags: 'i',
            exemploUtilizado: 'REL 123. 11-11-2020.PDF',
            outrosParametros: [
                {
                    descricao: 'capturar data a partir do formato 11-11-2020 (obs. inserir um espaço ou underline ou traço antes da data)',
                    flags: 'im',
                    rx: /(?<data>[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}|[0-9]{2}[ ][0-9]{2}[ ][0-9]{4}|[0-9]{2}[_][0-9]{2}[_][0-9]{4}|[0-9]{2}[\-][0-9]{2}[\-][0-9]{4})/.source
                }
            ],
        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ["E-mails recebidos"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"],
            nomeParametro: 'Email',
            descricao: ' seleciona E-mails recebidos se iniciar com Email ou E-mail',
            rx: /^E.?mail[ _-]?(?<numeroAnexo>.*).*\./i.source,
            flags: 'i',
            exemploUtilizado: 'EMAIL 123. 11-11-2020.PDF',
            lerArquivoComoTexto: false,
            outrosParametros: [
                {
                    descricao: 'capturar data a partir do formato 11-11-2020 (obs. inserir um espaço ou underline ou traço antes da data)',
                    flags: 'im',
                    rx: /(?<data>[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}|[0-9]{2}[ ][0-9]{2}[ ][0-9]{4}|[0-9]{2}[_][0-9]{2}[_][0-9]{4}|[0-9]{2}[\-][0-9]{2}[\-][0-9]{4})/.source
                }
            ],
        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ["Boletim de Ocorrência"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML", "PML-DEFESA SOCIAL"],
            nomeParametro: 'Boletim de ocorrência',
            descricao: ' seleciona Boletim de ocorrência se iniciar com 123 BO GM 111222 Nº 20202020',
            rx: /^[0-9]+[ _-]*BO[ _-]*GM[ _-]*(?<numeroAnexo>[0-9-]+(?:[ ]*Nº[ ]*[\d]+)?)([^\.]*)/i.source,
            flags: 'i',
            exemploUtilizado: '123 BO GM 111222 Nº 20202020. 11-11-2020.PDF',
            lerArquivoComoTexto: false,
            outrosParametros: [
                {
                    descricao: 'capturar data a partir do formato 11-11-2020 (obs. inserir um espaço ou underline ou traço antes da data)',
                    flags: 'im',
                    rx: /(?<data>[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}|[0-9]{2}[ ][0-9]{2}[ ][0-9]{4}|[0-9]{2}[_][0-9]{2}[_][0-9]{4}|[0-9]{2}[\-][0-9]{2}[\-][0-9]{4})/.source
                }
            ],
        },
        {
            desativado: false,
            dados: {
                inserirAnexo: true,
                nomeAnexo: ["Fotos / Imagens"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML"],
            nomeParametro: 'Foto ou imagem',
            descricao: ' seleciona Fotos / Imagens se iniciar com Foto ou Imagem',
            rx: /^(?:FOTO|IMAGEM)[ _-](?<numeroAnexo>[^\.\n]*)/i.source,
            flags: 'i',
            exemploUtilizado: 'FOTO 123. 11-11-2020.png',
            lerArquivoComoTexto: false,
            outrosParametros: [
                {
                    descricao: 'capturar data a partir do formato 11-11-2020 (obs. inserir um espaço ou underline ou traço antes da data)',
                    flags: 'im',
                    rx: /(?<data>[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}|[0-9]{2}[ ][0-9]{2}[ ][0-9]{4}|[0-9]{2}[_][0-9]{2}[_][0-9]{4}|[0-9]{2}[\-][0-9]{2}[\-][0-9]{4})/.source
                }
            ],
        },
        {
            // coletar dados no arquivo de texto (vide modelo) e para gerar um SEI com formulário
            desativado: false,
            dados: {
                inserirAnexo: false,
                nomeAnexo: ["Solicitação de empenho"],
                atualizarJuntoComAExtensao: true,
                hipoteseLegal: "",
                nivelAcesso: "público"
            },
            unidadesDeTrabalho: ["PML", "PML-FISCAL DE CONTRATO"],
            exemploUtilizado: "CONTRATADA: TOTAL VET COM IMPORTACAO E EXPORTACAO DE PROD VETERINARIOS LTDA\n\nCONTRATO/ATA Nº: 328/2020\n\nMODALIDADE/ANO: Pregão nº209/2020\n\nOBJETO: Registro de preços para a eventual aquisição de ração.\n\nMÊS DE REFERÊNCIA: Abril/2021\n\n \n\n \nLote \tItem \tCod. Produto \tProduto \tMarca \tPreço \tQuantidade \tUnidade \tTotal\n48 \t1 \t23449 \tCOLA BRANCA EM BASTÃO - 20G \tGATTE \tR$ 0,86 \t10 \tUN \tR$ 8,60 \n68 \t1 \t4270 \tESPIRAL 17MM ( 100FL ) PVC \tPLASPIRAL \tR$0,13 \t100 \tUN \tR$ 13,00\n163 \t1 \t537 \tPORTA DOCUMENTO 7 X 10 CM \tPLAST PARK \tR$17,14 \t1 \tCE \tR$17,14\n182 \t1 \t12497 \tUmedecedor de dedos GEL com 12 gramas \tSTAR \tR$0,98 \t20 \tUN \tR$19,60\n\n ",
            descricao: "Solicitação de empenho",
            flags: "i",
            lerArquivoComoTexto: true,
            nomeParametro: "Solicitacao de Empenho",
            rx: "^SE",
            nomeGrupo: "",
            nomeLista: "",
            outrosParametros: [
                {
                    flags: "igm",
                    descricao: "com a flag g,  a captura vira uma lista. Exemplo uma lista de produtos com nome, unidade de medida e quantidade (dados separados por tab \\t)",
                    rx: /^(?<lote>[0-9 ]+)\t(?<item>[^\t]*)\t(?<codProduto>[^\t]*)\t(?<produto>[^\t]*)\t(?<marca>[^\t]*)\t(?<preco>[^\t]*)\t(?<quantidade>[^\t]*)\t(?<unidade>[^\t]*)\t(?<total>.*)/.source,
                    nomeLista: "produtos",
                    nomeGrupo: ""
                },
                {
                    flags: "im",
                    descricao: "Captura fornecedor",
                    rx: /^CONTRATADA:[ ]*(?<fornecedor>.*)/.source,
                    nomeGrupo: ""
                },
                {
                    flags: "im",
                    descricao: "Captura contrato",
                    rx: /^CONTRATO\/ATA Nº:[ ]*(?<contrato>.*)/.source,
                    nomeGrupo: ""
                },
                {
                    flags: "im",
                    descricao: "Captura modalidade",
                    rx: /^MODALIDADE\/ANO:[ ]*(?<modalidade>.*)/.source,
                    nomeGrupo: ""
                },
                {
                    flags: "im",
                    descricao: "Captura objeto",
                    rx: /^OBJETO:[ ]*(?<objeto>.*)/.source,
                    nomeGrupo: ""
                },
                {
                    flags: "im",
                    descricao: "Captura referencia",
                    rx: /^MÊS DE REFERÊNCIA:[ ]*(?<referencia>.*)/.source,
                    nomeGrupo: ""
                },
                {
                    flags: "im",
                    descricao: "Captura localEntrega",
                    rx: /^LOCAL DE ENTREGA:[ ]*(?<localEntrega>.*)/.source,
                    nomeGrupo: ""
                },
                {
                    flags: "im",
                    descricao: "Captura responsavelRecebimento",
                    rx: /^RESPONSÁVEL PELO RECEBIMENTO:[ ]*(?<responsavelRecebimento>.*)/.source,
                    nomeGrupo: ""
                },
                {
                    flags: "im",
                    descricao: "Captura telefone",
                    rx: /^TELEFONE DE CONTATO:[ ]*(?<telefone>.*)/.source,
                    nomeGrupo: ""
                }
            ]
        }
    ];

    export var coordenadasDocumentos: DadosEquiplanoPDF[] = [
        {
            desativado: false,
            formato: 'Nato-digital',
            hipoteseLegal: 'Público',
            nivelAcesso: 'público',
            unidadesDeTrabalho: ["PML", "PML-EMPENHO"],
            nomeCoordenada: 'Nota de empenho',
            atualizarJuntoComAExtensao: true,
            inserirAnexo: true,
            pdfContain: "\nNOTA DE EMPENHO\n",
            pdfPage: 1,
            nomeAnexo: ['Nota de Empenho', 'Nota de Empenho - Equiplano'],
            numeroAnexo: <string><unknown><CoordenadaPdf>{ x1: 1, y1: 3.6, x2: 7.2, y2: 4.13 },
            data: <string><unknown><CoordenadaPdf>{ x1: 11.3, y1: 3.6, x2: 14.55, y2: 4.13 },
            documento: {
                tipo: { x1: 7.5, y1: 3.6, x2: 10.8, y2: 4.13 },
                requisicaoN: { x1: 14.85, y1: 3.6, x2: 17.7, y2: 4.13 },
                reqCompraN: { x1: 18, y1: 3.6, x2: 20, y2: 4.13 },
                valor: { x1: 16.66, y1: 10.45, x2: 20, y2: 11 },
                fonte: { x1: 2.97, y1: 11.34, x2: 3.85, y2: 11.74 },
            },
            licitacao: {
                tipo: { x1: 1, y1: 4.9, x2: 7.2, y2: 5.3 },
                numero: { x1: 7.58, y1: 4.9, x2: 16.38, y2: 5.3 }
            },
            contratoAditivo: {
                sequencia: { x1: 1, y1: 6, x2: 2.36, y2: 6.43 },
                contrato: { x1: 2.47, y1: 6, x2: 6.43, y2: 6.43 },
                aditivo: { x1: 6.6, y1: 6, x2: 7.63, y2: 6.43 },
                inicioDaVigencia: { x1: 7.8, y1: 6, x2: 9.6, y2: 6.43 },
                fimDaVigencia: { x1: 9.7, y1: 6, x2: 11.34, y2: 6.43 },
                fimdaVigAtualizada: { x1: 11.41, y1: 6, x2: 13.75, y2: 6.43 },
                inicioDaExecucao: { x1: 13.81, y1: 6, x2: 15.69, y2: 6.43 },
                fimDaExecucao: { x1: 15.8, y1: 6, x2: 17.48, y2: 6.43 },
                fimDaExeAtualizada: { x1: 17.63, y1: 6, x2: 20, y2: 6.43 }
            },
            credor: {
                fornecedor: { x1: 1, y1: 7, x2: 12.7, y2: 7.5 },
                matricula: { x1: 12.8, y1: 7, x2: 15, y2: 7.5 },
                CPFCNPJ: { x1: 15.2, y1: 7, x2: 20, y2: 7.5 },
                endereco: { x1: 1, y1: 7.8, x2: 15.7, y2: 8.2 },
                bairro: { x1: 16.2, y1: 7.8, x2: 20, y2: 8.2 },
                cidadeUF: { x1: 1, y1: 8.56, x2: 8.53, y2: 9 },
                CEP: { x1: 8.56, y1: 8.56, x2: 10.5, y2: 9 },
                fone: { x1: 10.58, y1: 8.56, x2: 13, y2: 9 },
                tipoDeContaBancaria: { x1: 13.02, y1: 8.56, x2: 15.3, y2: 9 },
                banco: { x1: 15.3, y1: 8.56, x2: 16.08, y2: 9 },
                agencia: { x1: 16.1, y1: 8.56, x2: 17.5, y2: 9 },
                conta: { x1: 17.5, y1: 8.56, x2: 20, y2: 9 }
            }

        },
        {
            formato: 'Nato-digital',
            hipoteseLegal: 'Público',
            nivelAcesso: 'público',
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-LIQUIDAÇÃO"],
            nomeCoordenada: 'Nota de liquidação',
            atualizarJuntoComAExtensao: true,
            inserirAnexo: true,
            pdfContain: "NOTA DE LIQUIDAÇÃO",
            pdfPage: 1,
            nomeAnexo: ["Nota de Liquidação", "Nota de Liquidação - Equiplano"],
            numeroAnexo: <string><unknown><CoordenadaPdf>{ x1: 1, y1: 3.6, x2: 5.4, y2: 4.13 },
            data: <string><unknown><CoordenadaPdf>{ x1: 5.8, y1: 3.6, x2: 8.55, y2: 4.13 },
            documento: {
                fonte: { x1: 2.91, y1: 11.14, x2: 3.84, y2: 11.53 }
            },
            licitacao: {
                tipo: { x1: 1, y1: 4.75, x2: 7.2, y2: 5.16 },
                numero: { x1: 7.65, y1: 4.75, x2: 16.38, y2: 5.16 }
            },
            contratoAditivo: {
                sequencia: { x1: 1, y1: 5.82, x2: 2.36, y2: 6.3 },
                contrato: { x1: 2.47, y1: 5.82, x2: 6.43, y2: 6.3 },
                aditivo: { x1: 6.6, y1: 5.82, x2: 7.63, y2: 6.3 },
                inicioDaVigencia: { x1: 7.8, y1: 5.82, x2: 9.6, y2: 6.3 },
                fimDaVigencia: { x1: 9.6, y1: 5.82, x2: 11.3, y2: 6.3 },
                fimdaVigAtualizada: { x1: 11.31, y1: 5.82, x2: 13.7, y2: 6.3 },
                inicioDaExecucao: { x1: 13.71, y1: 5.82, x2: 15.69, y2: 6.3 },
                fimDaExecucao: { x1: 15.7, y1: 5.82, x2: 17.48, y2: 6.3 },
                fimDaExeAtualizada: { x1: 17.5, y1: 5.82, x2: 20, y2: 6.3 }
            },
            credor: {
                fornecedor: { x1: 1, y1: 6.85, x2: 12.7, y2: 7.3 },
                matricula: { x1: 12.8, y1: 6.85, x2: 15, y2: 7.3 },
                CPFCNPJ: { x1: 15.2, y1: 6.85, x2: 20, y2: 7.3 },
                endereco: { x1: 1, y1: 7.65, x2: 15.7, y2: 8.0 },
                bairro: { x1: 16.2, y1: 7.65, x2: 20, y2: 8.0 },
                cidadeUF: { x1: 1, y1: 8.41, x2: 8.53, y2: 8.85 },
                CEP: { x1: 8.56, y1: 8.41, x2: 10.5, y2: 8.85 },
                fone: { x1: 10.58, y1: 8.41, x2: 12.95, y2: 8.85 },
                tipoDeContaBancaria: { x1: 13, y1: 8.41, x2: 15.20, y2: 8.85 },
                banco: { x1: 15.26, y1: 8.41, x2: 16.08, y2: 8.85 },
                agencia: { x1: 16.1, y1: 8.41, x2: 17.5, y2: 8.85 },
                conta: { x1: 17.5, y1: 8.41, x2: 20, y2: 8.85 }
            }
        },
        {
            formato: 'Nato-digital',
            hipoteseLegal: 'Público',
            nivelAcesso: 'público',
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-PAGAMENTO"],
            nomeCoordenada: 'Nota de pagamento',
            atualizarJuntoComAExtensao: true,
            inserirAnexo: true,
            pdfContain: "NOTA DE PAGAMENTO",
            pdfPage: 1,
            data: <string><unknown><CoordenadaPdf>{ x1: 4.49, y1: 3.59, x2: 6.09, y2: 3.98 },
            dataFormat: (data, obj) => {
                let ano = data.replace(/[0-9]{2}\/[0-9]{2}\/([0-9]{4})/, '$1');
                if (obj.numeroAnexo) {
                    let numero = <string>obj.numeroAnexo;
                    if (!numero.match(/\//))
                        obj.numeroAnexo = obj.numeroAnexo + '/' + ano;
                }
                let dataDate = Date.parse(data.replace(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/, '$3-$2-$1'));
                if (dataDate && dataDate <= Date.now()) {
                    return data;
                }
                else {
                    return new Date().toLocaleDateString();
                }
            },
            nomeAnexo: ['Previsão de Pagamento'],
            numeroAnexo: <string><unknown><CoordenadaPdf>{ x1: 7.1, y1: 3.6, x2: 11, y2: 4.13 },
            numeroFormat: (numero, obj) => {
                let ano = '';
                if (obj.data) {
                    let data = <string>obj.data;
                    ano = "/" + data.replace(/[0-9]{2}\/[0-9]{2}\/([0-9]{4})/, '$1');
                }
                return Number.parseInt(numero).toLocaleString('pt-BR') + ano;
            },
            documento: {
                previsao: { x1: 4.47, y1: 3.54, x2: 7, y2: 4.13 },
                valor: { x1: 18.13, y1: 10.68, x2: 19.89, y2: 11.02 },
                fonte: { x1: 1.11, y1: 14.72, x2: 1.50, y2: 20.07 },
                fonteFormat: (fonte, obj) => {
                    if (fonte.match(/^[0-9]{5} - /)) {
                        let curTxt = fonte.slice(0, 5);
                        if (parseInt(curTxt) < 3000) {
                            return curTxt.replace(/(^[0]{1,2})/, '');
                        } else {
                            return null;
                        }
                    }
                    else {
                        return null;
                    }
                },
                dotacao: { x1: 1.62, y1: 10.64, x2: 3.89, y2: 11.09 },
                dotacaoFormat: (str, obj) => {
                    return str;
                },
            },
            credor: {
                fornecedor: { x1: 1, y1: 6.85, x2: 12.7, y2: 7.3 },
                matricula: { x1: 12.8, y1: 6.85, x2: 15, y2: 7.3 },
                CPFCNPJ: { x1: 15.2, y1: 6.85, x2: 20, y2: 7.3 },
                endereco: { x1: 1, y1: 7.65, x2: 15.7, y2: 8.0 },
                bairro: { x1: 16.2, y1: 7.65, x2: 20, y2: 8.0 },
                cidadeUF: { x1: 1, y1: 8.41, x2: 8.53, y2: 8.85 },
                CEP: { x1: 8.56, y1: 8.41, x2: 10.5, y2: 8.85 },
                fone: { x1: 10.58, y1: 8.41, x2: 12.95, y2: 8.85 },
                tipoDeContaBancaria: { x1: 13, y1: 8.41, x2: 15.20, y2: 8.85 },
                banco: { x1: 15.26, y1: 8.41, x2: 16.08, y2: 8.85 },
                agencia: { x1: 16.1, y1: 8.41, x2: 17.5, y2: 8.85 },
                conta: { x1: 17.5, y1: 8.41, x2: 20, y2: 8.85 }
            }
        }
    ];





    declare let produtos: {
        [key: string]: string;
    }[];

    export var formulariosConfig: FormularioConfig[] = [
        {
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-FISCAL DE CONTRATO"],
            atualizarJuntoComAExtensao: true,
            qntItensSelecionados: 1,
            btnColor: 'Khaki',
            btnGerarFormulario: true,
            sempreMostarBtn: false,
            nivelAcesso: 'público',
            nome: 'Manifestação - Conclusão Processo',
            nomeFormulario: 'Contratos: Manifestação - Conclusão Processo',
            descricaoDoFormulario: "Insere a o formulário de conclusão do processo SEI do empenho (Obs. todos os empenhos do processo SEI não podem possuir saldo à liquidar ou saldo à pagar)",
            observacoesDaUnidade: '',
            filtrarNomes: ['Nota de Empenho', 'Nota de Empenho - Equiplano', 'Nota de Liquidação', 'Nota de Liquidação - Equiplano'],
            procurarInserirParagrafos: [
                {
                    posicaoParaInserir: 'substituir_paragrafo',
                    textoParaProcurar: 'CONTRATADA:',
                    paragrafos: [{
                        estilo: 'Texto_Alinhado_Esquerda',
                        texto: `<b>CONTRATADA:  <<<${(() => (() => {
                            return credor ? (credor.fornecedor ? credor.fornecedor : "") : "";
                        })()).toString().replace(/DefaultData\./g, '')}>>></b>`
                    }]
                },
                {
                    posicaoParaInserir: 'substituir_paragrafo',
                    textoParaProcurar: 'CONTRATO/ATA Nº:',
                    paragrafos: [{
                        estilo: 'Texto_Alinhado_Esquerda',
                        texto: `<b>CONTRATO/ATA Nº: <<<${(() => (() => {
                            return contratoAditivo ? (contratoAditivo.contrato ? contratoAditivo.contrato : "") : "";
                        })()).toString().replace(/DefaultData\./g, '')}>>></b>`
                    }]
                },
                {
                    posicaoParaInserir: 'substituir_paragrafo',
                    textoParaProcurar: 'MODALIDADE/ANO:',
                    paragrafos: [{
                        estilo: 'Texto_Alinhado_Esquerda',
                        texto: `<b>MODALIDADE/ANO: <<<${(() => (() => {
                            let _str = licitacao ? (licitacao.tipo ? <string>licitacao.tipo : "") : "";
                            _str += licitacao ? (licitacao.numero ? " " + licitacao.numero : "") : "";
                            return _str
                        })()).toString().replace(/DefaultData\./g, '')}>>></b>`
                    }]
                },
                {
                    novoEstilo: 'Texto_Alinhado_Esquerda',
                    textoParaProcurar: 'processo de Gestão Contratual'
                },
                {
                    posicaoParaInserir: 'substituir_texto',
                    textoParaProcurar: 'Londrina,',
                    paragrafos: [{
                        texto: 'Londrina, '
                    }]
                },


            ]
        },
        {
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-EMPENHO"],
            atualizarJuntoComAExtensao: true,
            qntItensSelecionados: 1,
            btnColor: 'cyan',
            btnGerarFormulario: true,
            sempreMostarBtn: false,
            nivelAcesso: 'público',
            nome: 'Ratificação de Empenho',
            nomeFormulario: ['Ratificação de nota de empenho', 'CGM: Ratificação de Empenho'],
            descricaoDoFormulario: "Insere a o formulário de ratificação do(s) empenho(s) (Obs. precisa estar selecionado os empenhos a serem ratificados)",
            observacoesDaUnidade: '',
            filtrarNomes: ['Nota de Empenho', 'Nota de Empenho - Equiplano'],
            procurarInserirParagrafos: [
                {
                    posicaoParaInserir: 'substituir_paragrafo',
                    textoParaProcurar: 'Link SEI',
                    paragrafos: [{
                        estilo: 'Texto_Alinhado_Esquerda',
                        texto: '<<<LISTA_NUMERADA>>>'
                    }]
                },
            ]
        },
        {
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-LIQUIDAÇÃO"],
            atualizarJuntoComAExtensao: true,
            qntItensSelecionados: 1,
            btnColor: 'royalblue',
            btnGerarFormulario: true,
            sempreMostarBtn: false,
            nivelAcesso: 'público',
            nome: 'Ratificação de Nota de Liquidação',
            nomeFormulario: 'CGM: Ratificação de Nota de Liquidação',
            descricaoDoFormulario: "Insere a o formulário de ratificação do(s) liquidação(s) (Obs. precisa estar selecionado as liquidações a serem ratificadas)",
            observacoesDaUnidade: '',
            filtrarNomes: ['Nota de Liquidação', 'Nota de Liquidação - Equiplano'],
            procurarInserirParagrafos: [
                {
                    posicaoParaInserir: 'substituir_paragrafo',
                    textoParaProcurar: '/Nota.*de.*liquidação.*1/i',
                    paragrafos: [{
                        estilo: 'Texto_Alinhado_Esquerda',
                        texto: '<<<LISTA_NUMERADA>>>'
                    }]
                },
            ]
        },
        {
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-EMPENHO", "PML-LIQUIDAÇÃO"],
            atualizarJuntoComAExtensao: true,
            qntItensSelecionados: 1,
            btnColor: 'yellow',
            btnGerarFormulario: true,
            sempreMostarBtn: false,
            nivelAcesso: 'público',
            nome: 'Ratificação de Estorno de NE e NL',
            nomeFormulario: 'Ratificação de Estorno de NE e NL',
            descricaoDoFormulario: "Insere a o formulário de ratificação de estorno de Nota de Liquidação/Nota de Empenho (Obs. precisa estar selecionado os estornos de NE/NL)",
            observacoesDaUnidade: '',
            filtrarNomes: ['Nota de Estorno de Empenho', 'Nota de Estorno de Liquidação'],
            procurarInserirParagrafos: [
                {
                    textoParaProcurar: '2',
                    posicaoParaInserir: 'substituir_texto',
                    remover: true,
                    paragrafos: [{
                        estilo: '',
                        texto: ''
                    }]
                },
                {
                    posicaoParaInserir: 'substituir_paragrafo',
                    textoParaProcurar: 'link SEI',
                    paragrafos: [{
                        estilo: 'Texto_Centralizado',
                        texto: '<<<LISTA>>>'
                    }]
                },
            ]
        }
        ,
        {
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-PAGAMENTO"],
            atualizarJuntoComAExtensao: true,
            // numeroModelo: '1420856',
            btnColor: 'Goldenrod',
            qntItensSelecionados: 1,
            btnGerarFormulario: true,
            sempreMostarBtn: false,
            nivelAcesso: 'público',
            nome: 'Autorização de Pagamento',
            nomeFormulario: 'SMF: Autorização de Pagamento',
            descricaoDoFormulario: "Insere a o formulário de autorização de pagamento (Obs. precisa estar selecionado as previsões a serem autorizadas)",
            observacoesDaUnidade: '',
            filtrarNomes: ['Previsão de Pagamento'],
            procurarInserirParagrafos: [
                {
                    posicaoParaInserir: 'substituir_paragrafo',
                    textoParaProcurar: 'Municipal autoriza os pagamentos',
                    paragrafos: [{
                        estilo: 'Texto_Justificado',
                        texto: 'O <<<textoPadrao.secretario>>> autoriza os pagamentos dos seguintes documentos a serem pagos no dia <<<documento.previsao>>>'
                    }]
                },
                {
                    posicaoParaInserir: 'substituir_paragrafo',
                    textoParaProcurar: 'LINKS DO SEI',
                    paragrafos: [{
                        estilo: 'Texto_Justificado',
                        texto: `<<<LISTA_NUMERADA>>> `
                    }]
                },
            ]
        },
        {
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-FISCAL DE CONTRATO"],
            atualizarJuntoComAExtensao: true,

            qntItensSelecionados: 1,
            btnColor: 'DarkOrange',
            filtrarNomes: ['Nota Fiscal Eletrônica', 'NFS-e', 'Fatura', 'Recibo', 'Recibo de Aluguel', 'Boleto', 'Nota Fiscal'],
            nomeFormulario: 'Contratos: Recebimento do Objeto',
            btnGerarFormulario: true,
            sempreMostarBtn: false,
            descricaoDoFormulario: 'Insere o recebimento do objeto',
            nome: 'Recebimento do Objeto',
            observacoesDaUnidade: '',
            nivelAcesso: 'público',
            procurarInserirParagrafos: [
                {
                    posicaoParaInserir: 'substituir_texto',
                    textoParaProcurar: 'link SEI',
                    paragrafos: [{
                        estilo: 'Texto_Justificado',
                        texto: `<<<"<b>" + LINK_SEI_RELACIONADO(["Contratos: Gestão Contratual", "Licitação: PAL"]) + "</b>">>>`
                    }]
                },
                {
                    posicaoParaInserir: 'substituir_texto',
                    textoParaProcurar: '/da\\(s\\) Nota.*\\(link\\)/i',
                    paragrafos: [{
                        estilo: 'Texto_Justificado',
                        texto: `<<<${((): string => (() => {
                            let str = "";

                            let filtrarDocs: { rx: RegExp, plural: string, singular: string }[] = [
                                { rx: /^Fatura$/, plural: 'das Faturas ', singular: 'da Fatura ' },
                                { rx: /^Recibo$/, plural: 'dos Recibos ', singular: 'do Recibo ' },
                                { rx: /^Recibo de Aluguel$/, plural: 'dos Recibos de Aluguel ', singular: 'do Recibo de Aluguel ' },
                                { rx: /^NFS-e$/, plural: 'das Notas Fiscais de Serviço ', singular: 'da Nota Fiscal de Serviço ' },
                                { rx: /^Nota Fiscal$/, plural: 'das Notas Fiscais ', singular: 'da Nota Fiscal ' },
                                { rx: /^Nota Fiscal Eletrônica$/, plural: 'das Notas Fiscais ', singular: 'da Nota Fiscal ' }
                            ];
                            let addCount = 0;
                            filtrarDocs.forEach((_filtrarDoc) => {
                                let docsFiltrados = documentos.filter((d) => {
                                    return (<string>d.nomeAnexo).match(_filtrarDoc.rx);
                                });
                                let count = docsFiltrados.length;
                                if (count > 0) {
                                    addCount++;
                                    docsFiltrados.forEach((curDoc, i) => {
                                        if (i === 0) {
                                            if (addCount > 1) str += ' e '
                                            str += _filtrarDoc.plural
                                        } else if (i === (count - 1)) {
                                            str += ' e '
                                        } else if (count > 2 && i < (count - 1)) {
                                            str += ', '
                                        }
                                        str += " <b>" + curDoc.numeroAnexo + " (" + curDoc.LINK_EXTERNO + ")";
                                        let _docSei = GET(curDoc.numeroAnexo, /Boleto[ ]*/i);
                                        if (_docSei) str += "[<u>" + _docSei.nomeAnexo + " " + _docSei.LINK + '</u>]';
                                        str += "</b>"
                                    })
                                }
                            });
                            return str;
                        })()).toString().replace(/(?:DefaultData\.)/g, '')}>>>`
                    }]
                },
            ]
        },
        {
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-FISCAL DE CONTRATO"],
            atualizarJuntoComAExtensao: true,
            qntItensSelecionados: 0,
            filtrarNomes: [
                "Solicitação de empenho"
            ],
            nomeFormulario: "CGM: Solicitação de Empenho",
            btnGerarFormulario: false,
            sempreMostarBtn: false,
            descricaoDoFormulario: "Insere o recebimento do objeto",
            nome: "Solicitaçâo de Empenho",
            observacoesDaUnidade: "",
            nivelAcesso: "público",
            procurarInserirParagrafos: [
                {
                    posicaoParaInserir: "substituir_paragrafo",
                    textoParaProcurar: "CONTRATADA:",
                    paragrafos: [
                        {
                            estilo: "Ato_Texto_alinhado_Esquerda",
                            texto: "<<<\"<b>CONTRATADA: \" + fornecedor + \"</b>\">>>"
                        }
                    ]
                },
                {
                    posicaoParaInserir: "substituir_paragrafo",
                    textoParaProcurar: "CONTRATO/ATA Nº:",
                    paragrafos: [
                        {
                            estilo: "Ato_Texto_alinhado_Esquerda",
                            texto: "<<<\"<b>CONTRATO/ATA Nº: \" + contrato + \"</b>\">>>"
                        }
                    ]
                },
                {
                    posicaoParaInserir: "substituir_paragrafo",
                    textoParaProcurar: "MODALIDADE/ANO:",
                    paragrafos: [
                        {
                            estilo: "Ato_Texto_alinhado_Esquerda",
                            texto: "<<<\"<b>MODALIDADE/ANO: \" + modalidade + \"</b>\">>>"
                        }
                    ]
                },
                {
                    posicaoParaInserir: "substituir_paragrafo",
                    textoParaProcurar: "OBJETO:",
                    paragrafos: [
                        {
                            estilo: "Ato_Texto_alinhado_Esquerda",
                            texto: "<<<\"<b>OBJETO: \" + objeto + \"</b>\">>>"
                        }
                    ]
                },
                {
                    posicaoParaInserir: "substituir_paragrafo",
                    textoParaProcurar: "/(?:Servidor[ ]+responsável[ ]+pela[ ]+solicitação)/i",
                    remover: true,
                    paragrafos: [
                        {
                            estilo: 'Ato_Texto_alinhado_Esquerda',
                            texto: '<<<"<b>LOCAL DE ENTREGA:</b> " + (localEntrega || "")>>>'

                        },
                        {
                            estilo: 'Ato_Texto_alinhado_Esquerda',
                            texto: '<<<"<b>RESPONSÁVEL PELO RECEBIMENTO:</b> " + (responsavelRecebimento || "")>>>'
                        },
                        {
                            estilo: 'Ato_Texto_alinhado_Esquerda',
                            texto: '<<<"<b>TELEFONE DE CONTATO:</b> " + (telefone || "")>>>'
                        }
                    ]
                },
                {
                    posicaoParaInserir: "substituir_paragrafo",
                    textoParaProcurar: "/Solicitamos[ ]+a[ ]+emissão[ ]+de[ ]+Empenho/i",
                    paragrafos: [
                        {
                            estilo: "Ato_Texto_alinhado_Esquerda",
                            texto: "<<<\"Solicitamos a emissão de Empenho referente à despesa do mês de <b>(\" + referencia + \")</b> , conforme descrito abaixo:\">>>"
                        }
                    ]
                },
                {
                    posicaoParaInserir: "substituir_paragrafo",
                    textoParaProcurar: "/(?:Ratifico[ ]+a[ ]+solicitação[ ]+acima)|(?:descrever[ ]+o[ ]+nome[ ]+completo)|(?:nome[ ]+completo[ ]+e[ ]+matrícula)/i",
                    remover: true,
                    paragrafos: [{
                        estilo: 'Ato_Texto_alinhado_Esquerda',
                        texto: ' '

                    }]
                },
                {
                    posicaoParaInserir: "substituir_paragrafo",
                    textoParaProcurar: "/descrição[ ]+do[ ]+item/i",
                    paragrafos: [
                        {
                            estilo: "Ato_Texto_alinhado_Esquerda",
                            texto: `<<<${((): string => (() => TABELA(produtos, { nomesNaPrimeiraLinha: false }, [
                                { chaveColuna: 'lote', nomeColuna: 'LOTE', formato: 'numero', casasDecimais: 0 },
                                { chaveColuna: 'item', nomeColuna: 'ITEM', formato: 'numero', casasDecimais: 0 },
                                { chaveColuna: 'codProduto', nomeColuna: 'CÓD. PRODUTO', formato: 'numero', casasDecimais: 0 },
                                { chaveColuna: 'produto', nomeColuna: 'PRODUTO', formato: 'texto' },
                                { chaveColuna: 'marca', nomeColuna: 'MARCA', formato: 'texto' },
                                { chaveColuna: 'preco', nomeColuna: 'PREÇO', formato: 'moeda' },
                                { chaveColuna: 'quantidade', nomeColuna: 'QUANTIDADE', formato: 'numero', criarTotal: true, casasDecimais: 0 },
                                { chaveColuna: 'unidade', nomeColuna: 'UNIDADE DE MEDIDA', formato: 'texto' },
                                { chaveColuna: 'total', nomeColuna: 'TOTAL DO PRODUTO', resultadoDe: 'preco*quantidade', formato: 'moeda', criarTotal: true }
                            ])
                            )()).toString().replace(/DefaultData\./g, '')}>>>`
                        }
                    ]
                }
            ]
        }
    ];
    export var processosConfig: ProcessoConfig[] = [
        {
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-EMPENHO"],
            atualizarJuntoComAExtensao: true,
            gerarProcessoSei: false,
            salvarProcessoManualmente: false,
            btnGerarProcessoRelacionado: false,
            btnAlterarProcesso: false,
            descricaoDoProcesso: "Gera um processo de empenho",
            nome: "Solicitação de Empenho",
            tipoProcesso: ["Contratos: Execução de Despesa Contrato/Ata"],
            especificacao: "<<<fornecedor>>>",
            nivelAcesso: "público",
            observacoes: "",
            interessados: [
                "<<<fornecedor>>>"
            ],
            hipoteselegal: "",
            formulario: __getFormulario("Solicitaçâo de Empenho", formulariosConfig).nome
        },
        {
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-PAGAMENTO"],
            atualizarJuntoComAExtensao: true,
            btnColor: 'BurlyWood',
            gerarProcessoSei: false,
            salvarProcessoManualmente: false,
            btnGerarProcessoRelacionado: false,
            btnAlterarProcesso: true,
            descricaoDoProcesso: 'Gera um processo de previsão de pagamento',
            nome: 'Pagamento Contrato/Ata',
            tipoProcesso: ["SMF: Pagamento Contrato/Ata"],
            especificacao: "F <<<documento.fonte || '000'>>> P <<<LISTA_POR_EXTENSO_REDUZIDA_SEM_LINK.replace(/[-/][0-9]{4}/g,'')>>> <<<credor.fornecedor>>>",
            nivelAcesso: "público",
            observacoes: '',
            interessados: ['SMF-Gerência de Contas a Pagar e Controle de Crédito SMF-GCP', 'SMF-Gerência Financeira SMF-GF', '<<<credor.fornecedor>>>'],
            hipoteselegal: "",
            formulario: __getFormulario("Autorização de Pagamento", formulariosConfig).nome
        },
        {
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-PAGAMENTO"],
            atualizarJuntoComAExtensao: true,
            gerarProcessoSei: false,
            salvarProcessoManualmente: false,
            btnColor: 'Wheat',
            btnGerarProcessoRelacionado: true,
            btnGerarProcessoRelacionadoSe: ['Nota de Liquidação'],
            btnAlterarProcesso: false,
            descricaoDoProcesso: 'Gera um processo de previsão de pagamento',
            nome: 'Pagamento Contrato/Ata - Versão 2',
            tipoProcesso: ["SMF: Pagamento Contrato/Ata"],
            especificacao: "F <<<documento.fonte || '000'>>> P XXXXX <<<credor.fornecedor>>>",
            nivelAcesso: "público",
            observacoes: "",
            interessados: ['SMF-Gerência de Contas a Pagar e Controle de Crédito SMF-GCP', 'SMF-Gerência Financeira SMF-GF', '<<<credor.fornecedor>>>'],
            hipoteselegal: "",
            formulario: __getFormulario("Autorização de Pagamento", formulariosConfig).nome
        },
        {
            desativado: false,
            unidadesDeTrabalho: ["PML", "PML-EMPENHO"],
            atualizarJuntoComAExtensao: true,
            gerarProcessoSei: true,
            salvarProcessoManualmente: false,
            btnColor: 'Chocolate',
            btnGerarProcessoRelacionado: false,
            btnAlterarProcesso: true,
            descricaoDoProcesso: 'Gera um processo de empenho',
            nome: 'Execução de Despesa',
            tipoProcesso: ["Contratos: Execução de Despesa Contrato/Ata", "Contratos: Execução de Despesa Contrato/Ata-Pagamento", 'Prestação de Contas'],
            especificacao: `NE<<<ADD_s + (ADD_s?" ":"") + LISTA_POR_EXTENSO_REDUZIDA_SEM_LINK + " " + credor.fornecedor>>>`,
            nivelAcesso: "público",
            observacoes: "",
            interessados: [
                "<<<credor.fornecedor>>>"
            ],
            hipoteselegal: "",
            formulario: __getFormulario("Ratificação de Empenho", formulariosConfig).nome
        }
    ];

    export var textoPadrao: { [key: string]: string } = {
        secretario: "Sr. Secretário Municipal de Defesa Social"
    };
}
