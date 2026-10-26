import './navigation.js';
import './modais.js';
import './toast.js';
import './home/home.js';
import './home/exibirHistoricoCompras.js';
import './gestao.js';

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("toggle-senha")) {
        const input = e.target.parentElement.querySelector("input");

        if (input.type === "password") {
            input.type = "text";
            e.target.classList.remove("fa-eye");
            e.target.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            e.target.classList.remove("fa-eye-slash");
            e.target.classList.add("fa-eye");
        }
    }
});