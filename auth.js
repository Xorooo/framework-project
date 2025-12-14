 const loginForm = document.getElementById("loginForm");
  const forgotForm = document.getElementById("forgotForm");
  const forgotLink = document.getElementById("forgotLink");
  const backToLogin = document.getElementById("backToLogin");
  const title = document.getElementById("formTitle");
  const subtitle = document.getElementById("formSubtitle");

  forgotLink.onclick = () => {
    loginForm.style.display = "none";
    forgotForm.style.display = "block";
    title.textContent = "Mot de passe oublié";
    subtitle.textContent = "Recevez un lien de réinitialisation";
  };

  backToLogin.onclick = () => {
    forgotForm.style.display = "none";
    loginForm.style.display = "block";
    title.textContent = "Connexion";
    subtitle.textContent = "Accédez à votre compte";
  };
