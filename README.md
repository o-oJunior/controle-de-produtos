### Instalar as dependências

Verifique se tem o node.js instalado em sua máquina;

Acesse o terminal e execute o comando 'npm i' ou 'npm install', para instalar as dependências utilizadas no projeto;

Após a instalação uma pasta 'node_modules' é gerada, nessa pasta está armazenado as dependências;

### Ferramentas utilizadas

JavaScript: linguagem de programação;
React: É uma biblioteca utilizada para renderizar o site;
React Hooks: Controlar os componentes através do estado/ciclo de vida;
Bootstrap: Um framework utilizado para definir os estilos da página de forma responsiva;
API: Consultar os nomes das cidades e as siglas dos estados;
Firebase (Google): No projeto é usado o Firestore, um banco de dados não relacional e em tempo real para armazenar os produtos cadastrados;
NodeJS: Instalar as dependências do projeto;

### Objetivo

O objetivo do projeto é facilitar o gerenciamento dos produtos, não depender apenas de arquivo excel, inibir códigos repetidos, evitar produtos que esteja abaixo do estoque minimo passe despercebido. Esse projeto foi pensando exclusivamente no cliente, tornar o processo de controle de produtos seguro, dar o suporte de conversão para Excel e download em PDF;

### Passo-a-passo

Página inicial: Uma breve apresentação das vantagens de usar um 'controlador de protudos virtual', com uma imagem ao lado e um botão que redireciona para a página de produtos;

Produtos: Ao clicar em cadastrar produto, o usuário será reedirecionado para a página de cadastro de produto;

Cadastro: Para cadastrar o produto é necessário preencher todos os campos obrigátorios (*) do formulário. Para evitar problemas de códigos repetidos, o código do produto já vem definido.

Os campos como cnpj, datas, cpf, cep, numero e os campos de moedas, possuem máscaras;

Para exibir a lista das siglas dos estados, e os nomes dos múnicipios do estado, é utilizado uma API;

RECOMENDADO: Em caso do preenchimento do formulário, preencha com dados fictícios;

Após a conclusão do cadastro, o usuário será redirecionado para a tela de produtos novamente;

Produtos: Uma lista de produtos que contem o código, nome, quantidade, estoque minimo, tipo (comprado ou fabricado) e o status da venda (ativado ou desativado). Ao lado dessas informações tem os botões que acessam cada produto, botão('olho') serve para visualizar, botão('caneta') é para editar, e a 'lixeira' é para apagar o produto;

Na barra de navegação: Temos um botão 'Venda', após clicar o usuário é redirecionado para a página para simular uma venda;

Venda: Ao inserir o código do produto, se tiver cadastrado e liberado para venda, irá preencher o formulário da venda, caso contrário, é exibido um mensagem 'Produto não encontrado!';

Ao preencher o formulário com os dados do produto, adicione a quantidade que deseja vender que seja abaixo ou igual a quantia que tem no estoque;

Após a confirmação da venda, é descontado a quantidade do produto no estoque;

OBS: Não da para vender uma quantidade acima do que está disponivel em estoque, ao tentar, a quantia é redefinida para a quantidade total que tem no estoque;