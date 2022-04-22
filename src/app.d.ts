/// <reference path="modules/sei/ProcedimentoTrabalhar.ts" />
/// <reference path="modules/sei/ProcedimentoControlar.ts" />
/// <reference path="modules/sei/sei_init.ts" />
/// <reference path="modules/sei/windowControlar/ProcedimentoControlarClassModel.ts" />
/// <reference path="modules/sei/windowControlar/ProcedimentoEscolherTipo.ts" />
/// <reference path="modules/sei/windowControlar/ProcedimentoGerar.ts" />
/// <reference path="modules/sei/windowTrabalhar/AcessoExternoGerenciar.ts" />
/// <reference path="modules/sei/windowTrabalhar/AcompanhamentoCadastrar.ts" />
/// <reference path="modules/sei/windowTrabalhar/AndamentoMarcadorGerenciar.ts" />
/// <reference path="modules/sei/windowTrabalhar/AnotacaoRegistrar.ts" />
/// <reference path="modules/sei/windowTrabalhar/ArvoreOrdenar.ts" />
/// <reference path="modules/sei/windowTrabalhar/DocumentoGerar.ts" />
/// <reference path="modules/sei/windowTrabalhar/DocumentoReceber.ts" />
/// <reference path="modules/sei/windowTrabalhar/Editor.ts" />
/// <reference path="modules/sei/windowTrabalhar/EscolherTipoDocumento.ts" />
/// <reference path="modules/sei/windowTrabalhar/GerarProcessoRelacionado.ts" />
/// <reference path="modules/sei/windowTrabalhar/InserirAnexos.ts" />
/// <reference path="modules/sei/windowTrabalhar/InserirFormulario.ts" />
/// <reference path="modules/sei/windowTrabalhar/ProcedimentoAlterar.ts" />
/// <reference path="modules/sei/windowTrabalhar/ProcedimentoArvoreVisualizar.ts" />
/// <reference path="modules/sei/windowTrabalhar/ProcedimentoAtribuicaoCadastrar.ts" />
/// <reference path="modules/sei/windowTrabalhar/ProcedimentoAtualizarAndamento.ts" />
/// <reference path="modules/sei/windowTrabalhar/ProcedimentoEnviar.ts" />
/// <reference path="modules/sei/windowTrabalhar/ProcedimentoPaginar.ts" />
/// <reference path="modules/sei/windowTrabalhar/ProcedimentoRelacionar.ts" />
/// <reference path="modules/sei/windowTrabalhar/ProcedimentoTrabalharClassModel.ts" />
/// <reference path="modules/sei/windowTrabalhar/ProcedimentoVisualizar.ts" />
/// <reference path="Dados.ts" />


type pageKeys = 'main' | 'texto' | 'pdf' | 'json' | 'formularios' | 'processos';
declare class TomSelect extends _TomSelect { }

declare type TomSettings = _TomSettings;


declare namespace DefaultData {
    let credor: DadosEquiplanoPDF["credor"];
    let contratoAditivo: DadosEquiplanoPDF["contratoAditivo"]
    let licitacao: DadosEquiplanoPDF["licitacao"]
    let GET: ListaEntidades['GET'];
    let nomeAnexo: ListaEntidades['numeroAnexo'];
    let numeroAnexo: ListaEntidades['numeroAnexo'];
    let documentos: ListaEntidades['documentos'];
    let LINK: ListaEntidades['LINK'];
    let TABELA: ListaEntidades['TABELA'];
    let LINK_SEI: ListaEntidades['LINK_SEI'];
}


type ListUnidadesDeTrabalho = {
    "PML": "",
    "PML-EMPENHO": "",
    "PML-LIQUIDAÇÃO": "",
    "PML-PAGAMENTO": "",
    "PML-FISCAL DE CONTRATO": ""
    "PML-DEFESA SOCIAL": ""
}


interface TabelaCfg {
    nomesNaPrimeiraLinha?: boolean,
    styleTable?: string,
    cellBodyStyle?: { impar: string, par: string },
    cellFooterStyle?: string,
    cellHeadStyle?: string,
    nomeTotal?: string
}
interface ColunaCfg {
    chaveColuna: string;
    nomeColuna?: string;
    formato?: 'moeda' | 'numero' | 'texto';
    simboloMoeda?: string;
    casasDecimais?: number;
    cellBodyStyle?: { par: string, impar: string };
    cellHeadStyle?: string;
    cellFooterStyle?: string;
    resultadoDe?: string;
    criarTotal?: boolean;
    posicaoColuna?: number;//somente para coluna calculada
}


interface Link {
    acao: string,
    nomeVisivel: string,
    idProcedimento: string,
    idDocumento: string,
    idExternoDocumento: string,
    link: string,
    idAnexo: string,

}



interface Uint8Array {
    type: string,
    name: string
}

interface ListaEntidades extends Anexo {
    DOC_GERADO: DocSEI,
    DIA: string,
    ANO: string,
    HOJE_EXTENSO_MA: string,
    HOJE_EXTENSO_COM_SEMANA: string,
    HOJE_EXTENSO_COM_SEMANA_MA: string,
    HOJE_EXTENSO_COM_SEMANA_1MA: string,
    HOJE: string,
    HOJE_EXTENSO?: string,
    MES: string,
    MES_MA: string,
    MES_1MA: string,
    DIA_DA_SEMANA: string,
    DIA_DA_SEMANA_MA: string,
    DIA_DA_SEMANA_1MA: string,
    LISTA: string,
    LISTA_COM_MARCADORES?: string,
    LISTA_NUMERADA: string,
    LISTA_POR_EXTENSO_REDUZIDA: string,
    LISTA_POR_EXTENSO_COMPLETA: string,
    LISTA_POR_EXTENSO_REDUZIDA_SEM_LINK: string,
    LISTA_POR_EXTENSO_COMPLETA_SEM_LINK: string;
    LINK: string,
    ADD_S: string,
    ADD_s: string,
    anexos: Anexo[],
    documentos: DocSEI[],
    TABELA: (dados: {
        [key: string]: string;
    }[], tabelaCfg?: TabelaCfg, colunasCfg?: ColunaCfg[]) => string
    LINK_SEI: (numeroSEI: string) => string,
    LINK_SEI_RELACIONADO: (numeroSEI: string) => string
    GET: (numeroAnexo: string, nomeAnexo?: string | RegExp) => DocSEI;
    // CRIAR: (model: string, separador: string, filtrarListaSe: () => boolean) => string,
    // SOMA: (item: string, places: number, somarSe: string) => string,
    COUNT: number
    LISTA_MANUAL: string,
    textoPadrao: { [key: string]: string }
}

interface FutureReplaceEntity {
    id: string;
    strPromise: PromiseLike<string | FutureReplaceEntity>;
    toString(): string;
    clearList(): void;
    getPromises: () => Promise<string | FutureReplaceEntity>[]
}



type FormatFunction = (txt: string, obj: DadosEquiplanoPDF) => string

interface CoordenadaPdf {
    x1: number,
    x2: number,
    y1: number,
    y2: number,
}

interface DadosEquiplanoPDF extends Anexo, UnidadesDeTrabalho {
    desativado: boolean,
    nomeCoordenada: string,
    pdfContain?: string,
    numeroFormat?: FormatFunction,
    dataFormat?: FormatFunction,
    pdfPage?: number,
    documento?: {
        tipo?: string | CoordenadaPdf,
        previsao?: string | CoordenadaPdf,
        requisicaoN?: string | CoordenadaPdf,
        reqCompraN?: string | CoordenadaPdf,
        valor?: string | CoordenadaPdf,
        fonte?: string | CoordenadaPdf,
        fonteFormat?: FormatFunction,
        ano?: string | CoordenadaPdf,
        anoFormat?: FormatFunction,
        anoConcatSepatator?: '/',
        dotacao?: string | CoordenadaPdf,
        dotacaoFormat?: FormatFunction,

    },
    licitacao?: {
        tipo: string | CoordenadaPdf
        numero: string | CoordenadaPdf
    },
    contratoAditivo?: {
        sequencia?: string | CoordenadaPdf,
        contrato?: string | CoordenadaPdf,
        aditivo?: string | CoordenadaPdf,
        inicioDaVigencia?: string | CoordenadaPdf,
        fimDaVigencia?: string | CoordenadaPdf,
        fimdaVigAtualizada?: string | CoordenadaPdf,
        inicioDaExecucao?: string | CoordenadaPdf,
        fimDaExecucao?: string | CoordenadaPdf,
        fimDaExeAtualizada?: string | CoordenadaPdf
    },
    credor?: {
        fornecedor?: string | CoordenadaPdf,
        matricula?: string | CoordenadaPdf,
        CPFCNPJ?: string | CoordenadaPdf,
        endereco?: string | CoordenadaPdf,
        bairro?: string | CoordenadaPdf,
        cidadeUF?: string | CoordenadaPdf,
        CEP?: string | CoordenadaPdf,
        fone?: string | CoordenadaPdf,
        tipoDeContaBancaria?: string | CoordenadaPdf,
        banco?: string | CoordenadaPdf,
        agencia?: string | CoordenadaPdf,
        conta?: string | CoordenadaPdf
    }

}


interface DadosCodigo {
    cdCodigo: string,
    codigo: string,
    aliquota: string,
    descricao: string
}

interface DadosEmpresa {
    id_tomador: string,
    cnpj: string,
    cidade: string,
    razao: string,
    ccm: string,
    local: string,
    statusPrestador: string
}


type HandlerBackground = (request: BackGroundActions, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void;


declare class FileReaderSync {
    constructor();
    readAsArrayBuffer: (file: Blob | File) => ArrayBuffer;
    readAsBinaryString: (file: Blob | File) => String;
    readAsText: (file: Blob | File) => String;
    readAsDataURL: (file: Blob | File) => String;

}

interface EventTarget {
    files?: FileList
}

interface FileList {
    push: (file: File) => void
}



type PastaSEI = {
    pastaID: number,
    documentos: DocSEI[]
}
interface DocSEI extends Anexo {
    idAnexo?: string;
    numeroInternoDoDocumento: string,
    nomeCompletoSpan?: string
    checkBox: HTMLInputElement,
    span: HTMLSpanElement,
    copyLinkFull: string;
    LINK: string;
    LINK_EXTERNO: string;//link dentro de uma tag <a href="link">numeroDocumento</a>
    linkExterno?: string;//link raw https://....
    imgCopiar: HTMLImageElement,
    numeroDePesquisaSei: string,
    linkView: string,
    linkAnexo: string,
    linkAlterarDocumento: string,
    docNivelAcesso: NivelAcesso,
    assinado: boolean,
    eFormulario: boolean,
    estaCancelado:boolean
    
}

type Anexos = Anexo[];

interface Anexo {
    file?: FileList;
    fileName?: string;
    data: string;
    //remetentes: string[],// não implementado a inserção de remetentes
    interessados?: string[];
    //classificacaoPorAssuntos:string[];// não implementado a inserção de remetentes
    observacoes?: string;
    nivelAcesso: NivelAcesso;
    hipoteseLegal: Hipoteselegal;
    formato: FormatoDoArquivo;
    // ratificar: boolean;
    // nomeArquivo?: string;
    inserirAnexo: boolean,
    dadosIniciais?: boolean,
    nomeAnexo: string | string[]
    numeroAnexo: string,
    nomeCompleto?: string;
    atualizarJuntoComAExtensao: boolean,
}




interface WindowCKEDITOR extends Window {
    CKEDITOR: any;
}

interface Window {
    console: Console;
    eval(code: string): void | Object;
    objUpload: any
    inicializar: any
    objAjaxTipoProcedimentoSugestoes: any
    CKEDITOR: any;
    postMessage(message: { id: number, direction: string, msg: string }, targetOrigin: string, transfer?: Transferable[]): void;
}

interface FileList {
    append(file: File): void;
}


interface UnidadesDeTrabalho {
    unidadesDeTrabalho?: (keyof ListUnidadesDeTrabalho)[]
}


interface Param extends SubParam, UnidadesDeTrabalho {
    nomeParametro: string,
    desativado: boolean,
    lerArquivoComoTexto: boolean,
    outrosParametros?: SubParam[],
    exemploUtilizado: string
    dados: Pick<Anexo, 'atualizarJuntoComAExtensao' | 'nomeAnexo' | 'inserirAnexo' | 'nivelAcesso' | 'hipoteseLegal'>
}



interface SubParam {
    descricao: string,
    rx: string,
    flags: string,
    nomeLista?: string,
    nomeGrupo?: string,
}

interface KeyboardEvent {
    charCodeVal: number[];
}

interface Pdf {
    getPage(pageNumber: number): Promise<PdfPage>;
    numPages: number;
    _transport: {
        _fullReader: { _filename: string };
    }
}
interface PdfPage {
    getTextContent(): Promise<PdfTextContent>;
    _pageInfo: { view: number[] },
}

type PdfTextItens = PdfTextItem[];

type PdfTextItem = {
    dir: string,
    fontName: string,
    height: number,
    str: string,
    transform: number[],
    width: number
};

interface PdfTextContent {
    items: PdfTextItens;
    styles: {
        ascent: number,
        descent: number,
        fontFamily: string
    }[]

}



declare var pdfjsLib: {
    getDocument(arr: Uint8Array | string): any;
    GlobalWorkerOptions: { workerSrc: string }
};
interface FileList {
    append(file: File): void;
}

interface WindowTrabalhar extends Window {
    procedimentoTrabalhar: ProcedimentoTrabalhar;
    cfg: AppCfg;
}

interface WindowControlar extends Window {
    procedimentoControlar: ProcedimentoControlar;
    cfg: AppCfg;
}

interface WindowVisualizar extends Window {
    procedimentoVisualizar: ProcedimentoVisualizar;
}

interface WindowDocumentoReceber extends Window {
    objUpload: any;
    inicializar: Function;
    objAjaxTipoProcedimentoSugestoes: any;
}

declare interface AppCfg {
    versao_extensao?: string;
    sempre_mostrar_check_copy: boolean,
    mostrar_copy: boolean,
    manter_atualizado_procedimentos: boolean,
    testar_formulario: boolean,
    inserir_drop_zone: boolean,
    inserir_anexos: boolean,
    alterar_acesso_documento: boolean;
    copiar_link_externo: boolean;
    copiar_lista: boolean,
    copiar_lista_numerada: boolean,
    filtrar_processos: boolean,
    prazo_processos: boolean,

    formatarNumeroAnexoNumeros: boolean, //1250 --> 1.250
    formatarNumeroAnexoMesAno: boolean, // 08-2020 --> 08/2020
    formatarNumeroAnexoDiaMesAno: boolean, // 01-08-2020 --> 01/08/2020
    restritoSeEncontrarCPF: boolean// restrito (informações pessoais) se encontrar CPFCNPJ e for um cpf o valor ou se alguma entrada tiver o nome de cpf 

    meusTiposDeAnexos: Param[],
    anexosExistentes: string[],
    formulariosExistentes: string[],
    todosAnexosFormularios: string[],
    processosExistentes: string[],
    processosDisponiveis: string[],
    hipotesesExistentes: string[],
    formulariosConfig: FormularioConfig[],
    processosConfig: ProcessoConfig[],
    coordenadasPdf: DadosEquiplanoPDF[],
    textoPadrao: { [key: string]: string },
    formatacaoParagrafos: string[]

}
interface DialogTrabalharResult {
    formato: FormatoDoArquivo,
    hipoteselegal: Hipoteselegal,
}

type PosicaoParaInserir = 'antes' | 'apos' | 'substituir_texto' | 'substituir_paragrafo';
type Paragrafo = {
    estilo?: string,
    texto: string
}
type ProcurarInserirParagrafo = {
    textoParaProcurar: string | RegExp,
    novoEstilo?: string,
    remover?: boolean,
    posicaoParaInserir?: PosicaoParaInserir,
    paragrafos?: Paragrafo[]
}

interface FormularioConfig extends UnidadesDeTrabalho {
    nome: string,
    btnColor?: string,
    qntItensSelecionados: number,
    nivelAcesso: NivelAcesso,
    numeroModelo?: string,

    desativado: boolean,
    btnGerarFormulario: boolean,
    sempreMostarBtn: boolean,

    atualizarJuntoComAExtensao: boolean,

    nomeFormulario: string | string[],
    descricaoDoFormulario: string,
    observacoesDaUnidade: string,
    filtrarNomes?: string[],
    procurarInserirParagrafos?: ProcurarInserirParagrafo[],

}


interface ProcessoConfig extends UnidadesDeTrabalho {
    desativado: boolean,
    btnColor?: string,
    nome: string,
    formulario: string,
    gerarProcessoSei: boolean,
    salvarProcessoManualmente: boolean,
    btnGerarProcessoRelacionado: boolean,
    btnGerarProcessoRelacionadoSe?: string[],//processos que al selecioar aparece o btn
    btnAlterarProcesso: boolean,
    descricaoDoProcesso: string,
    tipoProcesso: string[],
    especificacao: string,
    observacoes?: string,
    interessados?: string[],
    nivelAcesso: NivelAcesso,
    hipoteselegal: Hipoteselegal,
    atualizarJuntoComAExtensao: boolean
}

type Hipoteselegal = "" | "manter" | "Público" | "Código de Saúde do Paraná (Lei Estadual Nº 13.331, de 23 de Novembro de 2001.)" |
    "Controle Interno (Art. 26, § 3º, da Lei nº 10.180/2001)" |
    "Documento Preparatório (Art. 7º, § 3º, da Lei nº 12.527/2011)" |
    "Informação Pessoal (Art. 31 da Lei nº 12.527/2011)" |
    "Investigação de Responsabilidade de Servidor (Art. 150 da Lei nº 8.112/1990)" |
    "Investigação de responsabilidade do servidor (Art. 205 , LEI Nº 4.928 de 17 de janeiro de 1992)" |
    "Princípio Constituc. Isonomia/Documento Preparat. (Art. 3º Lei 8.666/93 e Art. 77º, § 3º Lei12.527/11)" |
    "Regulamento Técnico - ANVISA (Portaria nº 344, de 12 de maio de 1998)" |
    "Resolução SESA - PR - Norma Técnica (Resolução SESA Nº 590/2014)" |
    "Sigilo Contábil (Art. 1.190 da Lei nº 10.406/2002)" |
    "Sigilo Empresarial (Art. 169 da Lei nº 11.101/2005)" |
    "Sigilo Fiscal (Art. 198, caput, da Lei nº 5.172/1966)" |
    "Ultrassecreto" |
    "Secreto" |
    "Reservado" | "";
type NivelAcesso = "público" | "restrito" | "sigiloso";
type FormatoDoArquivo = "manter" | "Nato-digital" | "Cópia Autenticada Administrativamente" | "Cópia Autenticada por Cartório" | "Cópia Simples" | "Documento Original";

// interface RecebimentoDoObjetoNotaFiscal {
//     numero: string,
//     docSei: DocSEI,
//     somenteLink: boolean
// }

interface BackGroundActions {
    getCfg?: boolean,
    setCfg?: { value: string },
    resetAll?: boolean,
    logBackGround?: boolean,
    loadPageConfig?: { pageKey: pageKeys }
}


type BackGroundResponses = string;

interface BackGroundEventInit {
    resolveId: string,
    direction: "from-content-script" | "from-background-script" | "from-page-script",
    msg?: any,
    action?: BackGroundActions
}



// funções genericas
// type Partial<T> = {
//     [P in keyof T]?: T[P];
// };
type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;


declare module bootstrap {
    class Modal {
        constructor(element, options: { backdrop?: boolean | string, keyboard?: boolean, focus?: boolean });
        show(): void;
        toggle(): void;
        hide(): void;
        handleUpdate(): void;
        dispose(): void;
    }
}


