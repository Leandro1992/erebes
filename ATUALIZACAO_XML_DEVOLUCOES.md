# Atualização da Estrutura de Devoluções no XML

## Resumo das Mudanças

Esta atualização modifica a estrutura de devoluções no arquivo `controllers/xml.js` para atender ao novo padrão XML exigido, onde as devoluções agora usam elementos filhos em vez de atributos simples.

## Mudanças Implementadas

### 1. Estrutura de Devoluções

#### **ANTES:**
```xml
<Devolucoes QtdDevolucoes='100' ValorDevolucoes='10000'/>
```

#### **DEPOIS:**
```xml
<Devolucoes>
    <Devolucao>
        <QtdDevolucoes>787</QtdDevolucoes>
        <ValorDevolucoes>4563.63</ValorDevolucoes>
        <DetalhamentoDevolucoes>1</DetalhamentoDevolucoes>
    </Devolucao>
    <Devolucao>
        <QtdDevolucoes>405</QtdDevolucoes>
        <ValorDevolucoes>563.63</ValorDevolucoes>
        <DetalhamentoDevolucoes>2</DetalhamentoDevolucoes>
    </Devolucao>
</Devolucoes>
```

### 2. Mudanças no Código

#### **Estrutura Inicial:**
```javascript
// ANTES
Devolucoes: {
    "@": {
        QtdDevolucoes: 0,
        ValorDevolucoes: 0
    }
}

// DEPOIS
Devolucoes: {
    Devolucao: []
}
```

#### **Processamento das Devoluções:**
```javascript
// ANTES
for (const i of sheets.Devolucoes) {
    if (!i.processar || i.processar != 'N') {
        finalxml.Devolucoes["@"].QtdDevolucoes = i.QtdDevolucoes
        finalxml.Devolucoes["@"].ValorDevolucoes = i.ValorDevolucoes
    }
}

// DEPOIS
for (const i of sheets.Devolucoes) {
    if (!i.processar || i.processar != 'N') {
        finalxml.Devolucoes.Devolucao.push({
            QtdDevolucoes: i.QtdDevolucoes,
            ValorDevolucoes: i.ValorDevolucoes,
            DetalhamentoDevolucoes: i.DetalhamentoDevolucoes || 1
        })
    }
}
```

### 3. Novas Seções Adicionadas

#### **TempoAutorizacoes:**
```javascript
TempoAutorizacoes: {
    "@": {
        Perc95TempoAutorizacao: 0,
    }
}
```

#### **Autorizacoes:**
```javascript
Autorizacoes: {
    Autorizacao: []
}
```

#### **Processamento de Autorizações:**
```javascript
// Processar Autorizações se existir a aba
if (sheets.Autorizacoes) {
    for (const i of sheets.Autorizacoes) {
        if (!i.processar || i.processar != 'N') {
            finalxml.Autorizacoes.Autorizacao.push({
                QtdAutorizacoes: i.QtdAutorizacoes,
                QtdEstoqueAutorizacoes: i.QtdEstoqueAutorizacoes,
                TipoPagador: i.TipoPagador
            })
        }
    }
}
```

#### **Processamento de TempoAutorizacoes:**
```javascript
// TempoAutorizacoes (se existir o índice 14)
if (sheets["Tempos Consultas"][14]) {
    finalxml.TempoAutorizacoes["@"].Perc95TempoAutorizacao = sheets["Tempos Consultas"][14].Valores
}
```

## Campos da Planilha

### **Aba "Devolucoes":**
- `QtdDevolucoes`: Quantidade de devoluções
- `ValorDevolucoes`: Valor das devoluções
- `DetalhamentoDevolucoes`: Detalhamento das devoluções (novo campo)
- `processar`: Flag para processar ou não a linha

### **Aba "Autorizacoes" (nova):**
- `QtdAutorizacoes`: Quantidade de autorizações
- `QtdEstoqueAutorizacoes`: Quantidade em estoque de autorizações
- `TipoPagador`: Tipo do pagador
- `processar`: Flag para processar ou não a linha

### **Aba "Tempos Consultas":**
- Índice 14: `Perc95TempoAutorizacao` (novo campo)

## Benefícios da Atualização

1. **Conformidade**: Atende ao novo padrão XML exigido
2. **Flexibilidade**: Permite múltiplas devoluções com detalhamentos diferentes
3. **Extensibilidade**: Suporte a novas seções (Autorizações e TempoAutorizacoes)
4. **Compatibilidade**: Mantém compatibilidade com planilhas existentes

## Compatibilidade

- **Planilhas existentes**: Continuam funcionando normalmente
- **Novo campo**: `DetalhamentoDevolucoes` é opcional (padrão: 1)
- **Novas abas**: `Autorizacoes` e `TempoAutorizacoes` são opcionais
- **Processamento**: Mantém a lógica de `processar != 'N'`

## Testes Recomendados

1. Testar com planilha contendo apenas devoluções básicas
2. Testar com planilha contendo múltiplas devoluções com detalhamentos
3. Testar com planilha contendo a nova aba de autorizações
4. Testar com planilha contendo o novo campo de tempo de autorizações
5. Verificar se o XML gerado está conforme o novo padrão
6. Validar se planilhas antigas continuam funcionando
