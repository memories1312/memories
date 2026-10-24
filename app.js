'use strict';
const $ = (s) => document.querySelector(s);
const categories = {food:'Thực phẩm',recycle:'Tái sử dụng, tái chế',other:'Rác sinh hoạt khác',special:'Thu gom riêng'};
const waste = [
 {name:'Chai nhựa',emoji:'🧴',group:'recycle',keywords:'chai nuoc pet nuoc ngot',tip:'Đổ hết chất lỏng, để ráo, thu gọn. Kiểm tra loại nhựa điểm thu gom chấp nhận.'},
 {name:'Vỏ chuối',emoji:'🍌',group:'food',keywords:'vo trai cay hoa qua vo cam dua hau',tip:'Tách khỏi túi và nhãn dán, gạn bớt nước rồi bỏ vào dụng cụ chứa thực phẩm thải.'},
 {name:'Pin cũ',emoji:'🔋',group:'special',keywords:'pin cu pin tieu pin sac battery',tip:'Giữ riêng, không đập hoặc đốt. Chuyển đến điểm thu hồi pin; pin hư, phồng cần được nơi chuyên môn hướng dẫn.'},
 {name:'Hộp sữa giấy',emoji:'🧃',group:'recycle',keywords:'vo hop sua nuoc ep giay ghep',tip:'Đổ hết phần còn lại, tráng phù hợp và để ráo. Chỉ chuyển tới nơi nhận bao bì giấy ghép; hỏi đơn vị thu gom nếu chưa có điểm nhận.'},
 {name:'Lon nhôm',emoji:'🥫',group:'recycle',keywords:'lon bia nuoc ngot kim loai sat nhom',tip:'Đổ hết chất lỏng, giữ sạch và thu gọn nếu phù hợp. Tránh để cạnh sắc gây thương tích.'},
 {name:'Hộp bìa carton',emoji:'📦',group:'recycle',keywords:'thung hop giay bia carton cactong',tip:'Giữ khô sạch, bỏ thức ăn và vật liệu lót bên trong, gấp phẳng để tiết kiệm chỗ.'},
 {name:'Thức ăn thừa',emoji:'🍚',group:'food',keywords:'com bun mi thit ca do an',tip:'Gạn bớt nước, tách bao bì và dụng cụ ăn uống, đựng trong túi hoặc hộp phù hợp với hướng dẫn địa phương.'},
 {name:'Rau củ bỏ đi',emoji:'🥬',group:'food',keywords:'rau cu la rau cuong rau vo khoai ca rot',tip:'Gỡ túi, dây thun và bao bì. Để riêng cùng chất thải thực phẩm.'},
 {name:'Giấy vệ sinh đã dùng',emoji:'🧻',group:'other',keywords:'giay an khan giay ve sinh ban da dung',tip:'Bỏ cùng rác sinh hoạt khác, đóng gói theo hướng dẫn thu gom. Không trộn với giấy tái chế khô sạch.'},
 {name:'Tã, băng vệ sinh đã dùng',emoji:'🩹',group:'other',keywords:'ta bim bang ve sinh',tip:'Gói kín, giữ vệ sinh và chuyển giao cùng rác sinh hoạt khác theo yêu cầu nơi thu gom.'},
 {name:'Bóng đèn huỳnh quang',emoji:'💡',group:'special',keywords:'bong den compact huynh quang',tip:'Giữ nguyên, tránh làm vỡ; để riêng và liên hệ điểm tiếp nhận chất thải phù hợp.'},
 {name:'Điện thoại, đồ điện tử hỏng',emoji:'📱',group:'special',keywords:'dien thoai may tinh dien tu tai nghe sac cap',tip:'Ưu tiên sửa hoặc tái sử dụng. Khi thải bỏ, xóa dữ liệu cá nhân và đưa đến chương trình thu hồi thiết bị điện tử.'},
 {name:'Chai lọ thủy tinh nguyên vẹn',emoji:'🍾',group:'recycle',keywords:'chai lo thuy tinh ruou',tip:'Đổ hết chất chứa, để riêng cẩn thận để tránh vỡ. Hỏi điểm thu gom vì không phải nơi nào cũng nhận thủy tinh.'},
 {name:'Đồ gốm, sành sứ vỡ',emoji:'🍽️',group:'other',keywords:'gom sanh su chen bat dia vo',tip:'Bọc kín cạnh sắc, ghi rõ “vật sắc nhọn” để bảo vệ người thu gom. Không trộn với thủy tinh tái chế.'},
 {name:'Giấy báo, sách vở cũ',emoji:'📰',group:'recycle',keywords:'giay bao sach vo tap tai lieu',tip:'Ưu tiên cho tặng nếu còn dùng được. Giữ giấy khô sạch, buộc gọn để chuyển giao.'},
 {name:'Bã cà phê, bã trà',emoji:'☕',group:'food',keywords:'ba ca phe cafe tra che',tip:'Để ráo, bỏ riêng túi lọc hoặc phần bao bì không phải thực phẩm rồi gom cùng chất thải thực phẩm.'},
 {name:'Hộp xốp dính thức ăn',emoji:'🥡',group:'other',keywords:'hop xop ban dinh dau mo',tip:'Tách thức ăn thừa. Hộp xốp bẩn thường không được nhận trong dòng tái chế; làm theo hướng dẫn đơn vị thu gom.'},
 {name:'Túi nilon',emoji:'🛍️',group:'other',keywords:'tui nilong ni long bao bi mem',tip:'Tái sử dụng nếu còn sạch. Chỉ để vào dòng tái chế khi điểm nhận xác nhận có nhận túi mềm sạch; nếu không, theo hướng dẫn rác khác.'},
 {name:'Quần áo cũ',emoji:'👕',group:'recycle',keywords:'quan ao vai do cu',tip:'Ưu tiên sửa, cho tặng đồ còn dùng tốt. Vải bỏ đi cần tìm điểm nhận dệt may; không mặc định mọi nơi thu gom tái chế đều nhận.'},
 {name:'Khẩu trang đã sử dụng',emoji:'😷',group:'other',keywords:'khau trang',tip:'Gói kín theo hướng dẫn rác sinh hoạt. Khẩu trang từ cơ sở y tế hoặc có nguy cơ lây nhiễm phải theo hướng dẫn chuyên biệt.'}
];
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();
function renderSearch(){
 const raw=$('#waste-search').value;
 const query=normalize(raw);
 const tokens=query.split(/\s+/).filter(Boolean);
 const matches=query?waste.filter(item=>tokens.every(token=>normalize(item.name+' '+item.keywords).includes(token))):waste.slice(0,3);
 $('#clear-search').hidden=!raw;
 $('#search-count').textContent=query?`${matches.length} kết quả cho “${raw}”`:'MỘT VÀI MÓN RÁC QUEN THUỘC';
 const box=$('#search-results'); box.replaceChildren();
 if(!matches.length){const p=document.createElement('p');p.className='no-results';p.textContent='Chưa có món này trong cẩm nang. Thử tên ngắn hơn hoặc hỏi đơn vị thu gom tại nơi bạn sống để được hướng dẫn.';box.append(p);return;}
 matches.forEach(item=>{const row=document.createElement('article');row.className='result-item';const emoji=document.createElement('span');emoji.className='result-emoji';emoji.setAttribute('aria-hidden','true');emoji.textContent=item.emoji;const body=document.createElement('div');body.className='result-body';const title=document.createElement('div');title.className='result-title';const name=document.createElement('span');name.textContent=item.name;const tag=document.createElement('span');tag.className='result-category '+item.group;tag.textContent=categories[item.group];title.append(name,tag);const p=document.createElement('p');p.textContent=item.tip;body.append(title,p);row.append(emoji,body);box.append(row)});
 box.scrollTop=0;
}
$('#waste-search').addEventListener('input',renderSearch);
$('#clear-search').addEventListener('click',()=>{$('#waste-search').value='';renderSearch();$('#waste-search').focus()});
document.querySelectorAll('[data-search]').forEach(button=>button.addEventListener('click',()=>{$('#waste-search').value=button.dataset.search;renderSearch();$('#waste-search').focus()}));
renderSearch();

const quiz = [
 {emoji:'🧴',question:'Chai nhựa đã đổ hết nước nên vào nhóm nào?',group:'recycle',explanation:'Chai nhựa sạch, rỗng có thể đi vào dòng tái chế nếu điểm thu gom có tiếp nhận loại nhựa đó. Hãy để ráo và thu gọn.'},
 {emoji:'🍌',question:'Vỏ chuối sau bữa ăn nên được để ở đâu?',group:'food',explanation:'Vỏ chuối là chất thải thực phẩm. Tách nhãn dán và túi đựng trước khi bỏ vào nhóm này.'},
 {emoji:'🔋',question:'Chiếc pin đã hết cần được xử lý thế nào?',group:'special',explanation:'Pin cũ cần để riêng và đưa đến điểm thu hồi phù hợp. Đừng bỏ chung với chai nhựa hay chất thải thực phẩm.'},
 {emoji:'🧻',question:'Khăn giấy đã dùng để lau thức ăn thuộc nhóm nào?',group:'other',explanation:'Khăn giấy đã bẩn không đi cùng giấy khô sạch để tái chế. Hãy đóng gói cùng rác sinh hoạt khác theo hướng dẫn địa phương.'},
 {emoji:'📦',question:'Thùng carton khô sạch sau khi mở hàng nên vào đâu?',group:'recycle',explanation:'Carton khô sạch là vật liệu có thể tái chế. Gấp phẳng, tách vật liệu lót và giữ giấy không bị ướt, bẩn.'},
 {emoji:'🍚',question:'Cơm thừa còn trong hộp đồ ăn nên được làm gì?',group:'food',explanation:'Tách cơm thừa khỏi hộp và dụng cụ ăn uống. Phần cơm thuộc nhóm chất thải thực phẩm; bao bì xử lý riêng theo vật liệu và tình trạng.'},
 {"emoji": "🥫", "question": "Lon nhôm đã đổ hết nước và để ráo nên vào nhóm nào?", "group": "recycle", "explanation": "Lon nhôm sạch, rỗng có thể đưa vào dòng tái chế tại nơi có tiếp nhận. Giữ gọn và tránh cạnh sắc gây thương tích."},
 {"emoji": "🥬", "question": "Lá rau hỏng, vỏ khoai sau khi nấu ăn thuộc nhóm nào?", "group": "food", "explanation": "Phần rau củ bỏ đi thuộc chất thải thực phẩm. Gỡ dây thun, túi nilon và bao bì trước khi gom riêng."},
 {"emoji": "💡", "question": "Bóng đèn huỳnh quang đã hỏng cần được để ở đâu?", "group": "special", "explanation": "Bóng đèn huỳnh quang cần thu gom riêng. Giữ nguyên, tránh làm vỡ và liên hệ điểm tiếp nhận phù hợp; không trộn với chai lọ tái chế."},
 {"emoji": "📰", "question": "Giấy báo cũ khô sạch, không còn nhu cầu sử dụng thuộc nhóm nào?", "group": "recycle", "explanation": "Giấy báo khô sạch có thể tái chế. Giữ giấy không bị ướt hay dính thức ăn, buộc gọn để chuyển tới nơi tiếp nhận."},
 {"emoji": "🥡", "question": "Hộp xốp dính dầu mỡ, đã bỏ thức ăn và nơi thu gom không nhận tái chế, nên vào nhóm nào?", "group": "other", "explanation": "Trong tình huống này, hộp xốp bẩn thuộc rác sinh hoạt khác. Thức ăn thừa cần tách trước; việc nhận vật liệu tái chế tùy từng điểm thu gom."},
 {"emoji": "☕", "question": "Bã cà phê đã để ráo và tách khỏi bao bì thuộc nhóm nào?", "group": "food", "explanation": "Bã cà phê thuộc chất thải thực phẩm. Tách túi, cốc và các vật liệu không phải thực phẩm trước khi thu gom."},
 {"emoji": "📱", "question": "Điện thoại hỏng không thể sửa hoặc tái sử dụng cần chuyển vào luồng nào?", "group": "special", "explanation": "Thiết bị điện tử cần được đưa tới chương trình thu hồi hoặc điểm tiếp nhận chuyên biệt. Xóa dữ liệu cá nhân nếu có thể trước khi chuyển giao."},
 {"emoji": "🩹", "question": "Tã đã sử dụng trong sinh hoạt gia đình thuộc nhóm nào?", "group": "other", "explanation": "Tã đã dùng thuộc rác sinh hoạt khác. Gói kín, giữ vệ sinh và chuyển giao theo hướng dẫn thu gom tại nơi bạn sống."},
 {"emoji": "🍾", "question": "Chai thủy tinh nguyên vẹn, đã đổ hết chất chứa và có điểm nhận phù hợp, thuộc nhóm nào?", "group": "recycle", "explanation": "Chai thủy tinh nguyên vẹn có thể tái sử dụng hoặc tái chế tại nơi có tiếp nhận. Để riêng cẩn thận để tránh vỡ; không trộn với đồ gốm, sành sứ."}
];
let quizIndex=0,score=0,answered=false;
function renderQuiz(){
 answered=false;const q=quiz[quizIndex];
 $('#quiz-emoji').textContent=q.emoji;$('#quiz-position').textContent=`Câu ${String(quizIndex+1).padStart(2,'0')} / ${String(quiz.length).padStart(2,'0')}`;$('#quiz-score').textContent=`${score} điểm`;
 $('#quiz-progress-fill').style.width=((quizIndex+1)/quiz.length*100)+'%';$('#quiz-question').textContent=q.question;
 $('#quiz-feedback').hidden=true;$('#quiz-feedback').className='quiz-feedback';$('#quiz-next').hidden=true;
 const options=$('#quiz-options');options.replaceChildren();
 Object.keys(categories).forEach((key,index)=>{const button=document.createElement('button');button.className='quiz-option';button.dataset.group=key;const letter=document.createElement('span');letter.textContent=String.fromCharCode(65+index);button.append(letter,document.createTextNode(categories[key]));button.addEventListener('click',()=>answerQuiz(key));options.append(button)});
 document.dispatchEvent(new CustomEvent('green:quiz-change'));
}
function answerQuiz(group){if(answered)return;answered=true;const q=quiz[quizIndex],correct=group===q.group;if(correct)score++;document.querySelectorAll('.quiz-option').forEach(button=>{button.disabled=true;if(button.dataset.group===q.group)button.classList.add('correct');if(button.dataset.group===group&&!correct)button.classList.add('wrong')});$('#quiz-score').textContent=`${score} điểm`;const feedback=$('#quiz-feedback');feedback.hidden=false;feedback.className='quiz-feedback'+(correct?'':' wrong');feedback.textContent=(correct?'Chính xác! ':'Cùng nhớ lại nhé: ')+q.explanation;$('#quiz-next').hidden=false;$('#quiz-next').innerHTML=(quizIndex===quiz.length-1?'Xem kết quả':'Câu tiếp theo')+' <svg class="icon"><use href="#i-arrow"/></svg>';document.dispatchEvent(new CustomEvent('green:answer',{detail:{correct}}));}
$('#quiz-next').addEventListener('click',nextQuiz);
function showQuizResult(){const content=$('.quiz-content');content.classList.add('result');content.innerHTML=`<div class="eyebrow">BẠN ĐÃ HOÀN THÀNH!</div><div class="result-score">${score}<span style="font-size:28px;letter-spacing:-1px;color:#8b9b80"> / ${quiz.length}</span></div><h3>${score===quiz.length?'Cao thủ phân loại là bạn!':score/quiz.length>=2/3?'Thêm một bước sống xanh.':'Mỗi lần thử, hiểu thêm một chút.'}</h3><p>Điều đáng nhớ nhất: tách đúng vật liệu và kiểm tra yêu cầu nơi thu gom. Cùng mang điều vừa học vào cuộc sống nhé!</p><button id="quiz-restart" class="button quiz-next">Thử lại một lần nữa ↗</button>`;$('#quiz-emoji').textContent=score===quiz.length?'🏆':'🌱';document.dispatchEvent(new CustomEvent('green:quiz-complete'));$('#quiz-restart').addEventListener('click',()=>{content.classList.remove('result');content.innerHTML=originalQuiz;quizIndex=0;score=0;$('#quiz-next').addEventListener('click',nextQuiz);renderQuiz()});}
function nextQuiz(){if(!answered)return;if(quizIndex<quiz.length-1){quizIndex++;renderQuiz();$('#quiz-question').setAttribute('tabindex','-1');$('#quiz-question').focus({preventScroll:true})}else showQuizResult()}
const originalQuiz=$('.quiz-content').innerHTML;
renderQuiz();

const challengeTasks=['Chuẩn bị ba túi hoặc thùng có nhãn','Giữ riêng giấy và chai nhựa khô sạch','Tách thức ăn thừa khỏi bao bì','Để pin cũ vào hộp thu gom riêng','Mang theo bình nước cá nhân','Hỏi lịch và cách nhận rác đã phân loại','Chia sẻ cách phân loại với một người bạn'];
const storageKey='tram-xanh-challenge-v1';let challengeState=Array(7).fill(false);
try{const saved=JSON.parse(localStorage.getItem(storageKey));if(Array.isArray(saved)&&saved.length===7)challengeState=saved.map(Boolean)}catch{}
function updateChallenge(){const count=challengeState.filter(Boolean).length;$('#challenge-count').textContent=count===7?'7/7 — Bạn đã hoàn thành 7 ngày xanh!':`${count}/7 việc đã hoàn thành`;$('#challenge-progress').style.width=(count/7*100)+'%';}
challengeTasks.forEach((task,index)=>{const label=document.createElement('label');label.className='challenge-row';const input=document.createElement('input');input.type='checkbox';input.checked=challengeState[index];input.setAttribute('aria-label',`Ngày ${index+1}: ${task}`);const check=document.createElement('span');check.className='challenge-check';check.innerHTML='<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';const text=document.createElement('span');const day=document.createElement('span');day.className='challenge-day';day.textContent=`Ngày ${String(index+1).padStart(2,'0')}`;const title=document.createElement('span');title.className='challenge-label';title.textContent=task;text.append(day,title);label.append(input,check,text);input.addEventListener('change',()=>{challengeState[index]=input.checked;updateChallenge();try{localStorage.setItem(storageKey,JSON.stringify(challengeState))}catch{showToast('Trình duyệt chưa cho phép lưu tiến độ. Bạn vẫn có thể tiếp tục đánh dấu.')}});$('#challenge-list').append(label)});updateChallenge();

const toggle=$('.mobile-toggle');toggle.addEventListener('click',()=>{const opened=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!opened));toggle.setAttribute('aria-label',opened?'Mở menu':'Đóng menu');$('#main-nav').classList.toggle('open',!opened)});
document.querySelectorAll('#main-nav a').forEach(link=>link.addEventListener('click',()=>{$('#main-nav').classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Mở menu')}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){$('#main-nav').classList.remove('open');toggle.setAttribute('aria-expanded','false')}});
let toastTimer;function showToast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4000)}
$('#share-campaign').addEventListener('click',()=>{const url=new URL('./',location.href).href;$('#share-text').value=`Phân loại nhỏ. Thay đổi lớn. 🌱\nMình cùng HUTECH University Green Campus học cách phân loại rác và bắt đầu 7 ngày sống xanh. Tham gia cùng mình nhé!\n${url}\n#HUTECHGreenCampus #PhanLoaiRac #SongXanh`;$('#share-dialog').showModal()});
$('#close-share').addEventListener('click',()=>$('#share-dialog').close());
$('#share-dialog').addEventListener('click',event=>{if(event.target===$('#share-dialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close()}});
$('#copy-share').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#share-text').value);$('#share-dialog').close();showToast('Đã sao chép lời nhắn. Cùng lan tỏa điều xanh!')}catch{$('#share-text').focus();$('#share-text').select();showToast('Hãy nhấn Ctrl+C hoặc chọn Sao chép để lấy lời nhắn.')}});
let printedDetails=[];window.addEventListener('beforeprint',()=>{printedDetails=Array.from(document.querySelectorAll('.category-card details')).filter(d=>!d.open);printedDetails.forEach(d=>d.open=true)});window.addEventListener('afterprint',()=>{printedDetails.forEach(d=>d.open=false);printedDetails=[]});$('#print-guide').addEventListener('click',()=>window.print());

