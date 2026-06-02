# PetSave - Frontend Expo Go + APIs PHP

Aplicativo mobile para reportar animais perdidos ou feridos, com login, câmera, localização por mapa, parceiros/ONGs e perfil do usuário.

## 1. Banco de dados

1. Abra o XAMPP e inicie **Apache** e **MySQL**.
2. No navegador, acesse `http://localhost/phpmyadmin`.
3. Crie/atualize o banco executando o arquivo:

```sql
database/petsave_atualizacao.sql
```

Esse script cria as tabelas `usuario`, `chamado` e `parceiro`, além de inserir dois parceiros de exemplo.

## 2. APIs PHP

Copie a pasta `backend_php` para dentro da pasta do XAMPP:

```txt
C:\xampp\htdocs\petsave
```

A estrutura deve ficar assim:

```txt
C:\xampp\htdocs\petsave\db.php
C:\xampp\htdocs\petsave\login_usuario.php
C:\xampp\htdocs\petsave\salvar_usuario.php
C:\xampp\htdocs\petsave\salvar_chamado.php
C:\xampp\htdocs\petsave\listar_chamados.php
C:\xampp\htdocs\petsave\atualizar_status_chamado.php
C:\xampp\htdocs\petsave\listar_parceiros.php
C:\xampp\htdocs\petsave\uploads\
```

No arquivo `backend_php/db.php`, ajuste usuário e senha do MySQL se necessário. No XAMPP normalmente fica:

```php
$user = 'root';
$pass = '';
```

Teste no navegador:

```txt
http://localhost/petsave/listar_chamados.php
http://localhost/petsave/listar_parceiros.php
```

## 3. Configurar o IP no aplicativo

No VSCode, abra:

```txt
src/api/config.ts
```

Troque o IP pelo IP do seu computador na mesma rede do celular:

```ts
export const API_BASE_URL = 'http://192.168.2.136/petsave';
```

Para descobrir o IP no Windows:

```bash
ipconfig
```

Use o IPv4 da sua rede Wi-Fi. No celular com Expo Go, `localhost` não funciona, porque `localhost` seria o próprio celular.

## 4. Instalar e rodar no Expo Go

Dentro da pasta do projeto:

```bash
npm install
npx expo start
```

Depois escaneie o QR Code com o Expo Go.

Se o Expo avisar sobre versões incompatíveis, rode:

```bash
npx expo install --fix
```

## 5. Funcionalidades prontas

- Tela de login e cadastro.
- Home com reportes ativos de animais perdidos e feridos.
- Filtro por Todos, Perdidos e Feridos.
- Aba Emergências mostrando apenas animais feridos e abertos.
- Aba ONGs e Empresas puxando dados da tabela `parceiro`.
- Aba Perfil com dados do usuário, estatísticas e reportes próprios.
- Botão para marcar reporte como resolvido.
- Tela de novo reporte com câmera obrigatória opcional, mapa e localização atual.
- Envio de foto por `multipart/form-data` para a API PHP.

## 6. Observações importantes

- O reporte resolvido deixa de aparecer na Home e na aba Emergências, mas continua aparecendo em Perfil.
- O contato exibido no card vem da tabela `usuario`, usando telefone e e-mail do usuário que criou o reporte.
- A foto é salva na pasta `uploads` dentro das APIs PHP.
- Para testar em celular físico, o PC e o celular precisam estar na mesma rede Wi-Fi.
