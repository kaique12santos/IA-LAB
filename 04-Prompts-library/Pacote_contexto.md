
## 0. Instruções Iniciais (Paciente Zero) – LEIA ANTES DE COMEÇAR

> **PARE!** Não adianta preencher este pacote se você não possui a base documental do seu projeto. O uso de LLMs (GPT, Claude, Gemini) sem contexto estruturado gera "alucinações", código genérico e desperdício de dinheiro/tokens.

### 🛑 Pré-requisitos Obrigatórios
Antes de prosseguir, certifique-se de que você já definiu e tem em mãos:
1.  **Documento de Requisitos:** O que o sistema faz ou deve fazer?
2.  **Modelagem de Dados (ERD):** Quais são as tabelas e relacionamentos?
3.  **Arquitetura de Referência:** Qual o padrão (Cliente-Servidor, MVC, Camadas)?
4.  **Stack Tecnológica:** Quais linguagens e bibliotecas específicas serão usadas?

### 🧠 Por que isso é necessário?
Modelos de linguagem operam sob o princípio **GIGO (Garbage In, Garbage Out)**. Se a entrada for vaga, a saída será inútil (Lixo). Este pacote é um **mapeador de contexto**, não uma ferramenta de criação de ideias do zero, você ainda vai ter que tomar muito café ☕ e entender o seu problema antes de querer usar uma ferramenta de LLM.

### ⚡ Dica de Eficiência (Otimização de tokens)
Para obter 30% mais precisão e economizar até 50% de tokens:
1.  **Preencha este pacote em Português.**
2.  **Traduza o resultado final para Inglês** (utilizando uma ferramenta de tradução ou a própria IA).
    *   *Por que?* Mais de 80% do dataset de treino das IAs de ponta é em inglês. O modelo raciocina melhor, segue instruções complexas com mais rigor e comete menos erros de sintaxe quando operando em inglês.

> *Se você não consegue responder 'Sim' para todos os itens acima, feche este arquivo, planeje sua fundação e volte depois. Você economizará horas de frustração e terapia.*

---

## 1. Instruções Iniciais (O "System Prompt")

Este é o texto que você envia **sozinho** na primeira mensagem. O objetivo dele é "limpar" a memória da IA, definir a *stack* tecnológica, a arquitetura esperada e estabelecer os limites do que ela pode ou não fazer.

**Template do Prompt Inicial:**

```text
Você é um Engenheiro de Software Sênior atuando no projeto [NOME_DO_PROJETO].
Nossa Stack principal: [EX: Node.js/Express, React, MySQL, Zod, JWT].

REGRAS INVIOLÁVEIS:
1. Arquitetura: [EX: MVC, Clean Architecture, Separation of Concerns].
2. Regra de negócio SOMENTE na camada X [EX: Service].
3. O Controller deve ser fino, apenas recebendo requisições e delegando.
4. Validação de dados deve ocorrer ANTES de chegar ao Controller [EX: via Zod].
5. Siga sempre as Regras de Negócio e a Estrutura de Banco de Dados que enviarei nos blocos a seguir.

Aguarde eu enviar os "Blocos de Contexto". Responda apenas "Entendido, aguardando contexto" até que eu peça para você codificar algo.

```

---

## 2. Estrutura de Blocos (Injeção de Contexto)

Após a IA confirmar a primeira mensagem, você envia os blocos. Aqui está o resumo do que cada bloco deve conter em um projeto de desenvolvimento.

**BLOCO 1 — ESTADO DO PROJETO**
Serve para a IA não sugerir recriar a roda. Informa o que já está pronto e o que é a prioridade atual.

**BLOCO 2 — MAPA DA APLICAÇÃO (Superfície da API/Telas)**
Define os "contratos". Mostra quais rotas existem, quais verbos HTTP são usados e quais páginas do frontend consomem essas rotas. Evita que a IA invente rotas que não existem.

**BLOCO 3 — ESTRUTURA DE DADOS (Schema do Banco)**
É o mapa do tesouro. Tabelas, colunas, chaves estrangeiras e tipagens. Se a IA sabe que a tabela de usuários tem campos específicos para `password_reset_token` e `verification_token`, ela não vai tentar criar fluxos de recuperação de senha baseados em suposições.

**BLOCO 4 — PADRÕES DE CÓDIGO**
Onde você cola um *snippet* real de como você gosta que o código seja escrito. Se você prefere tratar erros num formato específico, mostre aqui.

**BLOCO 5 — REGRAS DE NEGÓCIO INVIOLÁVEIS**
A lista de restrições do mundo real. O que o sistema *não* pode permitir de jeito nenhum (ex: um usuário comum não pode deletar um laboratório).

---

## 3. Exemplos de Preenchimento para Devs

Aqui estão exemplos práticos de como preencher esses blocos em seus próximos projetos:

### Exemplo para o BLOCO 3 (Estrutura de Dados)

```text
users -> id (UUID), email (VARCHAR UNIQUE), password_hash (VARCHAR), password_reset_token (VARCHAR NULL), role (ENUM: ADMIN, USER)
posts -> id (UUID), author_id (FK users.id), title (VARCHAR), content (TEXT), published_at (TIMESTAMP)

```

### Exemplo para o BLOCO 4 (Padrões de Código)

```javascript
// Exemplo de Service esperado:
class AuthService {
  async resetPassword(email, token, newPassword) {
    const user = await UserRepository.findByResetToken(token);
    if (!user) throw new AppError('Token inválido ou expirado', 400);
    // ...
  }
}

```

### Exemplo para o BLOCO 5 (Regras de Negócio)

```text
RN-01 | O token de reset de senha expira em exatamente 15 minutos.
RN-02 | Um post só pode ser deletado pelo próprio autor ou por um ADMIN.
RN-03 | Soft delete obrigatório: nunca usar DROP ou DELETE na tabela de usuários, apenas alterar o status para INACTIVE.

```
