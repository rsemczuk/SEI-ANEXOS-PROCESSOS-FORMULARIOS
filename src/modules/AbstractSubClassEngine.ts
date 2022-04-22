/// <reference path="../app.d.ts" />
class AbstractSubClassEngine {
    className: string;
    verbose = false;
    private voidOnUnLoads: Array<(ok: boolean) => void> = [];
    private voidAfterOnUnLoads: Array<(ok: boolean) => void> = [];
    private resolveOnUnLoads: Array<(ok: boolean) => void> = [];
    window: Window;
    document: Document;

    constructor() {
        this.className = '';
        this.voidOnUnLoads = [];
        this.voidAfterOnUnLoads = [];
        this.resolveOnUnLoads = [];

        let waitElement = (resolve: (value: HTMLElement[] | PromiseLike<HTMLElement[]>) => void, querySelector: string, timeOut: number, delay: number) => {
            if (timeOut <= 0) {
                if (this.verbose)  console.log('waitLoadElement timeOut in ' + this.className + ': ' + querySelector);
                resolve(null);
                // reject();
            } else {
                let elements = buscar(this.window, querySelector);
                if (elements === null || !elements.length || elements.length == 0) {
                    timeOut = timeOut - delay;
                    setTimeout(() => waitElement(resolve, querySelector, timeOut, delay), delay);
                } else if (elements.length > 0) {
                    resolve(elements);
                } else {
                    if (this.verbose)  console.log('unknow waitLoadElement timeOut in ' + this.className + ': ' + querySelector);
                    timeOut = timeOut - delay;
                    setTimeout(() => waitElement(resolve, querySelector, timeOut, delay), delay);
                }
            }
        };

        let buscar = (curWindow: Window, querySelector: string): HTMLElement[] => {
            let elements: HTMLElement[] = null;
            if (curWindow && curWindow.document) {
                let elements = <HTMLElement[]>Array.from(curWindow.document.querySelectorAll(querySelector));
                if (elements.length > 0) {
                    return elements;
                }
                if (curWindow.length > 1) {
                    for (let i = 1; i < curWindow.length; i++) {
                        try {
                            String(curWindow[i]);
                            if (curWindow[i] && curWindow[i].document) {
                                elements = <HTMLElement[]>Array.from(curWindow[i].document.querySelectorAll(querySelector));
                                if (elements.length > 0) {
                                    return elements;
                                }
                                elements = buscar(curWindow[i], querySelector);
                                if (elements !== null && elements.length > 0)
                                    return elements;
                            }
                        } catch (e) {
                            if (this.verbose) console.error(e);
                        }
                    }
                }
            }
            return elements;
        };

        this.waitLoadElements = <T extends HTMLElement>(querySelector: string, timeOut: number = 100000, delay: number = 30) => {
            return new Promise<T[]>((resolve, reject) => {
                waitElement(resolve, querySelector, timeOut, delay);
            });
        }

    }

    declare waitLoadElements: <T extends HTMLElement>(querySelector: string, timeOut?: number, delay?: number) => Promise<T[]>;

    async onUnloadRun(onunload?: () => void, afterOnunload?: () => void, runNow?: () => void) {
        if (runNow) {
            runNow();
        }
        if (onunload) {
            this.voidOnUnLoads.push(onunload);
        }
        if (afterOnunload) {
            this.voidAfterOnUnLoads.push(afterOnunload);
        }
        return new Promise<boolean>((resolve, reject) => {
            this.resolveOnUnLoads.push(resolve);
        });
    }
    extraWaitOnLoad() {
        return true;
    }
    setWindow(w: Window) {
        let bodyOnUnLoad: (e: Event) => void;
        if (w != null) {

            if (this.window && w === this.window) { if (this.verbose) console.log('window === w'); return };
            if (w.onunload) bodyOnUnLoad = w.onunload;
            w.onunload = (ev) => {
                if (bodyOnUnLoad) bodyOnUnLoad(ev);
                if (this.verbose)  console.log(this.className + ": onUnLoad!");
                this.setWindow(null);
            };
            this.window = w;
            this.document = w.document;
            if (this.verbose) console.log(this.className + ": onLoad!");
            this.iniciar().then(this.onload);
        } else {
            for (let onunload of this.voidOnUnLoads) {
                onunload(true);
            }
            this.onunload();
            this.window = null;
            this.document = null;
            this.afterOnUnload();
            for (let onunload of this.voidAfterOnUnLoads) {
                onunload(true);
            }
            for (let resolve of this.resolveOnUnLoads) {
                resolve(true);
            }
            this.resolveOnUnLoads = [];
            this.voidOnUnLoads = [];
            this.voidAfterOnUnLoads = [];
            if (this.verbose) console.log(this.className + ": onUnLoad!");
        }
    }
    afterOnUnload() { }
    onload() { }
    onunload() { }
    async iniciar() {
        if (!AnexosTools.getCfg()) {
            let messagingBackGround = new MessagingBackGround();
            AnexosTools.setCfg(await messagingBackGround.getCfg());
        }
    }

    waitLoadWindow(timeOut: number = 100000) {
        return new Promise<Window>((resolve, reject) => {
            let f = () => {
                if (this.window != null) {
                    timeOut = 0;
                    resolve(this.window);
                }
                else if (timeOut > 0) {
                    timeOut -= 50;
                    setTimeout(() => f(), 50);
                }
                else {
                    resolve(null);
                }
            };
            f();
        });
    }
    async waitLoadDocument(timeOut: number = 100000): Promise<Document> {
        return (await this.waitLoadWindow(timeOut)).document;
    }

    async waitLoad(timeOut?: number): Promise<boolean> {
        return !!(await this.waitLoadWindow(timeOut));
    }

    waitLoadText(text: string, timeOut: number = 100000) {
        return new Promise<Window>((resolve, reject) => {
            let f = () => {
                if (this.window != null && this.window.document.body.innerText.match(text)) {
                    timeOut = 0;
                    resolve(this.window);
                }
                else if (timeOut > 0) {
                    timeOut -= 50;
                    setTimeout(() => f(), 50);
                }
                else {
                    reject();
                }
            };
            f();
        });
    }


    querySelectorAll<T extends HTMLElement[]>(selectors: string) {
        return <T>Array.from(this.document.querySelectorAll(selectors));
    }
    querySelector<T extends HTMLElement>(selector: string) {
        return <T>this.document.querySelector(selector);
    }

}
