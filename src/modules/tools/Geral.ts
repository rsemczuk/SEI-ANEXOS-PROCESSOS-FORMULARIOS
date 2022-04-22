/// <reference path="../../app.d.ts" />

module AnexosTools {



  export function desfocarDados(window: Window) {
    //span[id^="span"], //numero sei arvore
    // let elements = Array.from(window.document.querySelectorAll('#selInfraUnidades,#divInformacao,.ancoraSigla,.processoVisualizado,.processoNaoVisualizado,[src^="modulos/treto/arvore_documento_sigla_unidade"],#divInfraBarraSuperior,[title="Reginaldo Semczuk"],[src^="data:image"]'));
    // elements.forEach((el) => {
    //   if (el && el.getAttribute('style')) {
    //     if (!el.outerHTML.match('8px')) {
    //       el.setAttribute('style', el.getAttribute('style') + 'filter:blur(8px);');
    //     }
    //   } else {
    //     el.setAttribute('style', 'filter:blur(8px);');
    //   }

    // });
    // setTimeout(() => { desfocarDados(window) }, 100);
  }


  export function validarCPF(cpf: string) {
    cpf = cpf.replace(/[^0-9]/g, '');
    let checkSum = 0;
    for (let i = 0; i < 9; i++) {
      checkSum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let rev = 11 - (checkSum % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != parseInt(cpf.charAt(9))) {
      return false;
    }
    checkSum = 0;
    for (let i = 0; i < 10; i++) {
      checkSum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (checkSum % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != parseInt(cpf.charAt(10))) {
      return false;
    }
    return true;
  }

  export function onWindowload(_window: Window) {
    return new Promise<Window>((resolve, reject) => {
      let listener = () => {
        resolve(_window);
        // if (_window.document.body) {
        //   _window.document.body.removeEventListener('load', listener, false);
        // }
        _window.removeEventListener('load', listener, false);
      }
      // console.log(_window.document.readyState);
      if (_window.document.readyState === 'complete') {// || _window.document.readyState === 'interactive'
        // console.log(_window.document.location.href);
        // _window.addEventListener('load',()=>console.log(_window.document.location.href));
        resolve(_window);
      } else {
        // if (_window.document.body) {
        //   _window.document.body.addEventListener('load', listener, false);
        // } else {
        //   _window.addEventListener('load', listener, false);
        // }

        _window.addEventListener('load', listener, false);

      }
    })
  }

  export function normalizedID(nome: string) {
    return nome.replace(/[\(\)\[\]\{\}\*\.\\\- \<\>\:\/]/ig, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }


  function IsPopupBlocker() {
    setTimeout(() => {
      let oWin = window.open("popup.htm", "go", "width=1,height=1,top=900,left=900");
      if (!oWin) {
        alert("O Bloqueador de Pop-up está ativado, para que o site funcione perfeitamente, na aba acima, clique em sempre permitir, ou desbloquear, Pop-ups desse site ");
      }
      oWin.close();
    }, 3000);
  }
  export function clearInnerHTML(el: HTMLElement) {
    if (el) {
      while (el.firstChild)
        el.removeChild(el.firstChild);
    }
  }

  export function loadLinks(doc: Document): Link[] {
    let links: Link[] = [];
    let rx = /(?:(?<link>controlador\.php\?acao=(?<nomeInterno>[a-zA-Z_]+).+?(?=(?:"|')))(?:'|"))(?:(?:,"ifrVisualizacao",")|(?:.+?(?=(?:alt\="))(?:alt\="))|(?:.+?(?=(?:">))(?:">)))?(?:(?<nomeVisivel>.+?(?=(?:.*"(?<idExternoDocumento>\d+)"\);|","|" title|<\/a>)))(?:","|" title|<\/a>))?/ig
    let arrRX: RegExpExecArray;
    let html = doc.head.innerHTML + '\n' + doc.body.innerHTML;
    let rx_id_procedimento = /id_procedimento=(?<idProcedimento>[0-9]+)/;
    let rx_id_documento = /id_documento=(?<idDocumento>[0-9]+)/;
    let rx_id_anexo = /id_anexo=(?<idAnexo>[0-9]+)/;


    while (arrRX = rx.exec(html)) {

      let link = arrRX.groups.link.replace(/\&amp;/g, '\&');
      let idProcedimento: string;
      let idDocumento: string;
      let idAnexo: string;
      let p = document.createElement('p');
      let nomeVisivel = arrRX.groups.nomeVisivel;
      if (arrRX.groups.nomeVisivel) {
        p.innerHTML = nomeVisivel;
        nomeVisivel = p.innerText;
      }

      let nomeInterno = arrRX.groups.nomeInterno;
      if (link.match(rx_id_procedimento)) {
        let arrProcedimento = rx_id_procedimento.exec(link);
        idProcedimento = arrProcedimento.groups.idProcedimento
      }
      if (link.match(rx_id_documento)) {
        let arrDocumento = rx_id_documento.exec(link);
        idDocumento = arrDocumento.groups.idDocumento
      }
      if (link.match(rx_id_anexo)) {
        let arrAnexo = rx_id_anexo.exec(link);
        idAnexo = arrAnexo.groups.idAnexo
      }

      links.push({
        acao: nomeInterno,
        nomeVisivel: nomeVisivel,
        link: link,
        idProcedimento: idProcedimento,
        idDocumento: idDocumento,
        idAnexo: idAnexo,
        idExternoDocumento: arrRX.groups.idExternoDocumento

      });
    }
    return links;
  }




  export function download(filename: string, text: string, type: 'text/plain' | 'text/json' = 'text/plain') {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  export function fileToFileList(file: File) {
    const dt = new DataTransfer();
    dt.items.add(file);
    return dt.files;
  }
  export function getDataPorExtenso(data: Date, semana?: boolean, somenteMes?: boolean, somenteDiaDaSemana?: boolean, somenteDia?: boolean): string {
    let arrayDiaDaSemana = [];
    arrayDiaDaSemana[0] = "domingo";
    arrayDiaDaSemana[1] = "segunda-Feira";
    arrayDiaDaSemana[2] = "terça-Feira";
    arrayDiaDaSemana[3] = "quarta-Feira";
    arrayDiaDaSemana[4] = "quinta-Feira";
    arrayDiaDaSemana[5] = "sexta-Feira";
    arrayDiaDaSemana[6] = "sábado";
    let arrayMes = new Array();
    arrayMes[0] = "janeiro";
    arrayMes[1] = "fevereiro";
    arrayMes[2] = "março";
    arrayMes[3] = "abril";
    arrayMes[4] = "maio";
    arrayMes[5] = "junho";
    arrayMes[6] = "julho";
    arrayMes[7] = "agosto";
    arrayMes[8] = "setembro";
    arrayMes[9] = "outubro";
    arrayMes[10] = "novembro";
    arrayMes[11] = "dezembro";
    let dia = data.getDate().toString();
    if (dia.length === 1) {
      dia = '0' + dia;
    }
    if (somenteDia) {
      return dia;
    } else if (somenteDiaDaSemana) {
      return arrayDiaDaSemana[data.getDay()];
    } else if (somenteMes) {
      return arrayMes[data.getMonth()];
    } else {
      return (semana ? arrayDiaDaSemana[data.getDay()] + ", " : "") + dia + " de " + arrayMes[data.getMonth()] + " de " + data.getFullYear();
    }

  }

  export function primeiraLetraMaiuscula(text: string) {
    if (text) {
      text = text.substring(0, 1).toLocaleUpperCase() + (text.length > 1 ? text.substring(1) : "");
    }
    return text
  }

  export const SORT_LETRAS_MAIOR_PARA_MENOR = function (a: string, b: string) {
    if (a === null) {
      return 1;
    }
    if (b === null) {
      return -1;
    }
    return b.localeCompare(a, 'pt-BR', { sensitivity: 'base' });
  };

  export const SORT_LETRAS_MENOR_PARA_MAIOR = function (a: string, b: string) {
    if (a === null) {
      return -1;
    }
    if (b === null) {
      return 1;
    }
    return a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
  };

  export const SORT_LENGTH_MAIOR_PARA_MENOR = function (a: string, b: string) {
    if (a === null) {
      return 1;
    }
    if (b === null) {
      return -1;
    }
    return b.length - a.length;
  };
  export const SORT_LENGTH_MENOR_PARA_MAIOR = function (a: string, b: string) {
    if (a === null) {
      return -1;
    }
    if (b === null) {
      return 1;
    }
    return a.length - b.length;
  };
  export const SORT_ELEMENT_TEXT_LENGTH_MAIOR_PARA_MENOR = function (a: HTMLElement, b: HTMLElement) {
    if (a === null) {
      return 1;
    }
    if (b === null) {
      return -1;
    }
    return b.innerText.length - a.innerText.length;
  };
  export const SORT_ELEMENT_TEXT_LENGTH_MENOR_PARA_MAIOR = function (a: HTMLElement, b: HTMLElement) {
    if (a === null) {
      return -1;
    }
    if (b === null) {
      return 1;
    }
    return a.innerText.length - b.innerText.length;
  };


  function saveFile(url: string) {
    return new Promise<XMLHttpRequest>(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = () => {
        resolve(xhr);
      };
      xhr.onerror = reject;
      xhr.open('GET', url);
      xhr.send();
    }).then((xhr: XMLHttpRequest) => {
      let filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      return xhr;
    });
  }
  export function getRequest(url: string, method: 'POST' | 'GET', type: XMLHttpRequestResponseType, formData?: FormData) {
    return new Promise<XMLHttpRequest>(function (resolve, reject) {
      function updateProgress(oEvent: ProgressEvent<XMLHttpRequestEventTarget>) {
        if (oEvent.lengthComputable) {
          var percentComplete = oEvent.loaded / oEvent.total;
        }
        else {
        }
      }
      function transferComplete(evt: ProgressEvent<XMLHttpRequestEventTarget>) {
        // console.log("A transferência foi concluída.");
      }
      function transferFailed(evt: ProgressEvent<XMLHttpRequestEventTarget>) {
        // console.log("Um erro ocorreu durante a transferência do arquivo.");
      }
      function transferCanceled(evt: ProgressEvent<XMLHttpRequestEventTarget>) {
        // console.log("A transferência foi cancelada pelo usuário.");
      }
      let xhr = new XMLHttpRequest();
      xhr.responseType = type;
      // xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      xhr.onload = () => {
        resolve(xhr);
      };
      xhr.onerror = reject;
      xhr.addEventListener("progress", updateProgress, false);
      xhr.addEventListener("load", transferComplete, false);
      xhr.addEventListener("error", transferFailed, false);
      xhr.addEventListener("abort", transferCanceled, false);
      xhr.open(method, url);
      xhr.send(formData);
    });
  }

  export function extenso(numero: number) {
    numero = parseInt(numero.toFixed(0));
    let arr1 = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
    let arr2 = ["dez", "vinte", "trinta", "quarenta", "cinqüenta", "sessenta", "setenta", "oitenta", "noventa"];
    if (numero > 99) {
      return numero.toFixed(0);
    } else {
      if (numero < 20) {
        return arr1[numero];
      } else {
        let n = "";
        let arr = numero.toString().split('');
        let p = parseInt(arr[0]);
        let s = parseInt(arr[1]);
        n = arr2[p - 1]
        if (s > 0) {
          n += " e " + arr1[p];
        }
        return n;
      }
    }
  }

  export function getProcesso(nome: string, processos?: ProcessoConfig[]): ProcessoConfig {
    for (let p of processos || getCfg().processosConfig) {
      if (p.nome === nome) return p;
    }
  }

  export function getFormulario(nome: string, formularios?: FormularioConfig[]): FormularioConfig {
    for (let f of formularios || getCfg().formulariosConfig) {
      if (f.nome === nome) return f;
    }
  }

  function fixTipoDocumentos() {

    cfg.formulariosConfig.forEach((f, i, arr) => {

      if (Array.isArray(f.nomeFormulario) && cfg.formulariosExistentes.length > 0) {
        let formularios = f.nomeFormulario.filter((nomeFormulario) => {
          return cfg.formulariosExistentes.filter((_nome) => {
            return nomeFormulario === _nome;
          }).length > 0;
        });

        if (formularios.length > 0) {
          f.nomeFormulario = formularios[0];
        } else if (f.nomeFormulario.length > 0) {
          f.nomeFormulario = f.nomeFormulario[0];
        }

      } else if (Array.isArray(f.nomeFormulario)) {
        if (f.nomeFormulario.length > 0)
          f.nomeFormulario = f.nomeFormulario[0];
      }

    })

    cfg.meusTiposDeAnexos.forEach((f, i, arr) => {
      if (Array.isArray(f.dados.nomeAnexo) && cfg.anexosExistentes.length > 0) {
        let formularios = f.dados.nomeAnexo.filter((tipo) => {
          return cfg.anexosExistentes.filter((a) => {
            return tipo === a;
          }).length > 0;
        });

        if (formularios.length > 0) {
          f.dados.nomeAnexo = formularios[0];
        } else if (f.dados.nomeAnexo.length > 0) {
          f.dados.nomeAnexo = f.dados.nomeAnexo[0];
        }

      } else if (Array.isArray(f.dados.nomeAnexo)) {
        if (f.dados.nomeAnexo.length > 0)
          f.dados.nomeAnexo = f.dados.nomeAnexo[0];
      }

    })


    cfg.coordenadasPdf.forEach((f, i, arr) => {
      if (Array.isArray(f.nomeAnexo) && cfg.anexosExistentes.length > 0) {
        let formularios = f.nomeAnexo.filter((tipo) => {
          return cfg.anexosExistentes.filter((a) => {
            return tipo === a;
          }).length > 0;
        });

        if (formularios.length > 0) {
          f.nomeAnexo = formularios[0];
        } else if (f.nomeAnexo.length > 0) {
          f.nomeAnexo = f.nomeAnexo[0];
        }

      } else if (Array.isArray(f.nomeAnexo)) {
        if (f.nomeAnexo.length > 0)
          f.nomeAnexo = f.nomeAnexo[0];
      }

    })



  }

  export async function updateHipoteses(hipotesesCarregadas: string[]) {
    let _set = Array.from(new Set(AnexosTools.getCfg().hipotesesExistentes.concat(hipotesesCarregadas))).sort(AnexosTools.SORT_LETRAS_MENOR_PARA_MAIOR);
    _set = _set.reduce((p, cur) => {
      if (cur.replace(/[  ]/g, '').length > 0) p.push(cur);
      return p;
    }, <string[]>[])
    if (AnexosTools.getCfg().hipotesesExistentes.length !== _set.length ||
      AnexosTools.getCfg().hipotesesExistentes.toString() !== _set.toString()
    ) {
      AnexosTools.getCfg().hipotesesExistentes = _set;
      await AnexosTools.saveCfg();
    }
  }



  let cfg: AppCfg;
  export function getCfg(): AppCfg {
    if (cfg) {
      fixTipoDocumentos();
    }
    return cfg;
  }
  export function setCfg(_cfg: AppCfg) {
    cfg = _cfg;
  }

  export async function saveCfg(reload = true): Promise<AppCfg> {
    let messagingBackGround = new MessagingBackGround();
    return await messagingBackGround.setCfg(cfg, reload);
  }


  export function createLinkHtmlDoc(numeroInternoDoDocumento: string, numeroDePesquisaSei: string, nomeCompletoDocumento: string, full: boolean, addPonto: string): string {
    let linkSei = document.createElement('a');
    linkSei.id = 'lnkSei' + numeroInternoDoDocumento;
    linkSei.setAttribute('style', 'text-indent:0px;');
    linkSei.className = 'ancoraSei';
    linkSei.append(numeroDePesquisaSei);
    let spanNotEditable = document.createElement('span');
    spanNotEditable.setAttribute('contenteditable', 'false');
    spanNotEditable.setAttribute('style', 'text-indent:0px;');
    spanNotEditable.setAttribute('data-cke-linksei', '1');
    spanNotEditable.append(linkSei);
    let s1 = document.createTextNode(nomeCompletoDocumento + ' (');
    let s2 = document.createTextNode(')');
    let p = document.createElement('p');
    // p.className = '__formatacao__';
    if (full) {
      p.append(s1);
      p.append(spanNotEditable);
      p.append(s2);
      p.append(addPonto);
    }
    else {
      p.append(spanNotEditable);
    }
    return p.innerHTML;
  }

  export function gerarAnexos(fileList: FileList) {
    return new Promise<Anexos>(async (resolve, reject) => {
      let anexos: Anexo[] = [];
      for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        if (file.name.match(/^sei_cfg/igm))
          continue;
        let extrair = new ExtrairDados();
        let anexo = await extrair.extrairDadosDoArquivoOuTexto(file, file.name);
        anexo.file = AnexosTools.fileToFileList(file);
        anexos.push(anexo);
      }
      resolve(<Anexos>anexos);
    });
  }
  export function gerarDocSEIs(anexos: Anexo[]) {
    let list: DocSEI[] = [];
    for (let anexo of anexos) {
      let d: DocSEI = {
        checkBox: null,
        copyLinkFull: null,
        LINK: null,
        imgCopiar: null,
        linkView: null,
        numeroInternoDoDocumento: null,
        numeroDePesquisaSei: null,
        span: null,
        linkAlterarDocumento: '',
        linkAnexo: '',
        LINK_EXTERNO:'',
        assinado:false,
        docNivelAcesso:'público',
        eFormulario:false,
        estaCancelado:false,
        ...anexo
      }
      list.push(d);
    }
    return list;
  }

}