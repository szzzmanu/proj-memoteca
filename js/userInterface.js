import api from './api.js';

const userInterface = {
    async inicializar() {
        const formulario = document.getElementById('pensamento-form');
        const botaoCancelar = document.getElementById('botao-cancelar');

        if (formulario) {
            formulario.addEventListener('submit', (evento) => this.manipularEnvioForm(evento));
        }

        if (botaoCancelar) {
            botaoCancelar.addEventListener('click', () => this.limparFormulario());
        }

        await this.renderizarPensamentos();
    },

    async renderizarPensamentos() {
        const listaPensamentos = document.getElementById('lista-pensamentos');

        if (!listaPensamentos) {
            return;
        }

        listaPensamentos.innerHTML = '';

        try {
            const pensamentos = await api.buscarPensamentos();
            pensamentos.forEach((pensamento) => this.adicionarPensamentosNaLista(pensamento));
        } catch (error) {
            console.error(error);
            alert('Erro ao renderizar pensamentos');
        }
    },

    async manipularEnvioForm(evento) {
        evento.preventDefault();

        const conteudoInput = document.getElementById('pensamento-conteudo');
        const autoriaInput = document.getElementById('pensamento-autoria');
        const idInput = document.getElementById('pensamento-id');

        const conteudo = conteudoInput.value.trim();
        const autoria = autoriaInput.value.trim();
        const id = idInput.value;

        if (!conteudo || !autoria) {
            alert('Preencha o conteúdo e a autoria do pensamento.');
            return;
        }

        const pensamento = { conteudo, autoria };

        try {
            if (id) {
                await api.atualizarPensamento(id, { ...pensamento, id });
            } else {
                await api.salvarPensamentos(pensamento);
            }

            this.limparFormulario();
            await this.renderizarPensamentos();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar o pensamento.');
        }
    },

    limparFormulario() {
        const formulario = document.getElementById('pensamento-form');
        const botaoSalvar = document.getElementById('botao-salvar');

        if (formulario) {
            formulario.reset();
        }

        const idInput = document.getElementById('pensamento-id');
        if (idInput) {
            idInput.value = '';
        }

        if (botaoSalvar) {
            botaoSalvar.textContent = 'Adicionar';
        }
    },

    async editarPensamento(id) {
        try {
            const pensamentos = await api.buscarPensamentos();
            const pensamento = pensamentos.find((item) => String(item.id) === String(id));

            if (!pensamento) {
                return;
            }

            const idInput = document.getElementById('pensamento-id');
            const conteudoInput = document.getElementById('pensamento-conteudo');
            const autoriaInput = document.getElementById('pensamento-autoria');
            const botaoSalvar = document.getElementById('botao-salvar');

            if (idInput) idInput.value = pensamento.id;
            if (conteudoInput) conteudoInput.value = pensamento.conteudo;
            if (autoriaInput) autoriaInput.value = pensamento.autoria;
            if (botaoSalvar) botaoSalvar.textContent = 'Salvar alterações';
            if (conteudoInput) conteudoInput.focus();
        } catch (error) {
            console.error(error);
            alert('Erro ao carregar o pensamento para edição.');
        }
    },

    async excluirPensamento(id) {
        const confirmado = window.confirm('Deseja realmente excluir este pensamento?');

        if (!confirmado) {
            return;
        }

        try {
            await api.excluirPensamento(id);

            const idInput = document.getElementById('pensamento-id');
            if (idInput && idInput.value === String(id)) {
                this.limparFormulario();
            }

            await this.renderizarPensamentos();
        } catch (error) {
            console.error(error);
            alert('Erro ao excluir o pensamento.');
        }
    },

    adicionarPensamentosNaLista(pensamento) {
        const listaPensamentos = document.getElementById('lista-pensamentos');

        if (!listaPensamentos) {
            return;
        }

        const li = document.createElement('li');
        li.setAttribute('data-id', pensamento.id);
        li.classList.add('li-pensamento');

        const iconeAspas = document.createElement('img');
        iconeAspas.src = 'assets/imagens/aspas-azuis.png';
        iconeAspas.alt = 'Aspas Azuis';
        iconeAspas.classList.add('icone-aspas');

        const pensamentoConteudo = document.createElement('div');
        pensamentoConteudo.textContent = pensamento.conteudo;
        pensamentoConteudo.classList.add('pensamento-conteudo');

        const pensamentoAutoria = document.createElement('div');
        pensamentoAutoria.textContent = pensamento.autoria;
        pensamentoAutoria.classList.add('pensamento-autoria');

        const icones = document.createElement('div');
        icones.classList.add('icones');

        const botaoEditar = document.createElement('button');
        botaoEditar.type = 'button';
        botaoEditar.classList.add('botao-editar');
        botaoEditar.setAttribute('aria-label', 'Editar pensamento');
        botaoEditar.addEventListener('click', () => this.editarPensamento(pensamento.id));

        const iconeEditar = document.createElement('img');
        iconeEditar.src = 'assets/imagens/icone-editar.png';
        iconeEditar.alt = 'Editar';
        botaoEditar.appendChild(iconeEditar);

        const botaoExcluir = document.createElement('button');
        botaoExcluir.type = 'button';
        botaoExcluir.classList.add('botao-excluir');
        botaoExcluir.setAttribute('aria-label', 'Excluir pensamento');
        botaoExcluir.addEventListener('click', () => this.excluirPensamento(pensamento.id));

        const iconeExcluir = document.createElement('img');
        iconeExcluir.src = 'assets/imagens/icone-excluir.png';
        iconeExcluir.alt = 'Excluir';
        botaoExcluir.appendChild(iconeExcluir);

        icones.appendChild(botaoEditar);
        icones.appendChild(botaoExcluir);

        li.appendChild(iconeAspas);
        li.appendChild(pensamentoConteudo);
        li.appendChild(pensamentoAutoria);
        li.appendChild(icones);
        listaPensamentos.appendChild(li);
    }
};

export default userInterface;