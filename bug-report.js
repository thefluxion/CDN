document.addEventListener('DOMContentLoaded', function(){


const modal = document.getElementById('bug-report-modal');
const closeBtn = modal.querySelector('#close-modal');
const form = modal.querySelector('#bug-report-form');
const desc = modal.querySelector('#bug-description');
const severity = modal.querySelector('#bug-severity');
const imageInput = modal.querySelector('#bug-image');


function openModal(){
modal.classList.remove('hidden');
requestAnimationFrame(()=>{
modal.querySelector('.modal-content').style.transform='scale(1)';
modal.querySelector('.modal-content').style.opacity='1';
});
}
function closeModal(){
const content = modal.querySelector('.modal-content');
content.style.transform='scale(0.95)';
content.style.opacity='0';
setTimeout(()=>{modal.classList.add('hidden');form.reset();},250);
}


widgetBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });


function showStatus(msg){
const statusDiv = document.createElement('div');
statusDiv.textContent = msg;
statusDiv.style.cssText='position:fixed;bottom:90px;right:20px;padding:8px 12px;border-radius:8px;background:#0b1220;color:#fff;z-index:9999;';
document.body.appendChild(statusDiv);
setTimeout(()=>statusDiv.remove(),4000);
}


form.addEventListener('submit', async e=>{
e.preventDefault();
if(!desc.value.trim()){ showStatus('Please enter a description.'); return; }
try{
const data = new FormData();
const webhook='https://discord.com/api/webhooks/1431415282164826313/JM1t-ub4vD0OfGjdXlv1SDhOVfeFhVbl0s8JCjKegCqypkk3rmAttTDSLklO5B7Q6liy';
const embed = {
username:'Bug Reporter',
embeds:[{title:`🐞 Bug Report`, description:desc.value.trim(), color:0x00b7ff, fields:[{name:'Severity',value:severity.value,inline:true}]}]
};
data.append('payload_json', JSON.stringify(embed));
if(imageInput.files[0]) data.append('file', imageInput.files[0], 'screenshot.png');
const res = await fetch(webhook,{method:'POST',body:data});
if(!res.ok) throw new Error(res.status);
showStatus('Report submitted!');
closeModal();
}catch(err){
console.error(err);
showStatus('Failed to submit report.');
}
});
})();
});
