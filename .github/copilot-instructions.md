# Regras Gerais para Gerar Código neste Projeto

## 🎯 Princípios Fundamentais

- Todo o código deve seguir os princípios SOLID, KISS e DRY sem exceção.
- Antes de gerar qualquer código, **analisar com atenção** o que foi pedido e qual a necessidade real.
- Evitar código desnecessário ou duplicado. Priorizar soluções simples e eficientes.
- Escrever código **legível**, **modular** e **reutilizável**.
- Evitar efeitos colaterais e dependências ocultas.

---

## 🚀 Padrões Específicos do Projeto

- **Framework:** Angular 18, utilizando **standalone components** sempre que possível.
- **Bibliotecas de UI:** Priorizar **PrimeNG** e **PrimeFlex** para todos os componentes visuais.
- **Arquitetura:** Modular, com **lazy loading** e **estrutura limpa de pastas**.
- **Design Patterns:** Usar padrões como Factory, Strategy, Builder apenas quando necessário.
- **Testes:** Não gerar código sem prever **testabilidade**.

---

## 🧱 Convenções de Código

### TypeScript

- Todos os **métodos públicos** devem ter o modificador `public` explicitamente.
- Não usar `any` (a não ser que seja extremamente necessário e justificado).
- Não usar `var`. Apenas `const` e `let`.
- **Imports absolutos** devem ser preferidos, com caminhos configurados no `tsconfig.json`.
- Arquivos de componente devem ter nomes kebab-case: `meu-componente.component.ts`.
- **Nomes de métodos e variáveis:** usar camelCase.
- Classes e interfaces: PascalCase.
- **Arquivos sem comentários no código**. Somente **JSDoc** deve ser utilizado.

### HTML e SCSS

- Usar **BEM** para nomes de classes CSS quando necessário.
- Layout e grid devem usar **PrimeFlex**.
- Responsividade obrigatória. Usar `md:`, `lg:`, `xl:` do PrimeFlex.
- Não usar `style` inline, exceto para casos muito específicos.

---

## 📑 Boas Práticas e Restrições

- **Proibido:** jQuery, bibliotecas antigas, e hacks de CSS.
- **Performance:** Sempre otimizar para **ChangeDetectionStrategy.OnPush** quando aplicável.
- **Observabilidade:** Se necessário, usar `RxJS` com `async` e `unsubscribe` correto.
- **Sem comentários no código**. Somente **JSDoc** para descrever:
  - Propósito da classe
  - Parâmetros dos métodos
  - Retorno esperado
- Todo código deve ser **autoexplicativo**. Nomes claros e descritivos.
- Priorizar funções puras e componentes desacoplados.
- Sempre organizar os imports em ordem alfabética.

---

## 📝 Exemplo de JSDoc para Funções e Métodos

```typescript
/**
 * Cria um novo usuário no sistema.
 *
 * @param nome Nome completo do usuário.
 * @param email Email válido.
 * @returns Identificador do usuário criado.
 */
public criarUsuario(nome: string, email: string): string {
  // Implementação
}
```

---

## 🔧 Estrutura de Projeto

- Seguir a estrutura modular estabelecida no projeto
- Componentes devem ser standalone quando possível
- Usar lazy loading para módulos
- Manter separação clara entre:
  - Components (apresentação)
  - Services (lógica de negócio)
  - Guards (proteção de rotas)
  - Interfaces/Schemas (tipos)
  - Resolvers (carregamento de dados)

---

## 🧪 Testes

- Todo código deve ser testável
- Usar Jest como framework de testes
- Manter alta cobertura de testes
- Priorizar testes unitários e de integração
- Mockar dependências externas adequadamente
