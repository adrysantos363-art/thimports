TH IMPORTS V2 — FIREBASE + PAGAMENTOS

Incluído:
- Campo de chave/token público de pagamento no painel.
- Campos de configuração do Firebase.
- Conectar ao Firebase Firestore.
- Enviar produtos e configurações para o Firestore.
- Carregar produtos e configurações do Firestore.
- Logo TH Imports atualizada.

IMPORTANTE SOBRE PAGAMENTOS:
- O campo foi criado para CHAVE PÚBLICA/TOKEN PÚBLICO do gateway.
- Nunca coloque secret key, senha ou token privado no front-end ou no Firestore.
- Para cobrar de verdade, use o backend/Cloud Functions do gateway e valide pagamentos no servidor.
- A integração efetiva depende do gateway escolhido (Mercado Pago, Stripe, PagBank etc.).

IMPORTANTE SOBRE FIREBASE:
1. Crie um projeto no Firebase.
2. Ative o Firestore Database.
3. Copie as configurações do app Web para o painel.
4. Configure Firebase Authentication para produção.
5. Configure regras do Firestore; não deixe gravação pública em produção.
6. O login 1234 é apenas demonstrativo e não é seguro para uma loja real.

Como abrir:
- Extraia o ZIP.
- Abra a pasta no VS Code.
- Execute index.html com Live Server.
