const KEY="vintav_payment_demo_v1";
const seed={accounts:[
{id:"1",type:"EWALLET",provider:"DANA",holder:"Kevin Octavianus",number:"081234567890",note:"Demo account",favorite:true},
{id:"2",type:"EWALLET",provider:"GoPay",holder:"Kevin Octavianus",number:"081298765432",note:"Demo account",favorite:false},
{id:"3",type:"BANK",provider:"BCA",holder:"Kevin Octavianus",number:"1234567890",note:"Demo account",favorite:true},
{id:"4",type:"BANK",provider:"BRI",holder:"Kevin Octavianus",number:"0987654321",note:"Demo account",favorite:false},
{id:"5",type:"QRIS",provider:"QRIS Personal",holder:"Kevin Octavianus",number:"",note:"QRIS demo",favorite:true}
],tx:[
{id:"t1",accountId:"1",desc:"Contoh transaksi",amount:25000,type:"OUT",date:new Date().toISOString()}
]};
let data=JSON.parse(localStorage.getItem(KEY)||"null")||seed;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
const rupiah=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const mask=n=>n?n.length<=4?n:"•••• •••• "+n.slice(-4):"Tidak ada nomor";
function icon(type){return type==="BANK"?"▣":type==="QRIS"?"▦":"◈"}
function typeName(type){return type==="BANK"?"Bank":type==="QRIS"?"QRIS":"E-Wallet"}
function showToast(msg){$("#toast").textContent=msg;$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),2200)}
function go(page){
  $$(".page").forEach(x=>x.classList.toggle("active",x.id===page));
  $$(".nav[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  $("#pageTitle").textContent={dashboard:"Dashboard",wallets:"E-Wallet",banks:"Bank",qris:"QRIS",history:"Riwayat Pembayaran"}[page];
  $(".sidebar").classList.remove("open"); render();
}
$$(".nav[data-page]").forEach(b=>b.onclick=()=>go(b.dataset.page));
$$("[data-page-go]").forEach(b=>b.onclick=()=>go(b.dataset.pageGo));
$("#menuBtn").onclick=()=>$(".sidebar").classList.toggle("open");
$$("[data-open]").forEach(b=>b.onclick=()=>{ if(b.dataset.type) $("#type").value=b.dataset.type; if(b.dataset.open==="transactionModal") fillTxAccounts(); $("#"+b.dataset.open).classList.add("show")});
$$("[data-close]").forEach(b=>b.onclick=()=>b.closest(".modal-wrap").classList.remove("show"));
$$(".modal-wrap").forEach(m=>m.onclick=e=>{if(e.target===m)m.classList.remove("show")});
$("#paymentForm").onsubmit=e=>{e.preventDefault();data.accounts.push({id:crypto.randomUUID(),type:$("#type").value,provider:$("#provider").value,holder:$("#holder").value,number:$("#number").value,note:$("#note").value,favorite:$("#favorite").checked});save();e.target.reset();$("#holder").value="Kevin Octavianus";$("#paymentModal").classList.remove("show");render();showToast("Payment berhasil ditambahkan")};
function fillTxAccounts(){$("#txAccount").innerHTML=data.accounts.map(a=>`<option value="${a.id}">${a.provider} — ${typeName(a.type)}</option>`).join("")}
$("#transactionForm").onsubmit=e=>{e.preventDefault();data.tx.unshift({id:crypto.randomUUID(),accountId:$("#txAccount").value,desc:$("#txDesc").value,amount:+$("#txAmount").value,type:$("#txType").value,date:new Date().toISOString()});save();e.target.reset();$("#transactionModal").classList.remove("show");render();showToast("Transaksi disimpan")};
function deleteAccount(id){if(confirm("Hapus payment ini?")){data.accounts=data.accounts.filter(a=>a.id!==id);data.tx=data.tx.filter(t=>t.accountId!==id);save();render();showToast("Payment dihapus")}}
function card(a){return `<div class="pay-card"><div class="brandline"><div class="provider-icon">${icon(a.type)}</div><span class="pill">${typeName(a.type)}</span></div><h3>${esc(a.provider)} ${a.favorite?"★":""}</h3><div class="number">${mask(a.number)}</div><small>${esc(a.holder)}</small><div class="actions"><button class="small-btn" onclick="copyAccount('${a.number||""}')">Salin</button><button class="small-btn danger" onclick="deleteAccount('${a.id}')">Hapus</button></div></div>`}
function copyAccount(v){if(!v){showToast("Tidak ada nomor untuk disalin");return}navigator.clipboard?.writeText(v);showToast("Nomor disalin")}
function accountRow(a){return `<div class="account"><div class="account-left"><div class="mini-icon">${icon(a.type)}</div><div><b>${esc(a.provider)}</b><small>${typeName(a.type)} · ${mask(a.number)}</small></div></div><span class="pill">${a.favorite?"UTAMA":"AKUN"}</span></div>`}
function txRow(t){let a=data.accounts.find(x=>x.id===t.accountId);return `<div class="history"><div class="history-left"><div class="mini-icon">${t.type==="IN"?"↑":"↓"}</div><div><b>${esc(t.desc)}</b><small>${a?esc(a.provider):"Deleted"} · ${new Date(t.date).toLocaleString("id-ID")}</small></div></div><strong>${t.type==="IN"?"+":"-"}${rupiah(t.amount)}</strong></div>`}
function render(){
  const w=data.accounts.filter(a=>a.type==="EWALLET"), b=data.accounts.filter(a=>a.type==="BANK"), q=data.accounts.filter(a=>a.type==="QRIS");
  $("#totalCount").textContent=data.accounts.length;$("#walletCount").textContent=w.length;$("#bankCount").textContent=b.length;$("#qrisCount").textContent=q.length;
  $("#quickAccounts").innerHTML=data.accounts.slice(0,5).map(accountRow).join("")||`<div class="empty">Belum ada payment.</div>`;
  $("#recentHistory").innerHTML=data.tx.slice(0,4).map(txRow).join("")||`<div class="empty">Belum ada transaksi.</div>`;
  $("#walletGrid").innerHTML=w.map(card).join("")||`<div class="empty">Belum ada e-wallet.</div>`;
  $("#bankGrid").innerHTML=b.map(card).join("")||`<div class="empty">Belum ada rekening bank.</div>`;
  if(q.length) $("#qrisArea").innerHTML=`<div class="qris-box"><span class="label">PRIMARY QRIS</span><h2>${esc(q[0].holder)}</h2><div class="fake-qr" aria-label="Demo QR code"></div><h3>${esc(q[0].provider)}</h3><p class="qris-note">Ini adalah QR visual DEMO. Ganti dengan gambar QRIS milikmu sendiri sebelum penggunaan nyata.</p><div class="actions"><button class="primary" onclick="downloadDemo()">Simpan QRIS</button><button class="small-btn danger" onclick="deleteAccount('${q[0].id}')">Hapus</button></div></div>`; else $("#qrisArea").innerHTML=`<div class="card empty">Belum ada QRIS. Tambahkan QRIS untuk menampilkannya.</div>`;
  $("#historyFull").innerHTML=data.tx.map(txRow).join("")||`<div class="empty">Belum ada transaksi.</div>`;
}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function downloadDemo(){const blob=new Blob(["VINTAV PAYMENT DEMO — QRIS placeholder"],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="vintav-qris-demo.txt";a.click();URL.revokeObjectURL(a.href);showToast("Demo QRIS disimpan")}
$("#themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("vintav_theme",document.body.classList.contains("light")?"light":"dark")};
if(localStorage.getItem("vintav_theme")==="light")document.body.classList.add("light");
$("#resetBtn").onclick=()=>{if(confirm("Reset semua data demo?")){data=structuredClone(seed);save();render();showToast("Demo di-reset")}};
render();
