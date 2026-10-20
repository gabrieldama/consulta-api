const campoCep = document.getElementById('cep');
const mensagemCep = document.getElementById('cep-mensagem');
const camposEndereco = {
    rua: document.getElementById('rua'),
    bairro: document.getElementById('bairro'),
    cidade: document.getElementById('cidade'),
    uf: document.getElementById('uf')
};

function mostrarMensagem(texto) {
    mensagemCep.textContent = texto;
    campoCep.setAttribute('aria-invalid', texto ? 'true' : 'false');
}

campoCep.addEventListener('blur', async () => {
    const cep = campoCep.value.replace(/\D/g, '');

    Object.values(camposEndereco).forEach(campo => campo.value = '');
    mostrarMensagem('');

    if (!cep) return;

    if (!/^\d{8}$/.test(cep)) {
        mostrarMensagem('CEP incorreto. Informe os 8 números do CEP.');
        return;
    }

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!resposta.ok) throw new Error('Falha ao consultar o CEP.');

        const endereco = await resposta.json();
        if (endereco.erro) {
            mostrarMensagem('CEP não encontrado. Confira o número e tente novamente.');
            return;
        }

        camposEndereco.rua.value = endereco.logradouro || '';
        camposEndereco.bairro.value = endereco.bairro || '';
        camposEndereco.cidade.value = endereco.localidade || '';
        camposEndereco.uf.value = endereco.uf || '';
    } catch (erro) {
        mostrarMensagem('Não foi possível consultar o CEP. Tente novamente.');
        console.error(erro);
    }
});
