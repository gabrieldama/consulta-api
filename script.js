const cepInput = document.getElementById('cep');
const cepMessage = document.getElementById('cep-mensagem');
const addressFields = {
    rua: document.getElementById('rua'),
    bairro: document.getElementById('bairro'),
    cidade: document.getElementById('cidade'),
    uf: document.getElementById('uf')
};

let currentRequest;

function clearAddress() {
    Object.values(addressFields).forEach(field => {
        field.value = '';
    });
}

function showCepMessage(message) {
    cepMessage.textContent = message;
    cepInput.setAttribute('aria-invalid', message ? 'true' : 'false');
}

cepInput.addEventListener('blur', async () => {
    const cep = cepInput.value.replace(/\D/g, '');
    currentRequest?.abort();
    clearAddress();
    showCepMessage('');

    if (!cep) {
        return;
    }

    if (!/^\d{8}$/.test(cep)) {
        showCepMessage('CEP incorreto. Informe os 8 números do CEP.');
        return;
    }

    currentRequest = new AbortController();

    try {
        const response = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`,
            { signal: currentRequest.signal }
        );

        if (!response.ok) {
            throw new Error(`Falha na consulta do CEP: ${response.status}`);
        }

        const address = await response.json();

        if (address.erro) {
            showCepMessage('CEP não encontrado. Confira o número e tente novamente.');
            return;
        }

        addressFields.rua.value = address.logradouro || '';
        addressFields.bairro.value = address.bairro || '';
        addressFields.cidade.value = address.localidade || '';
        addressFields.uf.value = address.uf || '';
    } catch (error) {
        if (error.name === 'AbortError') {
            return;
        }

        showCepMessage('Não foi possível consultar o CEP. Tente novamente.');
        console.error(error);
    }
});