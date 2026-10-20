const btn = document.getElementById('btn-carregar');
const lista = document.getElementById('lista-tarefas');

btn.addEventListener('click', carregarDados);

async function carregarDados() {
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        
        const tarefas = await response.json();
    }catch(erro){}

    lista.innerHTML = "";

    tarefas.forEach(tarefa => {
        const li = document.createElement('li')
        li.textContent = tarefa.title;
        lista.appendChild(li)

        if (tarefa.completed) {
            li.style.color = 'green';
        }else {
            li.style.color = 'red';
            li.style.fontWeight = 'bold';
        }
    });
        
}

