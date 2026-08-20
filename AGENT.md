# AGENT – Erebes

## Propósito

Este repositório contém um gerador de arquivos regulatórios para o Banco Central do Brasil. O objetivo do sistema é transformar planilhas Excel em arquivos padronizados em JSON, XML e TXT para envio relacionado a demonstrações financeiras, PVCA, APIX e outros documentos do Bacen.

## Stack principal

- Electron + React
- Express
- Node.js
- convert-excel-to-json
- js2xmlparser
- formidable
- adm-zip

## Estrutura importante

- `main.js` — processo principal do Electron
- `server.js` — servidor Express legado/auxiliar
- `controllers/controller.js` — pontos de entrada HTTP
- `controllers/*.js` — geração de demonstrações financeiras e XML
- `controllers/pvca/*.js` — geração de arquivos TXT para PVCA
- `util/index.js` — utilitários de geração de arquivos temporários e padding
- `validators/validator.js` — funções de preenchimento e validação
- `front/src/` — interface em React
- `docs/DocumentacaoTecnica.md` — documentação técnica detalhada

## Fluxos principais

1. Upload de planilha via formulário multipart
2. Leitura do Excel com `convert-excel-to-json`
3. Transformação dos dados com módulos em `controllers/`
4. Geração de JSON/XML/TXT
5. Download para o usuário ou empacotamento em ZIP

## Regras de trabalho para o agente

- Preservar a compatibilidade com os layouts do Bacen
- Não alterar nomes de abas, campos ou códigos de documento sem verificar impacto
- Manter o padrão usado para padding e serialização de arquivos textuais
- Preferir melhorias incrementais e bem localizadas
- Validar qualquer mudança com entradas reais de planilha quando possível
- Documentar mudanças de regra e estruturas de saída quando houver impacto funcional

## Arquivos de referência

- `README.md`
- `docs/DocumentacaoTecnica.md`
- `REFATORACAO_DATAS.md`
- `ATUALIZACAO_XML_DEVOLUCOES.md`

## Comandos úteis

```bash
npm install
npm start
npm run dist
```

## Observações de manutenção

- O projeto é legado e dependente de layouts rígidos
- Há lógica manual de serialização, padding e conversão
- Há duplicação de bootstrap em `main.js` e `server.js`
- Falta suíte automatizada de testes
- Mudanças em campos do Excel ou no layout do Bacen exigem validação cruzada com exemplos reais

## Objetivo do agente de desenvolvimento

O agente deve evoluir o projeto com foco em:

- qualidade de manutenção
- clareza da estrutura de dados
- redução da complexidade de serialização
- robustez de validação
- documentação e consistência de regras de negócio

Ao propor alterações, priorizar:

- transformação do código legado para padrões mais previsíveis
- extração de utilidades comuns
- testes de regressão para módulos críticos
- documentação do impacto funcional de cada ajuste
