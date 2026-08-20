# Documentação técnica do Erebes

## 1. Contexto e objetivo

O Erebes é uma aplicação desktop desenvolvida em Electron para automatizar a geração de arquivos padronizados exigidos pelo Banco Central do Brasil. O sistema recebe planilhas Excel, extrai dados estruturados e transforma esses dados em formatos de saída como JSON, XML e arquivos TXT fixos.

A aplicação cobre principalmente:

- demonstrações financeiras (BP, DRE, DFC, DRA, DMPL)
- documentos das estruturas SVR/ASVR (9800 e 9805)
- Saldo Contábil Diário (SCD) – 4111
- APIX – 1201
- PVCA – geração de pacote em ZIP com arquivos textuais do Bacen

O projeto foi construído com foco em produtividade operacional para times que lidam com a preparação e envio de relatórios regulatórios.

## 2. Visão funcional

### 2.1 Fluxos de negócio principais

#### Módulo de demonstrações financeiras em JSON

Este fluxo permite importar uma planilha com múltiplas abas, como:

- BP
- DRE
- DFC
- DRA
- DMPL

A aplicação monta uma estrutura JSON com:

- CNPJ da instituição
- código do documento
- tipo de remessa
- unidade de medida
- data-base
- datas de referência
- contas e valores por conta

O JSON final é usado como representação intermediária para análise dos dados antes de transporte para outros formatos ou processos de integração.

#### Módulo de XML para ASVR 9800/9805

Esse módulo lê uma planilha específica de devolução e gera XML seguindo o padrão do Bacen para documentos 9800 e 9805. Ele realiza:

- mapear colunas Excel para propriedades internas
- normalizar CPF/CNPJ e valores de devolução
- transformar os dados em estrutura XML com js2xmlparser
- responder ao frontend com o XML gerado

#### Módulo SCD 4111

Este fluxo usa uma aba da planilha com contas e saldos. O sistema gera um XML com a estrutura:

- código do documento
- CNPJ
- data-base
- tipo remessa
- contas com saldo por conta

#### Módulo APIX 1201

Este fluxo recebe várias abas (Transações, Devoluções, Bloqueios Cautelares, Receitas, Tempos Consultas, Autorizacoes) e gera um XML de report com múltiplas seções. Há lógica específica para associar valores de tempos e consultas a atributos do XML final.

#### Módulo PVCA

O módulo de PVCA processa planilhas com múltiplas abas, cada uma representando um tipo de arquivo do Bacen, e gera um ZIP final com vários arquivos .TXT, padronizados em largura fixa. Esse fluxo é mais “arquivo híbrido/gerador de layouts”, reforçando o objetivo do projeto: serializar dados em layouts rígidos exigidos pela regra regulatória.

## 3. Arquitetura da aplicação

### 3.1 Camadas

A arquitetura é de camada simples e funcional, com forte acoplamento entre as regras de negócio e a serialização do arquivo final.

- Camada de UI: React + Material UI dentro de `front/`
- Camada desktop: Electron process principal em `main.js`
- Camada de APIs locais: Express em `server.js` e rotas em `controllers/controller.js`
- Camada de processamento: arquivos em `controllers/`
- Camada de utilitários: `util/index.js` e `validators/validator.js`

### 3.2 Fluxo de execução

1. O processo principal do Electron inicia a janela desktop.
2. O app carrega a interface em React no navegador embutido.
3. O usuário seleciona planilha e preenche campos obrigatórios.
4. O frontend envia multipart/form-data para o backend Express.
5. O backend usa `formidable` para processar o upload.
6. O arquivo Excel é convertido em JSON por `convert-excel-to-json`.
7. As funções em `controllers/` transformam esses dados em estruturas internas.
8. Os dados são convertidos em XML, JSON ou TXT conforme o módulo.
9. O resultado é devolvido ao frontend para download ou visualização.

## 4. Estrutura de arquivos e responsabilidades

### 4.1 Arquivos principais

#### `main.js`

É o processo principal do Electron. Ele:

- inicializa a janela principal
- habilita Express em processo local
- serve os arquivos estáticos da interface em `/front/build`
- abre o app em `http://127.0.0.1:3000`

#### `server.js`

Servidor Express auxiliar/duplicado. Ele também inicializa o backend e serve arquivos estáticos da build do frontend. Existe redundância com o `main.js` e parece ser um artefato legado ou secundário.

#### `controllers/controller.js`

É o centro de orquestração do backend. Ele expõe rotas HTTP para os módulos de processamento:

- `/api/upload`
- `/api/upload9800`
- `/api/upload9805`
- `/api/upload/pvca`
- `/api/upload/scd`
- `/api/upload/apix`

Cada rota:

- extrai arquivos enviados
- lê planilhas Excel
- converte planilhas em objetos com `excelToJson`
- monta dados intermediários
- chama a rotina específica do módulo
- devolve JSON/XML/ZIP para o cliente

#### `controllers/xml.js`

Arquivo de conversão para XML. É o núcleo central para os documentos XML. Ele:

- constrói objetos finais em JavaScript
- usa `js2xmlparser.parse()` para converter para XML
- trata diferentes tipos de documento (`9800`, `9805`, `4111`, `1201`)
- aplica regras específicas de cada layout

#### `controllers/bp.js`, `controllers/dre.js`, `controllers/dfc.js`, `controllers/dra.js`, `controllers/dmpl.js`

Esses módulos montam o JSON das demonstrações financeiras. Cada um implementa a lógica de conversão da respectiva aba da planilha para a estrutura exigida pelo Bacen.

Exemplo da lógica em BP:

- identifica linhas com “Ativo”
- calcula nível hierárquico por indentação
- cria conta pai/filho
- monta objetos com `@id`, `@nivel`, `@descricao`, `@contaPai`
- cria `valoresIndividualizados` com datas e valores

#### `controllers/pvca/*.js`

Cada arquivo representa um tipo de dado do PVCA, como:

- `conglome.js`
- `database.js`
- `transopa.js`
- `opeintra.js`
- `estatcrt.js`
- `estatatm.js`
- `usuremot.js`
- `contatos.js`

O padrão é semelhante: extrair dados da planilha, formatar strings e gerar um arquivo .TXT em layout fixo.

#### `util/index.js`

Arquivo utilitário para:

- criação de arquivos temporários em pasta do sistema
- escrita de arquivos TXT em encoding latin1
- completamento de campos com zeros ou espaços
- cálculo de quantidade de registros

#### `validators/validator.js`

Funções de apoio para padronização de campos:

- recorte de espaços iniciais
- completamento à direita/esquerda para tamanho fixo
- conversão de numeros e textos em formatos de arquivo

## 5. Transformações e regras de negócio

### 5.1 Conversão de planilhas Excel

A biblioteca `convert-excel-to-json` recebe o arquivo Excel e transforma as abas em arrays de objetos. Em cada controlador, a estrutura de colunas é mapeada manualmente, por exemplo:

```javascript
columnToKey: {
  A: 'conta',
  B: 'saldo',
  C: 'processar'
}
```

Isso cria um objeto que o restante da lógica processa sem depender diretamente da planilha original.

### 5.2 Hierarquia de contas

No módulo BP, a organização hierárquica segue a indentação textual da planilha. A função `calculeInitialWhiteSpaces()` mede a quantidade de espaços na string antes do texto, permitindo estimar o nível da conta.

Esse nível gera estruturas como:

- conta pai
- conta filha
- sequência de níveis (1, 1.1, 1.2, etc.)

### 5.3 Datas de referência

O projeto trata um conjunto de datas como `database1`, `database2`, `database3` e `database4`. A lógica foi adaptada para que só `dt1` seja obrigatória, e as demais sejam opcionais. Isso foi documentado em `REFATORACAO_DATAS.md` e está refletido no backend e no frontend.

### 5.4 Formato fixo

No fluxo PVCA e em utilidades de TXT, o código monta strings de tamanho fixo usando padding e concatenação manual. A função `writeFileTxt()` grava linhas com `\r\n` e concatena os valores dos campos para formar o arquivo final.

Esse padrão é típico de sistemas antigos e de geração regulatória, onde o layout é rígido e não interpretável por frameworks modernos.

## 6. Padrões de serialização e geração

### 6.1 JSON

Para demonstrações financeiras, a saída é um JSON estruturado com contas, nível, descrição e valores individualizados por data.

### 6.2 XML

Para XML, o projeto usa `js2xmlparser`, transformando objetos JavaScript em documentos XML com tags e atributos conforme o padrão Bacen.

Exemplo típico do código:

```javascript
resolve(js2xmlparser.parse("asvr9800", xmlTemp, { declaration: { encoding: "UTF-8" } }));
```

### 6.3 TXT fixo

Para PVCA e demais arquivos do Bacen em txt, o processo é:

- prepara objeto com campos
- ajusta tamanho de cada valor
- concatena em linha única
- grava header e registros em arquivo temporário
- empacota em ZIP

## 7. Frontend

### 7.1 Estrutura UI

A interface foi construída em React com Material UI e apresenta módulos para:

- JSON de demonstrações financeiras
- XML 9800/9805
- PVCA
- SCD 4111
- APIX 1201

A navegação é feita por estado local no componente principal `front/src/App.js`, com alternância entre telas de módulo.

### 7.2 Fluxo típico do frontend

O padrão em cada tela é:

- capturar arquivo de input
- coletar campos de formulário
- montar `FormData`
- enviar via `axios.post`
- receber resposta em JSON/XML/Blob
- renderizar ou baixar o arquivo

## 8. Pontos fortes do projeto

- automação de geração de relatórios regulatórios
- grande variedade de layouts e formatos suportados
- integração direta com planilhas Excel
- stack simples e leve para uso local
- multiplicidade de módulos para documentos oficiais do Bacen

## 9. Pontos de atenção e dívida técnica

O código apresenta características de software legado e merece atenção em manutenção futura.

### 9.1 Acoplamento forte

Há grande acoplamento entre:

- mapeamento da planilha
- nome das abas da planilha
- campos do formulário
- regras de serialização e layout final

### 9.2 Duplicação de bootstrap

Há `main.js` e `server.js` realizando inicialização semelhante. Isso pode causar confusão durante rodagem, manutenção e empacotamento.

### 9.3 Validação frágil

A validação é principalmente manual e baseada em string. Há muitos casos onde faltam checagens estruturais mais robustas.

### 9.4 Strings e padronização manual

A lógica de preenchimento com zeros/ espaços é trabalhosa e facilmente sujeita a erros de layout.

### 9.5 Ausência de testes automatizados

Não há suíte de testes visível para validar regras de geração em múltiplos documentos.

### 9.6 Hardcoded values

Há muitos valores fixos, nomes de abas, códigos de documento e campos esperados em arrays, o que aumenta o risco de quebra por mudanças de layout.

## 10. Observações históricas

Os arquivos `ATUALIZACAO_XML_DEVOLUCOES.md` e `REFATORACAO_DATAS.md` mostram que o projeto passou por ajustes produtivos e específicos para as regras de geração do Bacen. Isso indica uma solução construída em ciclos incrementais, com melhorias focadas em conformidade e correções de estrutura.

## 11. Recomendações de evolução

1. criar testes para cada módulo de geração
2. extrair modelos de entrada em objetos tipados
3. centralizar configurações de campos e layouts
4. padronizar nomes de arquivos, abas e campos
5. separar regras de serialização de regras de negócio
6. revisar duplicidade entre `main.js` e `server.js`
7. documentar cada modelo de planilha e sua estrutura esperada

## 12. Resumo executivo

O Erebes é uma ferramenta desktop para transformar planilhas de informação financeira em artefatos padronizados para o Bacen. O sistema reúne UI, backend web local, processamento de Excel e serialização em JSON/XML/TXT. Ele resolve uma necessidade operacional específica e bem definida, mas tem forte característica de solução legacy, com lógica concentrada em scripts e regras manuais.
