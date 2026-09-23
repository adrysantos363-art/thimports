TH IMPORTS V2 — FIREBASE + PAGAMENTOS

Esta versão inclui:
- Visual premium responsivo e logo TH Imports.
- Painel administrativo demonstrativo.
- Cadastro, edição, exclusão, exportação e importação de produtos.
- Integração com Cloud Firestore para enviar e carregar produtos.
- Configuração do Firebase pré-preenchida com os dados públicos do projeto THIMPORTS.
- Campo para chave pública de pagamento.

CONFIGURAR FIREBASE
1. Abra o arquivo firebase-config.js.
2. No Firebase Console, vá em Configurações do projeto > Seus aplicativos > app Web.
3. Copie somente o valor da apiKey e cole em:
   apiKey: "COLE_AQUI_SUA_API_KEY"
4. Abra o index.html pelo Live Server.
5. Entre no Painel admin com a senha demonstrativa 1234.
6. Em Configurações, clique em Conectar Firebase.
7. Use Enviar para Firebase ou Carregar do Firebase.

SEGURANÇA
- A senha 1234 é somente demonstração e deve ser substituída por Firebase Authentication.
- Não coloque secret key, senha ou token privado de pagamento no navegador.
- Configure regras seguras do Firestore antes de usar em produção.
- A integração de pagamento real exige backend/Cloud Functions e depende do gateway escolhido.
