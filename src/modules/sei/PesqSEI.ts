
(() => {
    class PesqSEI extends AbstractSubClassEngine {
        private async gerar() {
            let img = (await this.waitLoadElements<HTMLImageElement>('#lblCaptcha>img'))[0];
            let imgArrRx = /codetorandom=(?<id1>\d+)\-(?<id2>\d+)/.exec(img.src);
            let str = this.calc(parseInt(imgArrRx.groups.id1), parseInt(imgArrRx.groups.id2));
            this.document.querySelector<HTMLInputElement>('#txtCaptcha').value = str;
        }

        private calc(id1: number, id2: number) {
            let id3 = Math.round((id1 + id2) / 2 + 0.1);
            let id4 = Math.round((id1 + id2) / 2 - 0.1);
            if (id3 >= 91 && id3 <= 96 || id3 >= 58 && id3 <= 64) if (id1 > id2) id3 = id2; else id3 = id1;
            if (id4 >= 91 && id4 <= 96 || id4 >= 58 && id4 <= 64) if (id1 > id2) id4 = id1; else id4 = id2;
            return String.fromCharCode(id1, id2, id3, id4);
        }
        async iniciar() {
            this.gerar();
        }
    }
    //new PesquisaSEI().setWindow(window);
})();