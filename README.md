A extensão adiciona ferramentas e realiza algumas correções/adaptações para usuários do ambiente de produção do SEI:

Funções básicas:
Ícones em cada anexo/formulário com as funções: 
•	ícone de marcar/selecionar o anexo para usar as funções avançadas;
•	Função de copiar nome do anexo/formulário com link interno;
•	Função de copiar link externo/público (link obtido na pesquisa pública);
•	Função de alterar nível de acesso rápido;


* Função de anexar arquivo(s) de forma rápida: 

Com opções de modificar propriedades do formato do arquivo (nato digital, cópia autenticada administrativamente, cópia autenticada por cartório, cópia simples e documento original) e de alterar o nível de acesso do documento. 

Para anexar com essa função mantenha o início do nome do arquivo o mesmo nome do documento externo (“Tipo do Documento”) a ser selecionado, com isso, a função irá selecionar a opção correta do “Tipo do Documento”, e o que sobrar do nome do arquivo, até o primeiro ponto(.), será o “Número / Nome na Árvore” do documento externo. Exemplo: nome do arquivo “Formulário TESTE”, com isso o “Tipo do Documento” externo será “Formulário” e o “Número / Nome na Árvore” será “TESTE”.

Para adicionar a data do arquivo basta incluir no final do nome do arquivo “.22-04-2022” ou “22_04_2022”:Exemplo: “Formulário TESTE.22-04-2022”, isso fará com que a data de 22/04/2022 seja preenchida no documento externo.
E se não encontrar o “Tipo do Documento” correto ele será “Anexo” ou “Anexos”.
Esse botão de anexar arquivos fica um pouco acima do consultar andamento do processo SEI).

Por padrão a opção formato do arquivo é “nato digital” e o nível de acesso é “público”. Vem escrito nas opções escrito “Manter o que foi configurado anexo por anexo” devido existir configurações avançadas na extensão onde cada anexo pode ser configurado individualmente.


* Função modificar o nível de acesso em lote: 
Par utilizar basta utilizar o “ícone de marcar/selecionar o anexo” para selecionar os anexos/formulários, isso fará aparecer abaixo do botão de inserir anexos o botão para modificar o nível de acesso em lote.

Funções avançadas:

* Utilizar o texto do nome do arquivo ou texto de dentro do arquivo:

Com isso, por exemplo é possível criar chaves curtas para os nomes de arquivos com esse recurso podemos encurtar o nome de “Formulário” apenas para “F”. Exemplo: “Formulário TESTE.22-04-2022” --> “F TESTE.22-04-2022”) e teremos o mesmo efeito dos exemplos acima;

Capturar dados do texto para utilizar na criação automática de formulários;

Mudar o nível de acesso e o formato do arquivo;

* Utilizar o texto de arquivos PDF:

Capturar dados do texto ou coordenada (x, y) para utilizar na criação automática de formulários;

* Inserir formulários:
Aproveitar dados capturados acima para criar formulários de forma muito rápida;
É possível criar a partir de um modelo;
É possível utilizar funções personalizadas da extensão para montar o formulário como:
HOJE: 22/04/2022
HOJE_EXTENSO: 22 de abril de 2022
DIA: 22
ANO: 2022
MÊS: 04
LISTA: lista com os nomes e link dos documentos selecionados
LISTA_COM_MARCADORES: com os nomes e link dos documentos selecionados com marcadores
LISTA_NUMERADA com os nomes e link dos documentos selecionados com marcadores numéricos

Correções: 
Caso tenha problemas quando o SEI deixa todos documentos restritos no ambiente de produção quando um documento ou mais está restrito, a extensão torna possível visualizar os demais documentos do processo, desde que não estejam restrito. (ocorre com processos que não passaram pela sua unidade).


E muito mais.

Siga a página no YouTube “SEI - ANEXOS & PROCESSOS & FORMULÁRIOS” e aprenda mais sobre essas funções, com tempo estarei disponibilizando vídeos ensinando a utilizar todas essas funções.

install npm

install git

install gulp


cmds:
cd SEI-ANEXOS-PROCESSOS-FORMULARIOS

npm install

gulp build







