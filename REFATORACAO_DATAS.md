# Refatoração das Datas de Referência

## Resumo das Mudanças

Esta refatoração modifica o comportamento da aplicação para tornar apenas a data **dt1** obrigatória, enquanto todas as outras datas se tornam opcionais. **bp1** e **bp2** foram removidos e o Balanço Patrimonial agora usa **dt1** e **dt2**.

## Arquivos Modificados

### Backend

#### 1. `controllers/controller.js`
- **Mudança**: Criação dinâmica do array `datasBaseReferencia` baseado nos campos preenchidos
- **Antes**: Array fixo com todas as datas (dt1, dt2, dt3, dt4, bp1, bp2)
- **Depois**: Array dinâmico que inclui apenas as datas que foram preenchidas (dt1, dt2, dt3, dt4)
- **Impacto**: Reduz o tamanho do JSON de saída e melhora a flexibilidade

#### 2. `controllers/bp.js`
- **Mudança**: Validação modificada para usar dt1 e dt2 em vez de bp1 e bp2
- **Antes**: Usava bp1 (obrigatória) e bp2 (opcional)
- **Depois**: Usa dt1 (obrigatória) e dt2 (opcional)
- **Impacto**: Padroniza o uso de datas entre todos os demonstrativos

#### 3. `controllers/dre.js`
- **Mudança**: Validação modificada para exigir apenas `Data1` (dt1)
- **Antes**: Exigia `Data1` E `Data2` E `Data3`
- **Depois**: Exige apenas `Data1`, `Data2` e `Data3` são opcionais
- **Impacto**: Permite processar planilhas com apenas uma data de DRE

#### 4. `controllers/dfc.js`
- **Mudança**: Validação modificada para exigir apenas `Data1` (dt1)
- **Antes**: Exigia `Data1` E `Data2` E `Data3`
- **Depois**: Exige apenas `Data1`, `Data2` e `Data3` são opcionais
- **Impacto**: Permite processar planilhas com apenas uma data de DFC

#### 5. `controllers/dra.js`
- **Mudança**: Validação modificada para exigir apenas `Data1` (dt1)
- **Antes**: Exigia `Data1` E `Data2` E `Data3`
- **Depois**: Exige apenas `Data1`, `Data2` e `Data3` são opcionais
- **Impacto**: Permite processar planilhas com apenas uma data de DRA

#### 6. `controllers/dmpl.js`
- **Mudança**: Validação modificada para exigir apenas `Data1` (dt1)
- **Antes**: Exigia pelo menos uma das datas (`Data1` OU `Data2` OU `Data3` OU `Data4`)
- **Depois**: Exige apenas `Data1`, todas as outras são opcionais
- **Impacto**: Padroniza o comportamento com os outros demonstrativos

### Frontend

#### 7. `front/src/views/BacenJson.js`
- **Mudança**: Removidos campos bpdate1 e bpdate2
- **Mudança**: Labels atualizados para indicar campos obrigatórios e opcionais
- **Adição**: Validação no frontend para campos obrigatórios
- **Impacto**: Interface simplificada e mais clara sobre quais campos são obrigatórios

## Regras de Validação

### Campos Obrigatórios
- **dt1** (database1): Data Referência 1 - Obrigatória para todos os demonstrativos (BP, DRE, DFC, DRA, DMPL)

### Campos Opcionais
- **dt2** (database2): Data Referência 2 - Usada por todos os demonstrativos
- **dt3** (database3): Data Referência 3 - Usada por DRE, DFC, DRA, DMPL
- **dt4** (database4): Data Referência 4 - Usada apenas por DMPL

### Campos Removidos
- **bp1** (bpdate1): Data especial BP 1 - Removida, agora usa dt1
- **bp2** (bpdate2): Data especial BP 2 - Removida, agora usa dt2

## Correção Importante: valoresIndividualizados

### Problema Identificado
O atributo `valoresIndividualizados` estava incluindo referências de datas mesmo quando o usuário não preenchia os campos correspondentes no formulário.

### Solução Implementada
Agora o sistema verifica se o campo foi preenchido no formulário (`fields.databaseX`) antes de incluir a referência no `valoresIndividualizados`:

```javascript
// Antes: Incluía se o valor existia na planilha
if (x.Data1 || x.Data1 == 0) {
    valoresIndividualizados.push({
        "@dtBase": "dt1",
        "@valor": x.Data1
    });
}

// Depois: Só inclui se foi preenchido no formulário E existe na planilha
if (fields.database1 && (x.Data1 || x.Data1 == 0)) {
    valoresIndividualizados.push({
        "@dtBase": "dt1",
        "@valor": x.Data1
    });
}
```

### Impacto da Correção
- **Consistência**: O JSON de saída agora reflete exatamente quais datas foram solicitadas
- **Flexibilidade**: Usuário pode escolher quais datas processar
- **Eficiência**: Reduz o tamanho do JSON quando não todas as datas são necessárias

## Benefícios da Refatoração

1. **Simplicidade**: Redução de campos e padronização do uso de datas
2. **Flexibilidade**: Permite processar planilhas com diferentes quantidades de datas
3. **Eficiência**: Reduz o tamanho do JSON de saída quando não todas as datas são necessárias
4. **Usabilidade**: Interface mais simples e clara sobre quais campos são obrigatórios
5. **Manutenibilidade**: Código mais limpo e consistente entre os demonstrativos
6. **Consistência**: valoresIndividualizados agora respeita as escolhas do usuário

## Compatibilidade

- **Retrocompatibilidade**: Planilhas com todas as datas continuam funcionando normalmente
- **Novos casos**: Planilhas com apenas dt1 agora são aceitas
- **Validação**: Frontend e backend validam os campos obrigatórios
- **Migração**: Campos bp1 e bp2 foram removidos, agora BP usa dt1 e dt2

## Testes Recomendados

1. Testar com planilha contendo apenas dt1
2. Testar com planilha contendo dt1 e dt2
3. Testar com planilha contendo todas as datas (dt1, dt2, dt3, dt4)
4. Verificar se o JSON de saída contém apenas as datas preenchidas
5. Validar se a interface mostra claramente os campos obrigatórios
6. Confirmar que BP agora usa dt1 e dt2 em vez de bp1 e bp2
7. **NOVO**: Verificar se valoresIndividualizados só inclui datas preenchidas no formulário
