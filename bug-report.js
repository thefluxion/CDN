document.addEventListener('DOMContentLoaded', function(){
  (function(){
    // Create floating button
    const widgetBtn = document.createElement('div');
    widgetBtn.id = 'bug-widget-btn';
    widgetBtn.innerHTML = '<span style="margin-right:6px;">🐞</span>Report Bug';
    widgetBtn.style.cssText = `
      position:fixed;
      bottom:20px;
      right:20px;
      padding:0 16px;
      height:50px;
      background:rgba(15,23,32,0.6);
      backdrop-filter:blur(10px);
      border-radius:25px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:16px;
      font-weight:600;
      color:#e6eef8;
      cursor:pointer;
      z-index:9999;
      transition:all 0.3s ease;
      box-shadow:0 4px 20px rgba(0,0,0,0.2);
    `;
    widgetBtn.onmouseover = () => { widgetBtn.style.transform = 'scale(1.05)'; widgetBtn.style.boxShadow='0 6px 24px rgba(0,0,0,0.3)'; };
    widgetBtn.onmouseout = () => { widgetBtn.style.transform = 'scale(1)'; widgetBtn.style.boxShadow='0 4px 20px rgba(0,0,0,0.2)'; };
    document.body.appendChild(widgetBtn);

    // Inject modal HTML
    const modalHTML = `
      <div id="bug-report-modal" class="hidden" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(2,6,23,0.6);z-index:9998;">
        <div class="modal-content" style="width:min(900px,90%);background:rgba(7,18,38,0.95);padding:18px;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.6);transform:scale(0.95);opacity:0;transition:transform .25s ease,opacity .25s ease;border:1px solid rgba(0,183,255,0.08);color:#e6eef8;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-weight:600;font-size:18px">Report an Issue</div>
            <button id="close-modal" style="background:transparent;border:0;color:#94a3b8;font-size:20px;cursor:pointer">✕</button>
          </div>
          <form id="bug-report-form">
            <label style="font-size:13px;">Description</label>
            <textarea id="bug-description" style="width:100%;min-height:120px;margin-bottom:12px;padding:10px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.04);color:#e6eef8"></textarea>
            <label style="font-size:13px;">Severity</label>
            <select id="bug-severity" style="width:100%;margin-bottom:12px;padding:8px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.03);color:#e6eef8">
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
            </select>
            <label style="font-size:13px;">Screenshot (optional)</label>
            <input type="file" id="bug-image" accept="image/*" style="width:100%;margin-bottom:12px;padding:10px 12px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);color:#e6eef8;cursor:pointer;transition:all 0.3s ease;font-size:14px;" onmouseover="this.style.background='rgba(255,255,255,0.1)';" onmouseout="this.style.background='rgba(255,255,255,0.05)';" />
            <div style="text-align:right"><button type="submit" style="padding:8px 12px;border-radius:8px;background:#00b7ff;border:none;color:#012;cursor:pointer">Submit</button></div>
          </form>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('bug-report-modal');
    const closeBtn = modal.querySelector('#close-modal');
    const form = modal.querySelector('#bug-report-form');
    const desc = modal.querySelector('#bug-description');
    const severity = modal.querySelector('#bug-severity');
    const imageInput = modal.querySelector('#bug-image');

    function openModal(){
      widgetBtn.style.display = 'none';
      modal.classList.remove('hidden');
      requestAnimationFrame(()=>{
        modal.querySelector('.modal-content').style.transform='scale(1)';
        modal.querySelector('.modal-content').style.opacity='1';
      });
    }
    function closeModal(){
      widgetBtn.style.display = 'flex';
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
