class ProcedimentoTrabalharClassModel extends AbstractSubClassEngine {
    procedimentoTrabalhar: ProcedimentoTrabalhar;

    constructor(procedimentoTrabalhar: ProcedimentoTrabalhar) {
        super();
        this.procedimentoTrabalhar = procedimentoTrabalhar;
    }
    setWindow(window: Window) {
        this.procedimentoTrabalhar.waitLoadWindow().then(() => {
            super.setWindow(window);
        });
    }
    extraWaitOnLoad() {
        if (this.procedimentoTrabalhar.window == null) {
            return false;
        }
        else {
            // console.log("Procedimento trabalhar loaded");
            return true;
        }
    }
}
