
// registre.js
const registerForm = document.getElementById("registerForm");
const successMessage = document.getElementById("successMessage");

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Récupérer les champs requis
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const email = document.getElementById("email")?.value?.trim(); // si tu as un champ email

  // Petites validations de base (optionnel)
  if (!nom || !prenom) {
    successMessage.innerHTML = "❌ Veuillez renseigner votre nom et prénom.";
    return;
  }

  // Stocker dans localStorage
  localStorage.setItem("userNom", nom);
  localStorage.setItem("userPrenom", prenom);
  if (email) localStorage.setItem("userEmail", email);

  // Feedback rapide (optionnel)
  successMessage.innerHTML = "✅ Compte créé avec succès !";

  // Rediriger vers la page de connexion
  window.location.href = "connexion.html";
});
