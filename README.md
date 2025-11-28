✅ README.md – Cosmic Slice Explorer (Planet Pizza)

**Pronto para colar no seu GitHub:

https://github.com/FabianoMagoga/cosmic-slice-explorer**

⸻

🌌 Cosmic Slice Explorer – Planet Pizza

Interface completa e imersiva inspirada no Sistema Solar, permitindo que clientes explorem pizzas, bebidas, combos e promoções de forma interativa.
Inclui também área administrativa profissional, com gerenciamento total de produtos, pedidos, combos, cupons, funcionários e faturamento.

⸻

🚀 ✨ Demonstração

Acesse: https://cosmic-slice-explorer.vercel.app
(ou o link que você tiver configurado)

⸻

📂 Tecnologias utilizadas
	•	React + Vite
	•	TypeScript
	•	TailwindCSS + ShadCN UI
	•	Supabase (Banco de dados + Autenticação + Storage)
	•	React Query
	•	Lucide Icons
	•	Supabase Edge Functions para login seguro
	•	LocalStorage para carrinho e pedido finalizado

⸻

🛰️ Funcionalidades

🪐 Setor do Cliente

✔ Sistema Solar animado
✔ Navegação por planetas
✔ Cardápio completo dividido por categorias
	•	Terra → Pizzas Salgadas
	•	Marte → Pizzas Doces
	•	Netuno → Bebidas
	•	Júpiter → Combos Premium
	•	Mercúrio → Promoções Relâmpago

✔ Carrinho de compras
✔ Checkout com envio automático via WhatsApp
✔ Tela de pedido finalizado
✔ Tema totalmente cósmico

⸻

👨‍🚀 Área Administrativa

✔ Login seguro com edge function + senha hash
✔ CRUD completo de:
	•	Produtos
	•	Combos
	•	Pedidos
	•	Cupons
	•	Funcionários
	•	Faturamento
	•	Configurações da pizzaria

✔ Relatório de vendas + exportação CSV
✔ Botões funcionais em todas as telas
✔ Painel profissional e responsivo

⸻

🔧 Como rodar o projeto localmente

git clone https://github.com/FabianoMagoga/cosmic-slice-explorer
cd cosmic-slice-explorer
npm install
npm run dev


⸻

🔑 Configuração do Supabase

Crie um arquivo .env na raiz do projeto com:

VITE_SUPABASE_URL=cole_aqui
VITE_SUPABASE_ANON_KEY=cole_aqui

Se você usa função de admin-auth:

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

(O service role é usado apenas na edge function, nunca no frontend.)

⸻

⚙️ Build para produção

npm run build

Saída ficará na pasta /dist.
Você pode subir na Vercel, Netlify, AWS S3 ou qualquer host estático.

⸻

🧪 Testes recomendados
	•	Navegar entre planetas
	•	Adicionar itens ao carrinho
	•	Finalizar pedido pelo WhatsApp
	•	Testar login / logout admin
	•	Cadastrar produto, combo, cupom e funcionário
	•	Gerar relatório de vendas

⸻

📁 Estrutura do projeto (simplificada)

src/
 ├─ pages/
 │   ├─ Index.tsx
 │   ├─ Menu.tsx
 │   ├─ AdminPanel.tsx
 │   ├─ AdminProdutos.tsx
 │   ├─ AdminPedidos.tsx
 │   ├─ ...
 │
 ├─ components/
 ├─ contexts/
 ├─ integrations/
 │   └─ supabase/
 │       └─ client.ts
 │
 ├─ assets/
 │   ├─ pizza-menu.png
 │   ├─ sons/
 │   ├─ planetas/
 │
 ├─ functions/ (opc.)
 │   └─ admin-auth/
 │       └─ index.ts


⸻

📄 Licença

Este projeto é de uso acadêmico e pessoal de Fabiano Magoga.



📬 Autores 

Anderson Leal de Sousa
Fabiano Eder Magoga
Gabriel Ribeiro Azevedo
Igor Gabrile Oliveira Alvez 
Marilia Oliveira Sena 

⸻

