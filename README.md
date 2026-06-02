# PetSave - Frontend Expo Go + APIs PHP

Aplicativo mobile desenvolvido em **React Native com Expo Go** para reportar animais perdidos ou feridos. O sistema conta com login, cadastro de usuário, câmera, localização por mapa, parceiros/ONGs, perfil do usuário e salvamento offline com **AsyncStorage**.

Os dados são enviados para uma API em **PHP** e salvos em um banco **MySQL** usando XAMPP/phpMyAdmin. Caso o usuário esteja sem internet, o reporte é salvo localmente no aparelho e sincronizado com o banco quando a conexão voltar.

---

## 1. Banco de dados

1. Abra o **XAMPP**.
2. Inicie os serviços:

```txt
Apache
MySQL
```

3. No navegador, acesse:

```txt
http://localhost/phpmyadmin
```

4. Importe o arquivo SQL:

```txt
database/petsave_atualizacao.sql
```

Esse script cria as tabelas:

```txt
usuario
chamado
parceiro
```

Também insere parceiros de exemplo na tabela `parceiro`.

---

## 2. APIs PHP

Copie a pasta `backend_php` para dentro da pasta `htdocs` do XAMPP.

O caminho final deve ficar assim:

```txt
C:\xampp\htdocs\petsave
```

A estrutura deve ficar parecida com:

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

No arquivo `db.php`, ajuste usuário, senha e porta do MySQL se necessário.

No XAMPP, normalmente fica:

```php
$user = 'root';
$pass = '';
```

Caso o MySQL esteja usando a porta `3307`, configure a conexão com essa porta no `db.php`.

Teste as APIs no navegador:

```txt
http://localhost/petsave/listar_chamados.php
http://localhost/petsave/listar_parceiros.php
```

Se aparecer uma resposta em JSON, a API está funcionando.

---

## 3. Configurar o IP no aplicativo

No VSCode, abra o arquivo:

```txt
src/api/config.ts
```

Troque o IP pelo IP do seu computador na mesma rede do celular:

```ts
export const API_BASE_URL = 'http://192.168.2.104/petsave';
```

Para descobrir o IP no Windows:

1. Abra o **CMD**.
2. Digite:

```bash
ipconfig
```

3. Procure pelo **Endereço IPv4** da sua rede Wi-Fi.

No celular com Expo Go, `localhost` não funciona, porque `localhost` seria o próprio celular. Por isso, é necessário usar o IP do computador.

---

## 4. Instalação do projeto

Dentro da pasta do projeto, execute:

```bash
npm install
```

Depois instale as dependências principais:

```bash
npx expo install expo-camera expo-location react-native-maps expo-status-bar
```

Instale também as dependências de armazenamento offline e verificação de internet:

```bash
npx expo install @react-native-async-storage/async-storage
npx expo install @react-native-community/netinfo
```

Caso necessário, instale as dependências de navegação:

```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
```

E também:

```bash
npx expo install react-native-screens react-native-safe-area-context
```

---

## 5. Como rodar no Expo Go

Para iniciar o projeto, execute:

```bash
npx expo start
```

Depois escaneie o QR Code usando o aplicativo **Expo Go** no celular.

Se houver problema de cache, use:

```bash
npx expo start -c
```

Se houver problema de conexão, tente:

```bash
npx expo start --lan
```

ou:

```bash
npx expo start --tunnel
```

---

## 6. Funcionalidades prontas

- Tela de login.
- Tela de cadastro de usuário.
- Usuários salvos no banco MySQL.
- Home com reportes ativos de animais perdidos e feridos.
- Filtro por Todos, Perdidos e Feridos.
- Aba Emergências mostrando animais feridos e com status aberto.
- Aba ONGs e Empresas puxando dados da tabela `parceiro`.
- Aba Perfil com dados do usuário, estatísticas e reportes próprios.
- Botão para marcar reporte como resolvido.
- Tela de novo reporte.
- Foto usando Expo Camera.
- Localização usando mapa.
- Salvamento de latitude e longitude.
- Envio de foto por `multipart/form-data` para a API PHP.
- Salvamento no banco MySQL.
- Salvamento offline com AsyncStorage.
- Sincronização automática dos reportes offline quando a internet voltar.

---

## 7. Funcionamento offline com AsyncStorage

O projeto utiliza **AsyncStorage** para salvar reportes quando o usuário está sem internet.

Fluxo:

```txt
Usuário cria um reporte
        ↓
App verifica a conexão
        ↓
Se tiver internet:
    envia para API PHP e salva no MySQL

Se não tiver internet:
    salva localmente no AsyncStorage
        ↓
Quando a internet voltar:
    o app sincroniza com a API
    salva no MySQL
    remove o registro pendente do AsyncStorage
```

Arquivos responsáveis pelo offline:

```txt
src/storage/offlineChamados.ts
src/storage/syncChamados.ts
```

O arquivo `offlineChamados.ts` salva, lista e remove reportes offline.

O arquivo `syncChamados.ts` verifica se existe internet e tenta enviar os reportes pendentes para o banco.

---

## 8. Como testar o modo offline

1. Abra o app com internet.
2. Faça login.
3. Desative o Wi-Fi e os dados móveis do celular.
4. Crie um novo reporte.
5. O app deve mostrar uma mensagem informando que o reporte foi salvo offline.
6. Acesse a aba **Perfil**.
7. Deve aparecer um aviso de reporte pendente.
8. Ative a internet novamente.
9. Feche e abra o app ou atualize a tela.
10. O reporte será enviado para o banco MySQL automaticamente.

Depois confira no phpMyAdmin:

```txt
petsave > chamado > Visualizar
```

---

## 9. Observações importantes

- O reporte resolvido deixa de aparecer na Home e na aba Emergências.
- O reporte resolvido continua aparecendo no Perfil do usuário que criou o chamado.
- O contato exibido no card vem da tabela `usuario`, usando telefone e e-mail do usuário que criou o reporte.
- A foto é salva na pasta `uploads` dentro da API PHP.
- Para testar em celular físico, o PC e o celular precisam estar na mesma rede Wi-Fi.
- O app foi pensado principalmente para uso no Expo Go em celular Android/iOS.

---

## 10. Observação sobre Web

Este projeto usa `react-native-maps`.

Essa biblioteca é nativa e pode causar erro ao tentar abrir o app no navegador Web.

Por isso, recomenda-se testar o projeto pelo celular usando o **Expo Go**.

Caso seja necessário rodar no Web, será preciso criar uma versão alternativa do mapa para navegador.

---

## 11. Observação sobre Push Notification

O arquivo de exemplo de Push Notification usa `expo-notifications`.

Porém, nas versões mais recentes do Expo, notificações push no Android não funcionam diretamente no Expo Go.

Para usar notificações push seria necessário gerar uma **development build**.

Como este projeto está sendo executado com Expo Go, o Push Notification não foi mantido como funcionalidade principal.

---

## 12. Possíveis problemas

### A API não responde no celular

Confira se:

- Apache está ligado no XAMPP.
- MySQL está ligado no XAMPP.
- O IP em `src/api/config.ts` está correto.
- O celular e o computador estão na mesma rede Wi-Fi.
- O firewall do Windows não está bloqueando o Apache.

Teste no navegador do celular:

```txt
http://SEU_IP/petsave/listar_chamados.php
```

Exemplo:

```txt
http://192.168.2.104/petsave/listar_chamados.php
```

---

### Tabela não encontrada no banco

Confira se o SQL foi importado corretamente no phpMyAdmin.

Também confira se a porta do MySQL no `db.php` é a mesma usada pelo phpMyAdmin.

Exemplos de portas:

```txt
3306
3307
```

---

### O mapa não funciona no navegador

O `react-native-maps` não funciona corretamente no Web sem adaptação.

Use o Expo Go no celular.

---

### A câmera não abre

Confira se o app Expo Go recebeu permissão para usar a câmera.

No celular, vá nas configurações do aplicativo e permita o uso da câmera.

---

## 13. Autor

Projeto desenvolvido para fins acadêmicos.

Tema: aplicativo mobile para reportar animais perdidos ou feridos, utilizando login, câmera, mapa, banco de dados MySQL, API PHP e armazenamento offline com AsyncStorage.
