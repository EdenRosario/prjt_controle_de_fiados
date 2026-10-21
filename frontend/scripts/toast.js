
function showToast(mensagem, tipo = "success") {
    const container = document.getElementById("toast-container");

    if (!container) {
        console.error("Elemento #toast-container não encontrado.");
        return;
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;

    const icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.textContent = tipo === "success" ? "✔️" : "❌";

    const texto = document.createElement("span");
    texto.className = "toast-message";
    texto.textContent = mensagem;

    toast.append(icon, texto);
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

window.showToast = showToast;
