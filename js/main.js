import userInterface from "./userInterface.js";
import api from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    userInterface.renderizarPensamentos();

    const formularioPensamento = document.getElementById("pensamento-form")
    formularioPensamento.addEventListener("submit", submissaoFormulario)

    async function submissaoFormulario (event){
        event.preventDefault();
        const id = document.getElementById("pensamento-id").value
        const conteudo = document.getElementById("pensamento-conteudo").value
        const autoria = document.getElementById("pensamento-autoria").value

        try{
            await api.salvarPensamentos({conteudo, autoria})
            userInterface.renderizarPensamentos();
        }
        catch{
            alert("Erro ao enviar novela.")
        }
    }
})