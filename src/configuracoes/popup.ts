
module PopUp {
    let _comunicacaoBGWorker = ComunicacaoBGWorker;

    function log(message: string, logError = false) {
        let p = document.createElement('p');
        p.textContent = message;
        if (logError) {
            p.classList.add('bg-danger')
        } else {
            p.classList.add('bg-success')
        }
        document.getElementById('log').append(p);
    }

    function manter_atualizado_procedimentos() { return (<HTMLInputElement>document.getElementById('manter_atualizado_procedimentos')) }
    function inserir_drop_zone() { return (<HTMLInputElement>document.getElementById('inserir_drop_zone')) }
    function testar_formulario() { return (<HTMLInputElement>document.getElementById('testar_formulario')) }
    function inserir_anexos() { return (<HTMLInputElement>document.getElementById('inserir_anexos')) }
    function copiar_lista() { return (<HTMLInputElement>document.getElementById('copiar_lista')) }
    function copiar_lista_numerada() { return (<HTMLInputElement>document.getElementById('copiar_lista_numerada')) }
    function filtrar_processos() { return (<HTMLInputElement>document.getElementById('filtrar_processos')) }
    function prazo_processos() { return (<HTMLInputElement>document.getElementById('prazo_processos')) }

    async function iniciar() {
        carregarJanelaConfigurar();
        carregarFuncoes();
    }

    function normalizedID(nome: string) {
        return nome.replace(/[\(\)\[\]\{\}\*\.\\\- \<\>\:\/]/ig, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    async function carregarJanelaConfigurar() {
        let _cfg = await _comunicacaoBGWorker.getAppCfg();
        manter_atualizado_procedimentos().checked = _cfg.manter_atualizado_procedimentos;
        inserir_anexos().checked = _cfg.inserir_anexos;
        testar_formulario().checked = _cfg.testar_formulario;
        inserir_drop_zone().checked = _cfg.inserir_drop_zone;
        copiar_lista().checked = _cfg.copiar_lista;
        copiar_lista_numerada().checked = _cfg.copiar_lista_numerada;
        filtrar_processos().checked = _cfg.filtrar_processos;
        prazo_processos().checked = _cfg.prazo_processos;
    }
    async function updateCfg() {
        let cfgParcial: Partial<AppCfg> = {
            manter_atualizado_procedimentos: manter_atualizado_procedimentos().checked,
            testar_formulario: testar_formulario().checked,
            inserir_drop_zone: inserir_drop_zone().checked,
            inserir_anexos: inserir_anexos().checked,
            copiar_lista: copiar_lista().checked,
            copiar_lista_numerada: copiar_lista_numerada().checked,
            filtrar_processos: filtrar_processos().checked,
            prazo_processos: prazo_processos().checked
        }
        _comunicacaoBGWorker.saveCfg(cfgParcial)
        log('Configuração atualizada:');
    }
    function carregarFuncoes() {
        let btn_cfg = <HTMLButtonElement>document.getElementById('cfg');
        btn_cfg.addEventListener('click', (e) => {
            e.preventDefault();
            _comunicacaoBGWorker.loadPageConfig('main');
        })


        let _trabalhar = <HTMLFieldSetElement>document.getElementById('telaTrabalhar');
        let _controlar = <HTMLFieldSetElement>document.getElementById('telaControlar');
        for (let el of Array.from(_trabalhar.querySelectorAll('input,textarea'))) {
            (<HTMLInputElement>el).onchange = updateCfg;
        }
        for (let el of Array.from(_controlar.querySelectorAll('input,textarea'))) {
            (<HTMLInputElement>el).onchange = updateCfg;
        }
    }
    onload = () => {
        iniciar();
    };
}
