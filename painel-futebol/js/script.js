const inputTime = document.getElementById('input-time');
const btnBuscar = document.getElementById('btn-buscar');
const infoTimeContainer = document.getElementById('info-time');
const jogosContainer = document.getElementById('jogos');
const noticiasContainer = document.querySelector('.offcanvas-body');
const btnNoticias = document.querySelector('.btn');
const offcanvasElement = document.querySelector('.offcanvas');


btnBuscar.addEventListener('click', buscarInformacoesTime);


inputTime.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        buscarInformacoesTime();
    }
});

async function buscarInformacoesTime() {
    const nomeTime = inputTime.value;

    if (!nomeTime) {
        alert("Por favor, digite o nome de um time!");
        return;
    }

    // Limpa os resultados anteriores antes de uma nova busca
    infoTimeContainer.innerHTML = '<h2>Carregando...</h2>';
    jogosContainer.innerHTML = '';

    try {
        // BUSCAR OS DADOS DO TIME
        const responseTime = await fetch(`http://localhost:3001/api/times/${nomeTime}`);
        const dataTime = await responseTime.json();
        console.log(dataTime);

        // BUSCAR AS NOTICIAS DO TIME
        const responseNoticias = await fetch(`http://localhost:3001/api/noticias/${nomeTime}`);
        const dataNoticias = await responseNoticias.json();
        console.log(dataNoticias);



        if (dataNoticias) {
            btnNoticias.classList.remove('d-none');
            offcanvasElement.classList.remove('d-none');
            const noticiasHTML = dataNoticias.slice(0, 10).map(noticia => `
                    <div class="card-noticia">
                    <h4><a href="${noticia.url || '#'}">${noticia.title || 'Notícia sem título'}</a></h4>
                    <p>${noticia.description || 'Clique para ler mais.'}</p>
                </div>`).join('');


            noticiasContainer.innerHTML = `<h3>Notícias Recentes:</h3>${noticiasHTML}`;

        } else {
            btnNoticias.classList.add('d-none');
            offcanvasElement.classList.add('d-none');
            noticiasContainer.innerHTML = '';
            console.error('Nenhuma notícia encontrada ou a resposta não foi um array.', dataNoticias);
        }

        // Verifica se o time foi encontrado
        if (!dataTime.teams) {
            infoTimeContainer.innerHTML = `<h2>Time "${nomeTime}" não encontrado. Tente novamente.</h2>`;
            return;
        }

        const time = dataTime.teams[0];
        const idTime = time.idTeam;


        // EXIBIR AS INFORMAÇÕES BÁSICAS DO TIME
        infoTimeContainer.innerHTML = `
            <img src="${time.strBadge}" alt="Logo do ${time.strTeam}">
            <h2>${time.strTeam}</h2>
            <p>${time.strStadium}</p>
        `;

        // BUSCAR OS PRÓXIMOS JOGOS USANDO O ID DO TIME
        const responseJogos = await fetch(`https://www.thesportsdb.com/api/v1/json/123/eventsnext.php?id=${idTime}`);
        const dataJogos = await responseJogos.json();


        // Verifica se existem próximos jogos
        if (dataJogos.events) {
            exibirProximosJogos(dataJogos.events);
        } else {
            jogosContainer.innerHTML = '<p>Não há próximos jogos agendados para este time.</p>';
        }

    } catch (error) {
        // Trata qualquer erro que possa ocorrer durante a chamada da API
        console.error("Erro ao buscar dados:", error);
        infoTimeContainer.innerHTML = '<h2>Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.</h2>';
    }
}

function exibirProximosJogos(jogos) {
    // Limpa o container antes de adicionar os novos jogos
    jogosContainer.innerHTML = '<h3>Próximos Jogos:</h3>';

    // Para cada jogo encontrado, cria um card e adiciona na tela
    jogos.forEach(jogo => {
        // Formata a data para o padrão brasileiro
        const data = new Date(jogo.dateEvent).toLocaleDateString('pt-BR');
        const hora = new Date(`1970-01-01T${jogo.strTime}Z`).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });


        const cardJogo = `
            <div class="card-jogo">
                <h3>${jogo.strEvent}</h3>
                <p><strong>Competição:</strong> ${jogo.strLeague}</p>
                <p><strong>Data:</strong> ${data}</p>
                <p><strong>Horário:</strong> ${hora}</p>
            </div>
        `;
        // Adiciona o HTML do card criado dentro do container de jogos
        jogosContainer.innerHTML += cardJogo;
    });
}