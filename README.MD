# Martin-Auxiliador

O Martin-Auxiliador é uma ferramenta que gera automaticamente a estrutura de arquivos TypeScript com base em um arquivo de schema Prisma. Este projeto facilita a criação de modelos, serviços, controladores e rotas para suas aplicações.

## Funcionalidades

- Geração automática de arquivos `interface.ts`, `schema.ts`, `model.ts`, `service.ts`, `controller.ts` e `router.ts`.
- Integração com Prisma Client para operações de banco de dados.
- Estrutura organizada para facilitar o desenvolvimento e a manutenção.

## Pré-requisitos

- Node.js (versão 14 ou superior)

## Instalação

1. Instale o pacote:
```bash
   npm install -g martin-auxiliador
```

Uso

Para gerar os arquivos a partir de um schema Prisma, execute o seguinte comando:
```bash
martin-auxiliador <caminho_para_o_schema.prisma>
```

Exemplo
```bash

martin-auxiliador ./schema.prisma
```

Estrutura de Diretórios

Após a execução do comando, a estrutura de diretórios será criada no seguinte formato:
```bash
src/
  └── v1/
      └── <nome_do_modelo>/
          ├── interface.ts
          ├── schemas.ts
          ├── model.ts
          ├── service.ts
          ├── controller.ts
          └── router.ts
```

Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.
Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para mais detalhes.
Links Úteis

Confira o código fonte no GitHub: GitHub - [Martin-Auxiliador](https://github.com/RuanVPSantos/MartinAuxiliador)

Para preencher os seus arquivos interface.ts e schema.ts, por favor, acesse o link: [Martin-Auxiliador](https://poe.com/Martin-Auxiliador)