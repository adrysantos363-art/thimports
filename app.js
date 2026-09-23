const DEFAULT_PRODUCTS = [
  {id:1,name:"Sauvage Inspired",category:"masculino",price:289.90,tag:"MAIS VENDIDO",description:"Fragrância masculina intensa e elegante.",image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85"},
  {id:2,name:"Noir Signature",category:"masculino",price:249.90,tag:"NOVO",description:"Aroma sofisticado para ocasiões especiais.",image:"https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=85"},
  {id:3,name:"Golden Essence",category:"unissex",price:319.90,tag:"PROMOÇÃO",description:"Notas envolventes com toque luxuoso.",image:"https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=900&q=85"},
  {id:4,name:"Blue Élégance",category:"masculino",price:279.90,tag:"",description:"Frescor e presença para todos os dias.",image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85"},
  {id:5,name:"Rose Velvet",category:"feminino",price:229.90,tag:"NOVO",description:"Floral delicado com personalidade.",image:"https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=85"},
  {id:6,name:"Bloom Collection",category:"feminino",price:259.90,tag:"",description:"Elegância floral para momentos marcantes.",image:"https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=900&q=85"},
  {id:7,name:"Oud Reserve",category:"unissex",price:349.90,tag:"EXCLUSIVO",description:"Perfume marcante com perfil sofisticado.",image:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=900&q=85"},
  {id:8,name:"Black Edition",category:"unissex",price:299.90,tag:"",description:"Uma assinatura profunda e contemporânea.",image:"https://images.unsplash.com/photo-1595535373192-fc8935bacd89?auto=format&fit=crop&w=900&q=85"}
];

const ADMIN_PASSWORD = "1234"; // TROQUE antes de publicar.
let products = JSON.parse(localStorage.getItem("th_products_v2") || "null") || DEFAULT_PRODUCTS;
let cart = JSON.parse(localStorage.getItem("th_cart_v2") || "[]");
let settings = JSON.parse(localStorage.getItem("th_settings_v2") || "null") || {
  whatsapp:"5521999999999",
  instagram:"loja_perfumes",
  email:"contato@thimports.com",
  paymentPublicKey:"",
  firebase:{
    apiKey:"",
    authDomain:"",
    projectId:"",
    storageBucket:"",
    messagingSenderId:"",
    appId:""
  }
};
let activeCategory = "todos";
let searchTerm = "";
let editingId = null;

const $ = id => document.getElementById(id);
const money = value => Number(value).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const saveProducts = () => localStorage.setItem("th_products_v2",JSON.stringify(products));
const saveCart = () => localStorage.setItem("th_cart_v2",JSON.stringify(cart));
const saveSettings = () => localStorage.setItem("th_settings_v2",JSON.stringify(settings));

function renderProducts(){
  let list = products.filter(p => (activeCategory==="todos" || p.category===activeCategory) && (`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(searchTerm)));
  const sort = $("sortProducts").value;
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
  $("products").innerHTML = list.length ? list.map(p=>`
    <article class="product">
      <div class="product-photo"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy">${p.tag?`<span class="tag">${escapeHtml(p.tag)}</span>`:""}</div>
      <div class="product-info"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description)}</p>
      <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" onclick="addToCart(${p.id})">Adicionar +</button></div></div>
    </article>`).join("") : `<p style="grid-column:1/-1;text-align:center;color:#999">Nenhum produto encontrado.</p>`;
}

function escapeHtml(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({...p,qty:1});saveCart();renderCart();openModal("cartModal");}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function renderCart(){
  $("cartBadge").textContent=cart.reduce((s,x)=>s+x.qty,0);
  $("cartItems").innerHTML=cart.length?cart.map(p=>`<div class="cart-row"><span>${escapeHtml(p.name)} × ${p.qty}</span><span>${money(p.price*p.qty)} <button onclick="removeFromCart(${p.id})">×</button></span></div>`).join(""):`<p class="muted">Seu carrinho está vazio.</p>`;
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);$("cartTotal").textContent=money(total);
  const message=cart.length?"Olá! Quero finalizar meu pedido:%0A"+cart.map(p=>`- ${p.name} (${p.qty}x): ${money(p.price*p.qty)}`).join("%0A")+`%0ATotal: ${money(total)}`:"Olá! Quero conhecer o catálogo da TH Imports.";
  $("checkout").href=`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
}
function openModal(id){$(id).classList.remove("hidden")}
function closeModal(id){$(id).classList.add("hidden")}

document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.add("hidden")}));
$("openCart").addEventListener("click",()=>openModal("cartModal"));
$("openSearch").addEventListener("click",()=>{openModal("searchModal");$("searchField").focus()});
$("searchField").addEventListener("input",e=>{searchTerm=e.target.value.toLowerCase().trim();renderProducts();});
$("sortProducts").addEventListener("change",renderProducts);
document.querySelectorAll(".category").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));btn.classList.add("active");activeCategory=btn.dataset.category;renderProducts();}));
$("menuBtn").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>$("mainNav").classList.remove("open")));

$("openAdmin").addEventListener("click",()=>openModal("loginModal"));
$("loginBtn").addEventListener("click",()=>{
  if($("adminPassword").value===ADMIN_PASSWORD){$("loginError").textContent="";closeModal("loginModal");openModal("adminModal");renderAdmin();loadSettings();}
  else $("loginError").textContent="Senha incorreta.";
});
$("adminPassword").addEventListener("keydown",e=>{if(e.key==="Enter")$("loginBtn").click()});
$("logoutBtn").addEventListener("click",()=>closeModal("adminModal"));

document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");
  document.querySelectorAll(".tab-content").forEach(x=>x.classList.add("hidden"));$(t.dataset.tab).classList.remove("hidden");
}));
function renderAdmin(){
  $("adminProductList").innerHTML=products.map(p=>`<div class="admin-item"><div class="admin-item-info"><img src="${escapeHtml(p.image)}" alt=""><div><strong>${escapeHtml(p.name)}</strong><small>${money(p.price)} • ${p.category}</small></div></div><div class="admin-item-actions"><button class="secondary-btn" onclick="editProduct(${p.id})">Editar</button><button class="secondary-btn" onclick="deleteProduct(${p.id})">Excluir</button></div></div>`).join("");
}
function resetForm(){$("productForm").classList.add("hidden");$("editId").value="";$("pName").value="";$("pCategory").value="masculino";$("pPrice").value="";$("pTag").value="";$("pImage").value="";$("pDescription").value="";editingId=null;}
$("newProduct").addEventListener("click",()=>{resetForm();$("formTitle").textContent="Cadastrar produto";$("productForm").classList.remove("hidden");});
$("cancelForm").addEventListener("click",resetForm);
window.editProduct=id=>{
  const p=products.find(x=>x.id===id);if(!p)return;editingId=id;$("formTitle").textContent="Editar produto";$("editId").value=id;$("pName").value=p.name;$("pCategory").value=p.category;$("pPrice").value=p.price;$("pTag").value=p.tag;$("pImage").value=p.image;$("pDescription").value=p.description;$("productForm").classList.remove("hidden");
};
window.deleteProduct=id=>{if(confirm("Excluir este produto?")){products=products.filter(p=>p.id!==id);saveProducts();renderProducts();renderAdmin();}};
$("productForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data={id:editingId||Date.now(),name:$("pName").value.trim(),category:$("pCategory").value,price:Number($("pPrice").value),tag:$("pTag").value.trim(),image:$("pImage").value.trim(),description:$("pDescription").value.trim()};
  if(editingId)products=products.map(p=>p.id===editingId?data:p);else products.push(data);
  saveProducts();renderProducts();renderAdmin();resetForm();
});
$("exportProducts").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify(products,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="produtos-th-imports.json";a.click();URL.revokeObjectURL(a.href);
});
$("importProducts").addEventListener("change",e=>{
  const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!Array.isArray(data))throw new Error();products=data;saveProducts();renderProducts();renderAdmin();alert("Produtos importados.");}catch{alert("Arquivo JSON inválido.");}};reader.readAsText(file);
});
function loadSettings(){
  $("settingWhatsapp").value=settings.whatsapp||"";
  $("settingInstagram").value=settings.instagram||"";
  $("settingEmail").value=settings.email||"";
  $("settingPaymentPublicKey").value=settings.paymentPublicKey||"";
  const fb=settings.firebase||{};
  $("fbApiKey").value=fb.apiKey||"";
  $("fbAuthDomain").value=fb.authDomain||"";
  $("fbProjectId").value=fb.projectId||"";
  $("fbStorageBucket").value=fb.storageBucket||"";
  $("fbMessagingSenderId").value=fb.messagingSenderId||"";
  $("fbAppId").value=fb.appId||"";
}
$("saveSettings").addEventListener("click",()=>{
  settings={
    whatsapp:$("settingWhatsapp").value.replace(/\D/g,""),
    instagram:$("settingInstagram").value.replace("@","").trim(),
    email:$("settingEmail").value.trim(),
    paymentPublicKey:$("settingPaymentPublicKey").value.trim(),
    firebase:{
      apiKey:$("fbApiKey").value.trim(),
      authDomain:$("fbAuthDomain").value.trim(),
      projectId:$("fbProjectId").value.trim(),
      storageBucket:$("fbStorageBucket").value.trim(),
      messagingSenderId:$("fbMessagingSenderId").value.trim(),
      appId:$("fbAppId").value.trim()
    }
  };
  saveSettings();
  renderCart();
  setFirebaseStatus("Configurações salvas neste navegador.");
  alert("Configurações salvas localmente.");
});
$("year").textContent=new Date().getFullYear();
renderProducts();renderCart();


/* =========================================================
   FIREBASE + PAGAMENTO — integração opcional
   ========================================================= */
let firestoreDb = null;

function setFirebaseStatus(message, isError=false){
  const el=$("firebaseStatus");
  if(el){
    el.textContent=message;
    el.style.color=isError ? "#ff8c8c" : "";
  }
}

function getFirebaseConfig(){
  return {
    apiKey:$("fbApiKey").value.trim(),
    authDomain:$("fbAuthDomain").value.trim(),
    projectId:$("fbProjectId").value.trim(),
    storageBucket:$("fbStorageBucket").value.trim(),
    messagingSenderId:$("fbMessagingSenderId").value.trim(),
    appId:$("fbAppId").value.trim()
  };
}

function validFirebaseConfig(config){
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

function connectFirebase(){
  try{
    if(typeof firebase==="undefined"){
      setFirebaseStatus("SDK do Firebase não carregado. Verifique sua internet.",true);
      return false;
    }
    const config=getFirebaseConfig();
    if(!validFirebaseConfig(config)){
      setFirebaseStatus("Preencha apiKey, authDomain, projectId e appId.",true);
      return false;
    }
    if(!firebase.apps.length) firebase.initializeApp(config);
    firestoreDb=firebase.firestore();
    setFirebaseStatus("Firebase conectado. Verifique as regras do Firestore.");
    return true;
  }catch(error){
    console.error(error);
    setFirebaseStatus("Erro ao conectar: "+error.message,true);
    return false;
  }
}

$("connectFirebase").addEventListener("click",()=>{
  settings.firebase=getFirebaseConfig();
  saveSettings();
  connectFirebase();
});

$("uploadFirebase").addEventListener("click",async()=>{
  if(!firestoreDb && !connectFirebase()) return;
  try{
    const batch=firestoreDb.batch();
    products.forEach(product=>{
      const ref=firestoreDb.collection("products").doc(String(product.id));
      batch.set(ref,product,{merge:true});
    });
    await batch.commit();
    await firestoreDb.collection("store").doc("settings").set({
      whatsapp:settings.whatsapp||"",
      instagram:settings.instagram||"",
      email:settings.email||"",
      paymentPublicKey:settings.paymentPublicKey||"",
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
    setFirebaseStatus("Produtos e configurações enviados para o Firebase.");
  }catch(error){
    console.error(error);
    setFirebaseStatus("Falha ao enviar: "+error.message,true);
  }
});

$("downloadFirebase").addEventListener("click",async()=>{
  if(!firestoreDb && !connectFirebase()) return;
  try{
    const snapshot=await firestoreDb.collection("products").get();
    if(snapshot.empty){
      setFirebaseStatus("Nenhum produto encontrado na coleção products.",true);
      return;
    }
    products=snapshot.docs.map(doc=>doc.data());
    saveProducts();
    renderProducts();
    renderAdmin();

    const settingsDoc=await firestoreDb.collection("store").doc("settings").get();
    if(settingsDoc.exists){
      const remote=settingsDoc.data();
      settings={...settings,...remote};
      saveSettings();
      loadSettings();
      renderCart();
    }
    setFirebaseStatus("Produtos carregados do Firebase.");
  }catch(error){
    console.error(error);
    setFirebaseStatus("Falha ao carregar: "+error.message,true);
  }
});
