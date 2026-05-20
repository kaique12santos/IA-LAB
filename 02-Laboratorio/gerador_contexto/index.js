import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

// Função para gerar o cabeçalho base do prompt
const generateHeader = (projectName, stack) => `
# CONTEXT PACK — ${projectName.toUpperCase()}
## Otimizado para IA | ${new Date().toLocaleDateString('pt-BR')}

---

## BLOCO 0 — PROMPT DE SISTEMA (Cole separado do contexto)

Você é um Engenheiro de Software Sênior atuando no projeto ${projectName}.
Nossa Stack principal: ${stack}.

REGRAS INVIOLÁVEIS:
1. Arquitetura: [EX: MVC, Clean Architecture, Separation of Concerns].
2. Regra de negócio SOMENTE na camada X [EX: Service].
3. O Controller deve ser fino, apenas recebendo requisições e delegando.
4. Validação de dados deve ocorrer ANTES de chegar ao Controller [EX: via Zod].
5. Siga sempre as Regras de Negócio e a Estrutura de Banco de Dados que enviarei nos blocos a seguir.

Aguarde eu enviar os "Blocos de Contexto". Responda apenas "Entendido, aguardando contexto" até que eu peça para você codificar algo.

---
`;
// [NOVO] Função para coletar o Schema do Banco em formato simplificado
async function collectSchema() {
    const tables = [];
    let addMore = true;

    console.log(`\n--- Preenchendo: SCHEMA DO BANCO ---`);

    while (addMore) {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'tableName',
                message: 'Qual o nome da tabela? (ex: users):',
                validate: input => input.trim() !== '' ? true : 'O nome da tabela não pode ser vazio.'
            },
            {
                type: 'input',
                name: 'columns',
                message: 'Quais são as colunas/campos? (ex: id (int), name (varchar(255)), email (varchar(255)), role (ENUM admin, user)):',
                validate: input => input.trim() !== '' ? true : 'Os campos não podem ser vazios.'
            }
        ]);

        tables.push(`${answers.tableName.trim().toLowerCase()} -> ${answers.columns.trim()}`);

        const { continueAdding } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continueAdding',
                message: 'Deseja adicionar mais uma tabela ao schema?',
                default: false
            }
        ]);

        addMore = continueAdding;
    }

    return tables.map(t => t).join('\n');
}

// [NOVO] Função para coletar Regras de Negócio com indexador automático (RN-01, RN-02...)
async function collectBusinessRules() {
    const rules = [];
    let addMore = true;
    let index = 1;

    console.log(`\n--- Preenchendo: REGRAS DE NEGÓCIO INVIOLÁVEIS ---`);

    while (addMore) {
        const currentTag = `RN-${String(index).padStart(2, '0')}`;
        
        const { description } = await inquirer.prompt([
            {
                type: 'input',
                name: 'description',
                message: `Digite a regra para ${currentTag}:`,
                validate: input => input.trim() !== '' ? true : 'A descrição da regra não pode ser vazia.'
            }
        ]);

        rules.push(`${currentTag} | ${description.trim()}\n`);
        index++;

        const { continueAdding } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continueAdding',
                message: 'Deseja adicionar mais uma regra de negócio?',
                default: false
            }
        ]);

        addMore = continueAdding;
    }

    return rules.join('\n');
}

// Função auxiliar para coletar itens em loop (O "Switch Case" dinâmico)
async function collectItems(blockName, promptMsg) {
    const items = [];
    let addMore = true;

    console.log(`\n--- Preenchendo: ${blockName} ---`);
    
    while (addMore) {
        const { item } = await inquirer.prompt([
            {
                type: 'input',
                name: 'item',
                message: promptMsg,
            }
        ]);
        
        if (item.trim() !== '') items.push(item);

        const { continueAdding } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continueAdding',
                message: 'Deseja adicionar mais um item neste bloco?',
                default: false
            }
        ]);
        
        addMore = continueAdding;
    }
    
    return items.map(i => `- ${i}`).join('\n');
}

async function main() {
    console.log('🤖 Bem-vindo ao Gerador de Contexto do IA-LAB!\n');

    // 1. Coleta os dados básicos
    const basicInfo = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Qual o nome do projeto?',
            default: 'Meu Projeto'
        },
        {
            type: 'input',
            name: 'stack',
            message: 'Qual a stack tecnológica (ex: Node.js, Express, MySQL)?',
        },
        {
            type: 'rawlist',
            name: 'mode',
            message: 'Como você prefere preencher o documento?',
            choices: [
                { name: 'Modo Rápido (Apenas gera o esqueleto para eu editar no VS Code)', value: 'fast' },
                { name: 'Modo Completo (Preencher os blocos agora pelo terminal)', value: 'full' }
            ]
        }
    ]);

    let content = generateHeader(basicInfo.projectName, basicInfo.stack);

    // 2. Lida com o modo escolhido
    if (basicInfo.mode === 'fast') {
        content += `
## BLOCO 1 — ESTADO DE IMPLEMENTAÇÃO
[Preencha aqui o que está pronto e o que falta]

## BLOCO 2 — MAPA DA APLICAÇÃO
[Liste suas rotas e telas aqui]

## BLOCO 3 — SCHEMA DO BANCO
[Cole a estrutura das tabelas aqui no formato: tabela -> campo1, campo2]

## BLOCO 4 — PADRÕES DE CÓDIGO
[Cole um snippet de código de exemplo aqui]

## BLOCO 5 — REGRAS DE NEGÓCIO INVIOLÁVEIS
RN-01 | [Mude a descrição da regra]
`;
    } else {
        // Modo Completo - Loop de perguntas
        const estadoImplementacao = await collectItems('ESTADO DE IMPLEMENTAÇÃO', 'Digite uma task ou status atual (ex: Login funcional):');
        const dbSchema = await collectSchema();
        const regrasNegocio = await collectBusinessRules();
        
        content += `\n## BLOCO 1 — ESTADO DE IMPLEMENTAÇÃO\n${estadoImplementacao}\n`;
        content += `\n## BLOCO 2 — MAPA DA APLICAÇÃO\n[Preencher no arquivo se necessário]\n`;
        content += `\n## BLOCO 3 — SCHEMA DO BANCO\n\`\`\`\n${dbSchema}\n\`\`\`\n`;
        content += `\n## BLOCO 4 — PADRÕES DE CÓDIGO\n[Preencher no arquivo se necessário]\n`;
        content += `\n## BLOCO 5 — REGRAS DE NEGÓCIO INVIOLÁVEIS\n${regrasNegocio}\n`;
    }

    const fileName = `context_${basicInfo.projectName.toLowerCase().replace(/\s+/g, '_')}.md`;
    const outputPath = path.join(process.cwd(), fileName);
    
    fs.writeFileSync(outputPath, content);
    
    console.log(`\n✅ Sucesso! Arquivo '${fileName}' gerado na pasta atual.`);
    console.log(`Abra o arquivo no VS Code para finalizar os detalhes.`);
}

main().catch(console.error);