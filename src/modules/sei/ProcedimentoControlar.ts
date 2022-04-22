class ProcedimentoControlar extends AbstractSubClassEngine {
    procedimentoTrabalhar: ProcedimentoTrabalhar;
    procedimentoEscolherTipo: ProcedimentoEscolherTipo;
    procedimentoGerar: ProcedimentoGerar;
    procedimentoGerarProcessoSEI: ProcedimentoGerarProcessoSEI;
    constructor(window: Window) {
        super();
        this.className = 'ProcedimentoControlar';
        this.procedimentoTrabalhar = null;
        this.window = window;
        this.document = window.document;
        this.procedimentoEscolherTipo = new ProcedimentoEscolherTipo();
        this.procedimentoGerar = new ProcedimentoGerar();
        this.procedimentoGerarProcessoSEI = new ProcedimentoGerarProcessoSEI(this);
    }
    setProcedimentoTrabalhar(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        this.procedimentoTrabalhar = procedimentoTrabalhar;
    }
    waitLoadProcedimentoTrabalhar(timeOut: number = 100000) {
        return new Promise<ProcedimentoTrabalhar>((resolve) => {
            let f = (timeOut: number) => {
                if (this.procedimentoTrabalhar != null) {
                    timeOut = 0;
                    resolve(this.procedimentoTrabalhar);
                }
                else {
                    if (timeOut > 0) {
                        timeOut = timeOut - 100;
                        setTimeout(() => f(timeOut), 100);
                    }
                    else {
                        resolve(null);
                    }
                }
            };
            f(timeOut);
        });
    }
    private async loadFiltrarProcessos() {
        if (AnexosTools.getCfg().filtrar_processos) {
            this.loadAllPages();
            if (!this.querySelector('#ocultarProcessos')) {
                let lnkInfraChecks = this.querySelectorAll('#lnkInfraCheck');
                for (let item of lnkInfraChecks) {
                    let tabela = '';
                    item.outerHTML.match('Gerados') ? tabela = 'tblProcessosGerados' : tabela = 'tblProcessosRecebidos';
                    item.removeAttribute('onclick');
                    item.removeAttribute('href');
                    item.onclick = () => {
                        let img = item.querySelector('img');
                        if (this.isChecked(tabela)) {
                            img.title = 'Selecionar Tudo';
                            img.alt = 'Selecionar Tudo';
                            this.checkAll(tabela, false);
                        } else {
                            img.title = 'Remover Seleção';
                            img.alt = 'Remover Seleção';
                            this.checkAll(tabela, true);
                        }
                    };
                }
                let divFiltro = this.document.getElementById('divFiltro');
                let divUiContend = this.document.createElement('div');
                divUiContend.className = 'ui-dialog ui-widget ui-widget-content ui-corner-all ui-front ui-dialog-buttons ui-draggable ui-resizable';
                divUiContend.insertAdjacentHTML('afterbegin', `
                <div style="width: 100%;">
                    <div style="width: 50%;float: left;">
                        <label for="filtrarProcessos">Filtrar Processos: </label>&nbsp;&nbsp;
                        <input type="checkbox" id="filtroDeveConterTodasInformacoes"> &nbsp;&nbsp;
                        <label for="filtroDeveConterTodasInformacoes">Corresponder a todos itens da lista</label>
                        <br>
                        <textarea style="width: 95%; max-width: 95%;min-width: 95%;min-height: 16px;font-size: 10pt;font-family: Arial, Helvetica, sans-serif;" name="filtrarProcessos" id="filtrarProcessos" cols="30" rows="1" placeholder="19.028\n19.003\nnúmero do SEI\nnome do interessado/fornecedor\ninformações das anotações\ninformações dos marcadores\n... separar por paragrafos quando inserir diversos critérios de pesquisa\nobs. necessário inserir 3 ou mais caracteres por paragrafo para que a pesquisa seja realizada"></textarea>        
                    </div>
                    <div style="width: 50%;float: right;">
                        <label for="ocultarProcessos">Ocultar Processos: </label>
                        <input type="checkbox" id="ocultarDeveConterTodasInformacoes"> &nbsp;&nbsp;
                        <label for="ocultarDeveConterTodasInformacoes">Corresponder a todos itens da lista</label>                        
                        <br>
                        <textarea style="width: 95%; max-width: 95%;min-width: 95%;min-height: 16px;font-size: 10pt;font-family: Arial, Helvetica, sans-serif;" name="ocultarProcessos" id="ocultarProcessos" cols="30" rows="1" placeholder="19.028\n19.003\nnúmero do SEI\nnome do interessado/fornecedor\ninformações das anotações\ninformações dos marcadores\n... separar por paragrafos quando inserir diversos critérios de pesquisa\nobs. necessário inserir 3 ou mais caracteres por paragrafo para que a pesquisa seja realizada"></textarea>
                    </div>
                </div>
                `);
                divFiltro.before(divUiContend);
                let filtrarProcessos = <HTMLInputElement><unknown>divUiContend.querySelector('#filtrarProcessos');
                let ocultarProcessos = <HTMLInputElement><unknown>divUiContend.querySelector('#ocultarProcessos');
                filtrarProcessos.addEventListener('keyup', () => {
                    this.tableSearch(filtrarProcessos.value, ocultarProcessos.value);
                });
                ocultarProcessos.addEventListener('keyup', () => {
                    this.tableSearch(filtrarProcessos.value, ocultarProcessos.value);
                });
                let filtroDeveConterTodasInformacoes = <HTMLInputElement>this.document.getElementById('filtroDeveConterTodasInformacoes');
                let ocultarDeveConterTodasInformacoes = <HTMLInputElement>this.document.getElementById('ocultarDeveConterTodasInformacoes');
                filtroDeveConterTodasInformacoes.addEventListener('change', () => {
                    this.tableSearch(filtrarProcessos.value, ocultarProcessos.value);
                });
                ocultarDeveConterTodasInformacoes.addEventListener('change', () => {
                    this.tableSearch(filtrarProcessos.value, ocultarProcessos.value);
                });

                this.tableSearch(filtrarProcessos.value, ocultarProcessos.value);
            }
        }

        if (AnexosTools.getCfg().prazo_processos) {
            this.customizeTable();
        }


    }
    async iniciar() {
        AnexosTools.desfocarDados(this.window);
        await super.iniciar();
        pdfjsLib.GlobalWorkerOptions.workerSrc = this.document.scripts.namedItem('lib/pdf.worker.js').src;
        await this.loadFiltrarProcessos();
        this.procedimentoGerarProcessoSEI.iniciar();
        this.startDialogIniciarProcesso();
        this.carregarDados();

    }

    private async carregarDados() {
        let r = await AnexosTools.getRequest('https://' + this.document.location.host + '/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0', 'GET', 'document');
        let doc = <Document>r.response;
        console.log(doc);
        if (doc) {
            let save = false;
            let selTipoProcedimentoPesquisaOptions = Array.from(doc.querySelectorAll<HTMLOptionElement>('#selTipoProcedimentoPesquisa>option'));
            if (selTipoProcedimentoPesquisaOptions.length > 0) {
                let processosExistentes: string[] = selTipoProcedimentoPesquisaOptions.reduce((p, cur, arr) => {
                    if (cur.innerText.replace(/[  ]/g, '').length > 0)
                        p.push(cur.innerText);
                    return p;
                }, <string[]>[]);
                AnexosTools.getCfg().processosExistentes = processosExistentes;
                save = true;
            }
            let selSeriePesquisaOptions = Array.from(doc.querySelectorAll<HTMLOptionElement>('#selSeriePesquisa>option'));
            if (selSeriePesquisaOptions.length > 0) {
                let todosAnexosFormularios: string[] = selSeriePesquisaOptions.reduce((p, cur, arr) => {
                    if (cur.innerText.replace(/[  ]/g, '').length > 0)
                        p.push(cur.innerText);
                    return p;
                }, <string[]>[]);
                AnexosTools.getCfg().todosAnexosFormularios = todosAnexosFormularios;
                save = true;

            }
            if (save) AnexosTools.saveCfg();
        } else {

        }

    }
    private isChecked(tabela: string) {
        let trs = this.querySelectorAll('#' + tabela + ' tr');
        for (let tr of trs) {
            if (tr.outerHTML.toLowerCase().indexOf('titulocontrole') == -1) {
                if (!tr.hidden) {
                    let check = <HTMLInputElement><unknown>tr.querySelector('[id^="chk"]');
                    if (check.checked == false) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    private checkAll(tabela: string, checked: boolean) {
        let trs = this.querySelectorAll('#' + tabela + ' tr');
        for (let tr of trs) {
            if (tr.outerHTML.toLowerCase().indexOf('titulocontrole') == -1) {
                if (!tr.hidden) {
                    let check = <HTMLInputElement><unknown>tr.querySelector('[id^="chk"]');
                    if (checked != check.checked) {
                        check.click();
                    }
                }
            }
        }
    }

    private customizeTable() {
        let trsRecebidos = this.querySelectorAll<HTMLTableRowElement[]>('#tblProcessosRecebidos tr');
        let cabecalhoRecebidos = trsRecebidos.shift();
        let trsGerados = this.querySelectorAll<HTMLTableRowElement[]>('#tblProcessosGerados tr');
        let cabecalhoGerados = trsGerados.shift();

        let thCabecalhoRecebidos = this.document.createElement('th');
        thCabecalhoRecebidos.classList.add('tituloControle')
        thCabecalhoRecebidos.id = '__cabecalhoPrazo';
        thCabecalhoRecebidos.style.textAlign = "center";

        let thCabecalhoGerados = <HTMLTableCellElement>thCabecalhoRecebidos.cloneNode(true);
        if (cabecalhoRecebidos && !cabecalhoRecebidos.querySelector('#__cabecalhoPrazo')) {
            cabecalhoRecebidos.append(thCabecalhoRecebidos);
        }
        if (cabecalhoGerados && !cabecalhoGerados.querySelector('#__cabecalhoPrazo')) {
            cabecalhoGerados.append(thCabecalhoGerados);
        }


        let srcOriginal = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4KCjxzdmcKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iQ2FwYV8xIgogICB4PSIwcHgiCiAgIHk9IjBweCIKICAgd2lkdGg9IjUxMS42MjcwMSIKICAgaGVpZ2h0PSI1MTEuNjI3MDEiCiAgIHZpZXdCb3g9IjAgMCA1MTEuNjI3IDUxMS42MjciCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgIHNvZGlwb2RpOmRvY25hbWU9InNvcnQxLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4xLjEgKDNiZjVhZTBkMjUsIDIwMjEtMDktMjApIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzCiAgIGlkPSJkZWZzMTA1Ij4KCQoKCQkKCQkKCQkKCQkKCQkKCTwvZGVmcz48c29kaXBvZGk6bmFtZWR2aWV3CiAgIGlkPSJuYW1lZHZpZXcxMDMiCiAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgc2hvd2dyaWQ9ImZhbHNlIgogICBpbmtzY2FwZTp6b29tPSIwLjc5MDYxNTAyIgogICBpbmtzY2FwZTpjeD0iLTEzLjkxMzIxOSIKICAgaW5rc2NhcGU6Y3k9IjIzMi4wOTc3OSIKICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDE3IgogICBpbmtzY2FwZTp3aW5kb3cteD0iLTgiCiAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iQ2FwYV8xIgogICBpbmtzY2FwZTpzbmFwLWdsb2JhbD0idHJ1ZSIgLz4KPGcKICAgaWQ9ImczNjIiCiAgIHRyYW5zZm9ybT0icm90YXRlKDE4MCwyNzUuMjEwOTYsMjU1LjgxMSkiCiAgIHN0eWxlPSJmaWxsOiMxYTFhMWEiPjxwYXRoCiAgICAgZD0iTSAzMDIuNTQsNDAxLjk5MSBIIDI0Ny43MjMgViA5LjEzNiBjIDAsLTIuNjYzIC0wLjg1NCwtNC44NTYgLTIuNTY4LC02LjU2NyBDIDI0My40NDEsMC44NTkgMjQxLjI1NCwwIDIzOC41ODcsMCBoIC01NC44MTggYyAtMi42NjMsMCAtNC44NTYsMC44NTUgLTYuNTY3LDIuNTY4IC0xLjcwOSwxLjcxNSAtMi41NjgsMy45MDUgLTIuNTY4LDYuNTY3IFYgNDAxLjk5IGggLTU0LjgxOCBjIC00LjE4NCwwIC03LjA0LDEuOTAyIC04LjU2NCw1LjcwOCAtMS41MjUsMy42MjEgLTAuODU1LDYuOTUgMS45OTcsOS45OTYgbCA5MS4zNjEsOTEuMzY1IGMgMi4wOTQsMS43MDcgNC4yODEsMi41NjIgNi41NjcsMi41NjIgMi40NzQsMCA0LjY2NSwtMC44NTUgNi41NjcsLTIuNTYyIGwgOTEuMDc2LC05MS4wNzggYyAxLjkwNiwtMi4yNzkgMi44NTYsLTQuNTcxIDIuODU2LC02Ljg0NCAwLC0yLjY3NiAtMC44NTksLTQuODU5IC0yLjU2OCwtNi41ODQgLTEuNzEzLC0xLjcwNiAtMy45LC0yLjU2MiAtNi41NjgsLTIuNTYyIHoiCiAgICAgaWQ9InBhdGg2MiIKICAgICBzdHlsZT0iZmlsbDojMWExYTFhIiAvPjxwYXRoCiAgICAgZD0ibSA0NjkuNjI5LDEwOS42MzEwMSBoIC01NC44MTcgdiAzOTIuODU1IGMgMCwyLjY2MyAtMC44NTQsNC44NTYgLTIuNTY4LDYuNTY3IC0xLjcxNCwxLjcxIC0zLjkwMSwyLjU2OSAtNi41NjgsMi41NjkgaCAtNTQuODE4IGMgLTIuNjYzLDAgLTQuODU2LC0wLjg1NSAtNi41NjcsLTIuNTY4IC0xLjcwOSwtMS43MTUgLTIuNTY4LC0zLjkwNSAtMi41NjgsLTYuNTY3IFYgMTA5LjYzMjAyIGggLTU0LjgxOCBjIC00LjE4NCwwIC03LjA0LC0xLjkwMiAtOC41NjQsLTUuNzA4MDEgLTEuNTI1LC0zLjYyMDk5IC0wLjg1NSwtNi45NDk5OTUgMS45OTcsLTkuOTk1OTk1IGwgOTEuMzYxLC05MS4zNjUgYyAyLjA5NCwtMS43MDcgNC4yODEsLTIuNTYyMDEgNi41NjcsLTIuNTYyMDEgMi40NzQsMCA0LjY2NSwwLjg1NTAxIDYuNTY3LDIuNTYyMDEgbCA5MS4wNzYsOTEuMDc4IGMgMS45MDYsMi4yNzkgMi44NTYsNC41NzEgMi44NTYsNi44NDQwMDUgMCwyLjY3NiAtMC44NTksNC44NTkgLTIuNTY4LDYuNTg0IC0xLjcxMywxLjcwNiAtMy45LDIuNTYyIC02LjU2OCwyLjU2MTk5IHoiCiAgICAgaWQ9InBhdGg2Mi0zIgogICAgIHN0eWxlPSJmaWxsOiMxYTFhMWEiIC8+PC9nPgo8ZwogICBpZD0iZzcyIj4KPC9nPgo8ZwogICBpZD0iZzc0Ij4KPC9nPgo8ZwogICBpZD0iZzc2Ij4KPC9nPgo8ZwogICBpZD0iZzc4Ij4KPC9nPgo8ZwogICBpZD0iZzgwIj4KPC9nPgo8ZwogICBpZD0iZzgyIj4KPC9nPgo8ZwogICBpZD0iZzg0Ij4KPC9nPgo8ZwogICBpZD0iZzg2Ij4KPC9nPgo8ZwogICBpZD0iZzg4Ij4KPC9nPgo8ZwogICBpZD0iZzkwIj4KPC9nPgo8ZwogICBpZD0iZzkyIj4KPC9nPgo8ZwogICBpZD0iZzk0Ij4KPC9nPgo8ZwogICBpZD0iZzk2Ij4KPC9nPgo8ZwogICBpZD0iZzk4Ij4KPC9nPgo8ZwogICBpZD0iZzEwMCI+CjwvZz4KPC9zdmc+Cg==';
        let srcOrdenado = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4KCjxzdmcKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iQ2FwYV8xIgogICB4PSIwcHgiCiAgIHk9IjBweCIKICAgd2lkdGg9IjUxMS42MjdweCIKICAgaGVpZ2h0PSI1MTEuNjI3cHgiCiAgIHZpZXdCb3g9IjAgMCA1MTEuNjI3IDUxMS42MjciCiAgIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMS42MjcgNTExLjYyNzsiCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgIHNvZGlwb2RpOmRvY25hbWU9InNvcnQuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjEuMSAoM2JmNWFlMGQyNSwgMjAyMS0wOS0yMCkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnMKICAgaWQ9ImRlZnMxMDUiPgoJCgoJCQoJCQoJCQoJCQoJCQoJPC9kZWZzPjxzb2RpcG9kaTpuYW1lZHZpZXcKICAgaWQ9Im5hbWVkdmlldzEwMyIKICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICBzaG93Z3JpZD0iZmFsc2UiCiAgIGlua3NjYXBlOnpvb209IjAuNzkwNjE1MDIiCiAgIGlua3NjYXBlOmN4PSI0MTIuOTY5NjQiCiAgIGlua3NjYXBlOmN5PSIyMzIuMDk3NzkiCiAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAxNyIKICAgaW5rc2NhcGU6d2luZG93LXg9Ii04IgogICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkNhcGFfMSIgLz4KPGcKICAgaWQ9ImcyMDMiPjxwYXRoCiAgICAgZD0ibSAyNTcuMTc0MTksMjE5LjI3MSBoIDgxLjQyMjc5IGMgMS42OTcxMywwIDMuMDkwNjEsLTAuODU1IDQuMTc3ODksLTIuNTcgMS4wOTE3NSwtMS43MTMgMS42Mzc5MywtMy45IDEuNjM3OTMsLTYuNTY3IHYgLTU0LjgxNiBjIDAsLTIuNjY3IC0wLjU0NjE4LC00Ljg1NCAtMS42Mzc5MywtNi41NjcgLTEuMDg3MjgsLTEuNzExIC0yLjQ4MDc2LC0yLjU3IC00LjE3Nzg5LC0yLjU3IGggLTgxLjQyMjc5IGMgLTEuNjk3MTMsMCAtMy4wODkzNCwwLjg1NSAtNC4xODA0NCwyLjU3IC0xLjA4ODU2LDEuNzEzIC0xLjYzNDc1LDMuOSAtMS42MzQ3NSw2LjU2NyB2IDU0LjgxNiBjIDAsMi42NjcgMC41NDQyOCw0Ljg1NCAxLjYzNDc1LDYuNTY3IDEuMDkxMSwxLjcxMiAyLjQ4MzMxLDIuNTcgNC4xODA0NCwyLjU3IHoiCiAgICAgaWQ9InBhdGg1OCIKICAgICBzdHlsZT0ic3Ryb2tlLXdpZHRoOjAuNzk3ODYyIiAvPjxwYXRoCiAgICAgZD0ibSAyNTUuNDYyNzgsNzMuMDg5IGggMzIuODA5NDIgYyAxLjE5Njc4LDAgMi4xNzk5LC0wLjg1NSAyLjk0NjE4LC0yLjU2OCAwLjc3MTIzLC0xLjcxNCAxLjE1MDU2LC0zLjkwMSAxLjE1MDU2LC02LjU2NyBWIDkuMTM2IGMgMCwtMi42NjMgLTAuMzc5NzgsLTQuODUzIC0xLjE1MDU2LC02LjU2NyBDIDI5MC40NTIxLDAuODU5IDI4OS40Njg5OCwwIDI4OC4yNzIyLDAgaCAtMzIuODA5NDIgYyAtMS4xOTY3OCwwIC0yLjE3ODU1LDAuODU1IC0yLjk0Nzk4LDIuNTY4IC0wLjc2NzE5LDEuNzE1IC0xLjE1MjgsMy45MDUgLTEuMTUyOCw2LjU2NyB2IDU0LjgxOCBjIDAsMi42NjYgMC4zODM4Miw0Ljg1MyAxLjE1MjgsNi41NjcgMC43Njk4OCwxLjcxIDEuNzUxMiwyLjU2OSAyLjk0Nzk4LDIuNTY5IHoiCiAgICAgaWQ9InBhdGg2MCIKICAgICBzdHlsZT0ic3Ryb2tlLXdpZHRoOjAuNjcwMDA3IiAvPjxwYXRoCiAgICAgZD0iTSAxOTYuNTQsNDAxLjk5MSBIIDE0MS43MjMgViA5LjEzNiBjIDAsLTIuNjYzIC0wLjg1NCwtNC44NTYgLTIuNTY4LC02LjU2NyBDIDEzNy40NDEsMC44NTkgMTM1LjI1NCwwIDEzMi41ODcsMCBIIDc3Ljc2OSBDIDc1LjEwNiwwIDcyLjkxMywwLjg1NSA3MS4yMDIsMi41NjggNjkuNDkzLDQuMjgzIDY4LjYzNCw2LjQ3MyA2OC42MzQsOS4xMzUgViA0MDEuOTkgSCAxMy44MTYgYyAtNC4xODQsMCAtNy4wNCwxLjkwMiAtOC41NjQsNS43MDggLTEuNTI1LDMuNjIxIC0wLjg1NSw2Ljk1IDEuOTk3LDkuOTk2IGwgOTEuMzYxLDkxLjM2NSBjIDIuMDk0LDEuNzA3IDQuMjgxLDIuNTYyIDYuNTY3LDIuNTYyIDIuNDc0LDAgNC42NjUsLTAuODU1IDYuNTY3LC0yLjU2MiBsIDkxLjA3NiwtOTEuMDc4IGMgMS45MDYsLTIuMjc5IDIuODU2LC00LjU3MSAyLjg1NiwtNi44NDQgMCwtMi42NzYgLTAuODU5LC00Ljg1OSAtMi41NjgsLTYuNTg0IC0xLjcxMywtMS43MDYgLTMuOSwtMi41NjIgLTYuNTY4LC0yLjU2MiB6IgogICAgIGlkPSJwYXRoNjIiIC8+PHBhdGgKICAgICBkPSJtIDUwNC42MDQsNDQxLjEwOSBjIC0xLjcxNSwtMS43MTggLTMuOTAxLC0yLjU3MyAtNi41NjcsLTIuNTczIGggLTIzNy41NCBjIC0yLjY2NiwwIC00Ljg1MywwLjg1NSAtNi41NjcsMi41NzMgLTEuNzA5LDEuNzExIC0yLjU2OCwzLjkwMSAtMi41NjgsNi41NjQgdiA1NC44MTUgYyAwLDIuNjczIDAuODU1LDQuODUzIDIuNTY4LDYuNTcxIDEuNzE1LDEuNzExIDMuOTAxLDIuNTY2IDYuNTY3LDIuNTY2IGggMjM3LjUzOSBjIDIuNjY2LDAgNC44NTMsLTAuODU1IDYuNTY3LC0yLjU2NiAxLjcxMSwtMS43MTkgMi41NjYsLTMuODk4IDIuNTY2LC02LjU3MSB2IC01NC44MTUgYyAwLjAwNCwtMi42NjIgLTAuODU1LC00Ljg1MyAtMi41NjUsLTYuNTY0IHoiCiAgICAgaWQ9InBhdGg2NCIgLz48cGF0aAogICAgIGQ9Im0gMjU5LjQ5MjQ4LDM2NS40NDUgaCAxNjIuNjkyNjUgYyAyLjM3MTA1LDAgNC4zMjA5NCwtMC44NTUgNS44NDk2OSwtMi41NjYgMS41MjA3NSwtMS43MTEgMi4yODIsLTMuOTAxIDIuMjgyLC02LjU2MyB2IC01NC44MjMgYyAwLC0yLjY2MiAtMC43NjEyNSwtNC44NTMgLTIuMjgyLC02LjU2MyAtMS41Mjk2NCwtMS43MTEgLTMuNDc4NjQsLTIuNTY2IC01Ljg0OTY5LC0yLjU2NiBIIDI1OS40OTI0OCBjIC0yLjM3MzcxLDAgLTQuMzIwOTUsMC44NTUgLTUuODQ3MDMsMi41NjYgLTEuNTIyNTIsMS43MTEgLTIuMjg2NDUsMy45MDEgLTIuMjg2NDUsNi41NjMgdiA1NC44MjMgYyAwLDIuNjYyIDAuNzYxMjcsNC44NTMgMi4yODY0NSw2LjU2MyAxLjUyNjA4LDEuNzExIDMuNDczMzIsMi41NjYgNS44NDcwMywyLjU2NiB6IgogICAgIGlkPSJwYXRoNjYiCiAgICAgc3R5bGU9InN0cm9rZS13aWR0aDowLjk0MzU5IiAvPjwvZz4KPGcKICAgaWQ9Imc3MiI+CjwvZz4KPGcKICAgaWQ9Imc3NCI+CjwvZz4KPGcKICAgaWQ9Imc3NiI+CjwvZz4KPGcKICAgaWQ9Imc3OCI+CjwvZz4KPGcKICAgaWQ9Imc4MCI+CjwvZz4KPGcKICAgaWQ9Imc4MiI+CjwvZz4KPGcKICAgaWQ9Imc4NCI+CjwvZz4KPGcKICAgaWQ9Imc4NiI+CjwvZz4KPGcKICAgaWQ9Imc4OCI+CjwvZz4KPGcKICAgaWQ9Imc5MCI+CjwvZz4KPGcKICAgaWQ9Imc5MiI+CjwvZz4KPGcKICAgaWQ9Imc5NCI+CjwvZz4KPGcKICAgaWQ9Imc5NiI+CjwvZz4KPGcKICAgaWQ9Imc5OCI+CjwvZz4KPGcKICAgaWQ9ImcxMDAiPgo8L2c+Cjwvc3ZnPgo=';
        let icoRecebidos = this.document.createElement('img');
        icoRecebidos.className = "infraImg";
        icoRecebidos.src = srcOriginal;
        let icoGerados = <HTMLImageElement>icoRecebidos.cloneNode(true);
        thCabecalhoRecebidos.append(icoRecebidos, "Prazo");
        thCabecalhoGerados.append(icoGerados, "Prazo");


        let recebidosOriginalOrder = true;
        let geradosOriginalOrder = true;
        let clickGeradoRecebido = (originalOrder: boolean, cabecalho: HTMLTableRowElement, trs: HTMLTableRowElement[], ico: HTMLImageElement) => {
            if (originalOrder) {
                trs = trs.sort((a, b) => {
                    return parseInt(a.querySelector('#__prazo').getAttribute('prazo-order')) - parseInt(b.querySelector('#__prazo').getAttribute('prazo-order'))
                })
                ico.src = srcOrdenado;
                originalOrder = false;
            } else {
                trs = trs.sort((a, b) => {
                    return parseInt(a.querySelector('#__prazo').getAttribute('original-order')) - parseInt(b.querySelector('#__prazo').getAttribute('original-order'))

                })
                ico.src = srcOriginal;
                originalOrder = true;
            }
            trs.forEach((tr) => {
                cabecalho.parentElement.insertAdjacentElement('beforeend', tr);
            })

            return originalOrder;

        }

        thCabecalhoRecebidos.onclick = () => {
            recebidosOriginalOrder = clickGeradoRecebido(recebidosOriginalOrder, cabecalhoRecebidos, trsRecebidos, icoRecebidos);
        };

        thCabecalhoGerados.onclick = () => {
            geradosOriginalOrder = clickGeradoRecebido(geradosOriginalOrder, cabecalhoGerados, trsGerados, icoGerados);
        };

        let tdPrazo = this.document.createElement('td');
        tdPrazo.id = '__prazo';
        tdPrazo.style.textAlign = "center";
        let addPrazo = (tr: HTMLTableRowElement, index: number) => {
            if (!tr.querySelector('#__prazo')) {
                let _tdPrazo = <HTMLTableCellElement>tdPrazo.cloneNode(true);
                _tdPrazo.setAttribute('original-order', index.toString());
                _tdPrazo.setAttribute('prazo-order', '999999');
                tr.append(_tdPrazo);
                let _curMatch = tr.outerHTML.match(/(Intercorrente: )?(?:(?:prazo|at[éeÉE])[ :]*)(\d{2}\/\d{2}\/\d{4})/i) || tr.outerHTML.match(/(Intercorrente: )?(\d{2}\/\d{2}\/\d{4})/i);
                if (_curMatch && !_curMatch[1]) {
                    let parts = _curMatch[2].split("/");
                    let today = new Date();
                    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    let date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                    let diff = date.getTime() - today.getTime();
                    let days = (diff / 86400000);
                    _tdPrazo.innerText = days.toString();
                    _tdPrazo.setAttribute('prazo-order', days.toString());
                    if (diff < 0) {
                        tr.classList.remove('infraTrAcessada');
                        tr.style.backgroundImage = 'radial-gradient(white, white, red)';
                    }
                    if (days >= 0 && days <= 3) {
                        tr.classList.remove('infraTrAcessada');
                        tr.style.backgroundImage = 'radial-gradient(white, white, #ffc107)';
                    }
                }
            }
        }
        trsRecebidos.forEach((tr, index) => {
            addPrazo(tr, index);
        });
        trsGerados.forEach((tr, index) => {
            addPrazo(tr, index);
        });

    }
    private tableSearch(txtFiltrar: string, txtOcultar: string) {
        let trs = this.querySelectorAll('#tblProcessosRecebidos tr[id^="P"],#tblProcessosGerados tr[id^="P"]');
        let _parametrosFiltrar = txtFiltrar.toLocaleLowerCase('pt-BR').split('\n').filter(str => { return str.length >= 1; });
        let _parametrosOcultar = txtOcultar.toLocaleLowerCase('pt-BR').split('\n').filter(str => { return str.length >= 1; });

        let filtroDeveConterTodasInformacoes = (<HTMLInputElement>this.document.getElementById('filtroDeveConterTodasInformacoes')).checked;
        let ocultarDeveConterTodasInformacoes = (<HTMLInputElement>this.document.getElementById('ocultarDeveConterTodasInformacoes')).checked;
        // necessário passar pelo loop para pelo menos voltar as informações iniciais
        for (let tr of trs) {
            tr.hidden = false;//inicializar, mostrar todos, estado natural
            // montar texto para pesquisa
            let txt = '';
            //capturar informações das anotações
            let matchs = Array.from(tr.outerHTML.matchAll(/infraTooltipMostrar[(]'([^']*)','([^']*)'[)]/gi));
            matchs.forEach(match => {
                txt += ((match[1].toLocaleLowerCase('pt-BR'))) + ' ' + ((match[2].toLocaleLowerCase('pt-BR'))) + '\n';
            });
            txt += '\n' + tr.innerText.toLocaleLowerCase('pt-BR');
            // função filtrar ativada, ocultar todos itens
            if (_parametrosFiltrar.length > 0) {
                tr.hidden = true;
                let matchsFiltro = _parametrosFiltrar.filter(_txtPesquisa => {
                    return txt.indexOf(_txtPesquisa) > -1;
                });
                if (!filtroDeveConterTodasInformacoes) {
                    if (matchsFiltro.length > 0) {
                        tr.hidden = false;
                    }
                } else {
                    if (matchsFiltro.length === _parametrosFiltrar.length) {
                        tr.hidden = false;
                    }
                }
            }
            // função ocultar informação ativada
            if (_parametrosOcultar.length > 0) {
                let matchsOcultar = _parametrosOcultar.filter(_txtOcultar => {
                    return txt.indexOf(_txtOcultar) > -1;
                });
                if (!ocultarDeveConterTodasInformacoes) {
                    if (matchsOcultar.length > 0) {
                        tr.hidden = true;
                    }
                } else {
                    if (matchsOcultar.length === _parametrosOcultar.length) {
                        tr.hidden = true;
                    }
                }
            }
        }

        let countTableRecebidos = this.querySelectorAll('#tblProcessosRecebidos tr').filter((a: HTMLTableRowElement) => { return !a.hidden }).length - 1;
        let captionRecebidos = this.querySelector('#tblProcessosRecebidos>caption');
        let captionGerados = this.querySelector('#tblProcessosGerados>caption');
        let countTableGerados = this.querySelectorAll('#tblProcessosGerados tr').filter((a: HTMLTableRowElement) => { return !a.hidden }).length - 1;
        if (captionRecebidos) captionRecebidos.innerText = countTableRecebidos + ' registro' + (countTableRecebidos > 1 ? 's' : '') + ':';
        if (captionGerados) captionGerados.innerText = countTableGerados + ' registro' + (countTableGerados > 1 ? 's' : '') + ':';


    }

    private async loadAllPages() {
        let tblProcessosRecebidos = this.document.getElementById('tblProcessosRecebidos');
        let tblProcessosGerados = this.document.getElementById('tblProcessosGerados');
        let hdnRecebidosPaginaAtual = <HTMLInputElement>this.document.getElementById('hdnRecebidosPaginaAtual');
        let hdnGeradosPaginaAtual = <HTMLInputElement>this.document.getElementById('hdnGeradosPaginaAtual');
        let recebidosPaginaAtual = 0;
        let geradosPaginaAtual = 0;
        let recebidosPaginaInicial = hdnRecebidosPaginaAtual ? parseInt(hdnRecebidosPaginaAtual.value) : 0;
        let geradosPaginaInicial = hdnGeradosPaginaAtual ? parseInt(hdnGeradosPaginaAtual.value) : 0;
        let getPage = async (doc: Document, pageRecebidos: number, pageGerados: number) => {
            let form = <HTMLFormElement>doc.getElementById('frmProcedimentoControlar');
            let formData = new FormData(form);
            formData.set('hdnRecebidosPaginaAtual', pageRecebidos.toString())
            formData.set('hdnGeradosPaginaAtual', pageGerados.toString())
            let request = await AnexosTools.getRequest(form.action, 'POST', 'document', formData);
            return <Document>request.response
        }

        let carregarTrs = async (doc: Document, pageRecebidos: number, pageGerados: number) => {
            let _doc = await getPage(doc, pageRecebidos, pageGerados);
            let _tr_recebidos = Array.from(_doc.querySelectorAll<HTMLTableRowElement>('#tblProcessosRecebidos>tbody>tr[id^="P"]'));
            let _tr_gerados = Array.from(_doc.querySelectorAll<HTMLTableRowElement>('#tblProcessosGerados>tbody>tr[id^="P"]'));
            return { _doc: _doc, _tr_recebidos: _tr_recebidos, _tr_gerados: _tr_gerados }
        }


        let carregarPaginas = async (doc: Document) => {

            let loadRecebidos = false;
            let loadGerados = false;
            let divGeradosAreaPaginacaoSuperior = doc.getElementById('divGeradosAreaPaginacaoSuperior');
            let divRecebidosAreaPaginacaoSuperior = doc.getElementById('divRecebidosAreaPaginacaoSuperior');
            let divGeradosAreaPaginacaoInferior = this.document.getElementById('divGeradosAreaPaginacaoInferior');
            let divRecebidosAreaPaginacaoInferior = this.document.getElementById('divRecebidosAreaPaginacaoInferior');


            if (divGeradosAreaPaginacaoSuperior && divGeradosAreaPaginacaoSuperior.innerHTML.match(/proxima_pagina\.gif/)) {
                geradosPaginaAtual++;
                loadGerados = true;
            }
            if (divRecebidosAreaPaginacaoSuperior && divRecebidosAreaPaginacaoSuperior.innerHTML.match(/proxima_pagina\.gif/)) {
                recebidosPaginaAtual++;
                loadRecebidos = true;
            }

            if (divGeradosAreaPaginacaoInferior) divGeradosAreaPaginacaoInferior.innerText = '';
            if (divGeradosAreaPaginacaoSuperior) divGeradosAreaPaginacaoSuperior.innerText = '';
            if (divRecebidosAreaPaginacaoInferior) divRecebidosAreaPaginacaoInferior.innerText = '';
            if (divRecebidosAreaPaginacaoSuperior) divRecebidosAreaPaginacaoSuperior.innerText = '';

            if (loadRecebidos || loadGerados) {
                let trs = await carregarTrs(doc, recebidosPaginaAtual, geradosPaginaAtual);
                if (loadRecebidos) {
                    for (let el of trs._tr_recebidos) {
                        tblProcessosRecebidos.append(el);
                    }
                }
                if (loadGerados) {
                    for (let el of trs._tr_gerados) {
                        tblProcessosGerados.append(el);
                    }
                }
                await carregarPaginas(trs._doc);
            } else if (recebidosPaginaAtual > 0 || geradosPaginaAtual > 0) {
                await getPage(doc, 0, 0);
            } else {
            }
        }
        if (recebidosPaginaInicial > 0 || geradosPaginaInicial > 0) {
            let trs = await carregarTrs(this.document, 0, 0);
            //limpar página atual
            let _tr_recebidos = Array.from(this.document.querySelectorAll<HTMLTableRowElement>('#tblProcessosRecebidos>tbody>tr[id^="P"]'));
            let _tr_gerados = Array.from(this.document.querySelectorAll<HTMLTableRowElement>('#tblProcessosGerados>tbody>tr[id^="P"]'));
            _tr_recebidos.concat(_tr_gerados).forEach((el) => {
                el.remove();
            });
            //carregar itens da primeira página
            for (let el of trs._tr_recebidos) {
                tblProcessosRecebidos.append(el);
            }
            for (let el of trs._tr_gerados) {
                tblProcessosGerados.append(el);
            }
            //carregar itens da próximas páginas
            await carregarPaginas(trs._doc);
        } else {
            await carregarPaginas(this.document);
        }


        this.tableSearch('', '');
    }

    async addBtnComando(id: string, imageSrc: string, title: string, onClick: (e: Event) => void, rel?: string, href?: string) {
        let a = <HTMLAnchorElement>this.document.getElementById(id);
        if (a) {
            a.onclick = onClick;
            return a;
        };
        let divs = await this.waitLoadElements('#divComandos');
        let divComandos = divs[0];
        a = this.window.document.createElement('a');
        a.style.cssFloat = 'right';
        a.id = id;
        a.tabIndex = 451;
        a.href = '#';
        a.setAttribute('class', 'botaoSEI');
        if (rel) a.rel = rel;
        if (href) a.href = href;
        let img = this.window.document.createElement('img');
        img.src = imageSrc;
        img.alt = title;
        img.title = title;
        a.append(img);
        divComandos.append(a);
        a.onclick = onClick;
        return a;
    }

    openDialogIniciarProcesso() {
        return new Promise<ProcessoConfig>((resolve, reject) => {
            this.dialogIniciarProcesso.dialog("open");
            this.dialogIniciarProcesso.dialog({
                autoOpen: false,
                height: 200,
                width: 200,
                modal: true,
                buttons: {
                    "Inserir": () => {
                        let d = <HTMLSelectElement>this.document.getElementById('_processoSei');
                        let cfg = AnexosTools.getCfg();
                        for (let processo of cfg.processosConfig) {
                            if (processo.nome === d.value) {
                                resolve(processo);
                                break;
                            }
                        }
                        this.dialogIniciarProcesso.dialog("close");
                    },
                    "Cancelar": () => {
                        resolve(null);
                        this.dialogIniciarProcesso.dialog("close");
                    }
                }
            });

        });
    }
    private dialogIniciarProcesso: JQuery<Element>;
    private startDialogIniciarProcesso() {
        let d = this.document.getElementById('dialog-inserir-processo');
        if (!d) {
            this.document.body.insertAdjacentHTML('afterend', `
            <div id="dialog-inserir-processo" title="Selecionar o tipo de processo:">
            <fieldset>
            <legend>Formato</legend>
            <select id="_processoSei" name="_processoSei">
            </select>
            </fieldset>
            </div>
        `);
            let select = <HTMLSelectElement>this.document.getElementById('_processoSei');
            let cfg = AnexosTools.getCfg();
            for (let processo of cfg.processosConfig) {
                if (processo.gerarProcessoSei) {
                    let o = this.document.createElement('option');
                    o.value = processo.nome;
                    o.innerText = processo.nome;
                    select.add(o);
                }
            }
            this.dialogIniciarProcesso = $("#dialog-inserir-processo").dialog({
                autoOpen: false,
                height: 120,
                width: 200,
                modal: true
            });
        }

    }
}

var procedimentoControlar = new ProcedimentoControlar(window);
AnexosTools.onWindowload(window).then(() => {
    procedimentoControlar.iniciar();
});

