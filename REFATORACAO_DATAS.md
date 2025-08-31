# Refatoração das Datas de Referência

## Resumo das Mudanças

Esta refatoração modifica o comportamento da aplicação para tornar apenas as datas **dt1** e **bp1** obrigatórias, enquanto todas as outras datas se tornam opcionais.

## Arquivos Modificados

### Backend

#### 1. `controllers/controller.js`
- **Mudança**: Criação dinâmica do array `datasBaseReferencia` baseado nos campos preenchidos
- **Antes**: Array fixo com todas as datas (dt1, dt2, dt3, dt4, bp1, bp2)
- **Depois**: Array dinâmico que inclui apenas as datas que foram preenchidas
- **Impacto**: Reduz o tamanho do JSON de saída e melhora a flexibilidade

#### 2. `controllers/bpfix.js`
- **Mudança**: Validação modificada para exigir apenas `Data1Ativo` (bp1)
- **Antes**: Exigia `Data1Ativo` E `Data2Ativo`
- **Depois**: Exige apenas `Data1Ativo`, `Data2Ativo` é opcional
- **Impacto**: Permite processar planilhas com apenas uma data de BP

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
- **Mudança**: Labels atualizados para indicar campos obrigatórios e opcionais
- **Adição**: Validação no frontend para campos obrigatórios
- **Impacto**: Melhora a experiência do usuário com feedback claro

## Regras de Validação

### Campos Obrigatórios
- **dt1** (database1): Data Referência 1 - Obrigatória para todos os demonstrativos
- **bp1** (bpdate1): Data especial BP 1 - Obrigatória para Balanço Patrimonial

### Campos Opcionais
- **dt2** (database2): Data Referência 2
- **dt3** (database3): Data Referência 3  
- **dt4** (database4): Data Referência 4 (apenas para DMPL)
- **bp2** (bpdate2): Data especial BP 2

## Benefícios da Refatoração

1. **Flexibilidade**: Permite processar planilhas com diferentes quantidades de datas
2. **Eficiência**: Reduz o tamanho do JSON de saída quando não todas as datas são necessárias
3. **Usabilidade**: Interface mais clara sobre quais campos são obrigatórios
4. **Manutenibilidade**: Código mais limpo e consistente entre os demonstrativos

## Compatibilidade

- **Retrocompatibilidade**: Planilhas com todas as datas continuam funcionando normalmente
- **Novos casos**: Planilhas com apenas dt1 e bp1 agora são aceitas
- **Validação**: Frontend e backend validam os campos obrigatórios

## Testes Recomendados

1. Testar com planilha contendo apenas dt1 e bp1
2. Testar com planilha contendo todas as datas
3. Testar com planilha contendo algumas datas opcionais
4. Verificar se o JSON de saída contém apenas as datas preenchidas
5. Validar se a interface mostra claramente os campos obrigatórios
