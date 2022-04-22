class EscolherTipoDocumento extends ProcedimentoTrabalharClassModel {
    private links: Link[];

    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super(procedimentoTrabalhar);
        this.className = 'EscolherTipoDocumento';
    }

    async iniciar() {
        await super.iniciar();
    }

    async preLoad() {
        await this.carregarLinksFormularios();
        this.carregarHipotesesLegais();
    }

    async carregarLinksFormularios() {
        await this.procedimentoTrabalhar.procedimentoVisualizar.waitLoadWindow(10000);
        let link = await this.procedimentoTrabalhar.procedimentoVisualizar.getLink('documento_escolher_tipo');
        let request = await AnexosTools.getRequest(link.link, 'GET', 'document');
        let doc: Document = request.response;

        let imgMenos = <HTMLImageElement>doc.getElementById('imgExibirSeries');
        if (!imgMenos.src.match(/menos\.gif/)) {
            let form = doc.getElementById('frmDocumentoEscolherTipo');
            let formData = new FormData();
            for (let input of Array.from(form.getElementsByTagName('input'))) {
                if (input.id.match(/^hdn/)) {
                    if (input.id === 'hdnFiltroSerie') {
                        input.value = 'T';
                    }
                    formData.set(input.name, input.value);
                }
            }
            let r2 = await AnexosTools.getRequest(link.link, 'POST', 'document', formData);
            doc = r2.response;
        }
        this.links = AnexosTools.loadLinks(doc);
    }

    async carregarHipotesesLegais() {
        /**
         * Carregar hipoteses legais para restrito
         */
        let externo = await this.getLink(/^Externo$/, 'nomeVisivel');
        let r3 = await AnexosTools.getRequest(externo.link, 'GET', 'document');
        let doc3 = <Document>r3.response;

        let selSerie = <HTMLSelectElement>doc3.getElementById('selSerie');
        let anexosExistentes: string[] = [];
        let formulariosExistentes: string[] = [];

        Array.from(selSerie.options).forEach((o) => {
            if (o.innerText && o.innerText.length > 0)
                anexosExistentes.push(o.innerText);
        })
        this.links.forEach((o) => {
            if (o.nomeVisivel && o.nomeVisivel.length > 0)
                formulariosExistentes.push(o.nomeVisivel);
        });

        if (AnexosTools.getCfg().anexosExistentes.sort(AnexosTools.SORT_LETRAS_MENOR_PARA_MAIOR).toString() !== anexosExistentes.sort(AnexosTools.SORT_LETRAS_MENOR_PARA_MAIOR).toString()
            || AnexosTools.getCfg().formulariosExistentes.sort(AnexosTools.SORT_LETRAS_MENOR_PARA_MAIOR).toString() !== formulariosExistentes.sort(AnexosTools.SORT_LETRAS_MENOR_PARA_MAIOR).toString()) {
            AnexosTools.getCfg().anexosExistentes = anexosExistentes;
            AnexosTools.getCfg().formulariosExistentes = formulariosExistentes;
            await AnexosTools.saveCfg();
            this.procedimentoTrabalhar.procedimentoVisualizar.checarDocumentos();
        }


        let r3Html = doc3.head.innerHTML;
        let linkHipoteses = /(controlador_ajax\.php\?acao_ajax=hipotese_legal_select_nome_base_legal[^']+)/i.exec(r3Html)[1];
        let formData1 = new FormData();
        formData1.set('primeiroItemValor', 'null');
        formData1.set('primeiroItemDescricao', ' ');
        formData1.set('valorItemSelecionado', '');
        formData1.set('staNivelAcesso', '1');
        let r4 = await AnexosTools.getRequest(linkHipoteses, 'POST', 'blob', formData1);
        let fileReader = new FileReader();
        fileReader.readAsText(r4.response, 'iso-8859-1');
        fileReader.onload = async () => {
            let txt = <string>fileReader.result;
            let lines = txt.split('\n');

            let hipotesesExistentes: string[] = []
            let select = document.createElement('select');
            for (let line of lines) {
                if (line.match(/<option /) && !line.match(/value=\"null\"/)) {
                    select.insertAdjacentHTML('afterbegin', line);
                }
            }
            for (let index = 0; index < select.options.length; index++) {
                let op = select.options[index];
                op.value = op.innerText;
                op.selected = false;
                hipotesesExistentes.push(op.innerText);
            }
            //adicionar novas hipoteses;
            AnexosTools.updateHipoteses(hipotesesExistentes);
        };
    }


    private waitLink(): Promise<Link[]> {
        return new Promise<Link[]>((resolve, reject) => {
            let wait = () => {
                if (this.links) {
                    resolve(this.links);
                } else {
                    setTimeout(wait, 100);
                }
            }
            wait();
        })
    }

    async getLink(valor: RegExp | string, inValue: keyof Link) {
        let links = await this.waitLink();
        for (let link of links) {
            if (typeof valor === 'string') {
                if (link[inValue] && link[inValue].trim() === valor.trim()) {
                    return link;
                }
            } else {
                if (link[inValue] && link[inValue].trim().match(valor)) {
                    return link;
                }
            }
        }
        return null;
    }

    private postLinks() {

    }

    /**
     *  
     * @param nomeFormulario 
     */
    abrirFormularioSemCarregarTela(nomeFormulario: string | RegExp) {
        return new Promise<boolean>(async (resolve, reject) => {
            let link = await this.getLink(nomeFormulario, 'nomeVisivel');
            let frameArvore = <HTMLIFrameElement>this.procedimentoTrabalhar.document.getElementById('ifrVisualizacao');
            frameArvore.addEventListener('load', () => {
                resolve(true);
            })
            frameArvore.contentWindow.document.location.href = link.link;
        })

    }

    private async escolherFormulario(nomeFormulario: string) {
        await this.waitLoadWindow();
        let link = await this.getLink(nomeFormulario, 'nomeVisivel');
        let a = this.document.createElement('a');
        a.href = link.link;
        this.document.body.append(a);
        a.click();
    }
}
