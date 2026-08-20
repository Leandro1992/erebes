# Erebes

Aplicativo desktop para geração de arquivos padronizados do Banco Central do Brasil, com foco em demonstrações financeiras e relatórios de varejo e atendimento, em formatos JSON, XML e TXT.

## Visão geral

O projeto combina:

- Electron + React para a interface desktop
- Express para expor rotas backend locais
- Node.js para processamento e geração de arquivos
- Conversão de planilhas Excel em objetos JavaScript e em estruturas padronizadas
- Geração de arquivos para envio ao Bacen em diferentes formatos e layouts

A aplicação é usada principalmente para transformar dados de planilhas em arquivos finais que podem ser enviados em conformidade com os documentos exigidos pelo Bacen.

## Funcionalidades principais

- Geração de JSON para demonstrações financeiras (BP, DRE, DFC, DRA, DMPL)
- Geração de XML para documentos ASVR 9800 e 9805
- Geração de XML para Saldos Contábeis Diários (4111)
- Geração de XML para APIX 1201
- Geração de pacote ZIP com arquivos PVCA (Pagamentos de Varejo e Canais de Atendimento)
- Processamento de planilhas em Excel e exportação final em formatos exigidos

## Stack

- Node.js
- Electron 9
- React + Material UI
- Express 4
- js2xmlparser
- convert-excel-to-json
- formidable
- adm-zip

## Estrutura do repositório

- `main.js` — processo principal do Electron
- `server.js` — servidor Express auxiliar/duplicado
- `controllers/` — regras de geração dos arquivos
- `util/` — helpers para arquivos temporários, padding e escrita em TXT
- `validators/` — utilitários de validação e preenchimento de campos
- `front/` — interface em React
- `docs/` — documentação técnica do projeto

## Como executar

```bash
npm install
npm start
```

Para empacotar a aplicação:

```bash
npm run dist
```

## Documentação

- [Documentação técnica](/docs/DocumentacaoTecnica.md)
- [Contexto para agente de desenvolvimento](AGENT.md)

## Observações importantes

Este é um projeto legado, com lógica muito orientada a regras fixas do Bacen, geração de arquivos textuais e conversão de planilhas. A manutenção deve considerar que há forte acoplamento entre:

- estrutura da planilha
- campos de formulário
- regras de padding/serialização
- XML/JSON específicos do Bacen

## Licença

[CC0 1.0 (Public Domain)](LICENSE.md)
