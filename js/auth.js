
function showMessage(id, msg, cls='success'){ document.getElementById(id).innerHTML = `<div class="alert alert-${cls}">${msg}</div>`; }

document.addEventListener('DOMContentLoaded', ()=>{
  const reg = document.getElementById('registerForm');
  if(reg){
    reg.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fullname = document.getElementById('fullname').value.trim();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      if(!fullname || !email || password.length < 6){ showMessage('regMsg','Please fill properly','danger'); return; }
      const user = { fullname, email };
      localStorage.setItem('fm_user', JSON.stringify(user));
      showMessage('regMsg','Account created! You can now login.');
      setTimeout(()=> location.href='login.html', 1000);
    });
  }

  const login = document.getElementById('loginForm');
  if(login){
    login.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const stored = JSON.parse(localStorage.getItem('fm_user'));
      if(stored && stored.email === email && password.length>=6){
        showMessage('loginMsg','Login successful!');
        setTimeout(()=> location.href='search.html', 700);
      } else {
        showMessage('loginMsg','Invalid credentials (demo).','danger');
      }
    });
  }
});
