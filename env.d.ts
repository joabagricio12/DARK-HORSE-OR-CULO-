/**
 * Estende a definição global do NodeJS para reconhecer a API_KEY no process.env.
 * Isso resolve conflitos de redeclaração em ambientes que já possuem @types/node.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
