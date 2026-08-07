function adicionarLinha() {

    const tabela = document.getElementById("corpoTabela");

    const numeroPonto = tabela.rows.length + 1;

    const linha = document.createElement("tr");

    linha.innerHTML = `
        <td>P${numeroPonto}</td>

        <td>
            <input type="number" step="0.001" class="x">
        </td>

        <td>
            <input type="number" step="0.001" class="z">
        </td>

        <td>
            <select class="tipo">
                <option value="G01">Linha</option>
                <option value="G02">G02</option>
                <option value="G03">G03</option>
            </select>
        </td>

        <td>
            <input type="number" step="0.001" class="raio">
        </td>
    `;

    tabela.appendChild(linha);
}

function removerLinha() {

    const tabela = document.getElementById("corpoTabela");

    if (tabela.rows.length > 0) {
        tabela.deleteRow(tabela.rows.length - 1);
    }

}

function gerarPrograma() {

    const desenho = document.getElementById("desenho").value;
    const peca = document.getElementById("peca").value;
    const cliente = document.getElementById("cliente").value;
    const linhas = document.querySelectorAll("#corpoTabela tr");

    let programa = "";

    programa += `; DESENHO: ${desenho}\n`;
    programa += `; PECA: ${peca}\n`;
    programa += `; CLIENTE: ${cliente}\n`;



    let numeroLinha = 100;

    linhas.forEach(linha => {

        const x = linha.querySelector(".x").value;

        const z = linha.querySelector(".z").value;

        const tipo = linha.querySelector(".tipo").value;

        const raio = linha.querySelector(".raio").value;

        if (tipo === "G01") {

            programa +=
                `N${numeroLinha} G01 X${x} Z${z}\n`;

        } else {

            programa +=
                `N${numeroLinha} ${tipo} X${x} Z${z} CR=${raio}\n`;

        }

        numeroLinha += 10;

    });

    document.getElementById("saida").value = programa;
    desenharPerfil();
}


function desenharPerfil() {

    const canvas = document.getElementById("canvasPerfil");

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const linhas =
        document.querySelectorAll("#corpoTabela tr");

    if (linhas.length < 2) {
        return;
    }

    const pontos = [];

    linhas.forEach(linha => {

        const x = parseFloat(
            linha.querySelector(".x").value
        );

        const z = parseFloat(
            linha.querySelector(".z").value
        );

        if (!isNaN(x) && !isNaN(z)) {

            pontos.push({
                x: x,
                z: z
            });

        }

    });
    // ===== MAIOR E MENOR =====

    const maiorX =
        Math.max(...pontos.map(p => p.x));

    const menorX =
        Math.min(...pontos.map(p => p.x));

    const maiorZ =
        Math.max(...pontos.map(p => p.z));

    const menorZ =
        Math.min(...pontos.map(p => p.z));

    // ===== ESCALA AUTOMÁTICA =====

    const larguraUtil = 700;
    const alturaUtil = 300;

    const escalaX =
        larguraUtil /
        (maiorZ - menorZ || 1);

    const escalaY =
        alturaUtil /
        (maiorX - menorX || 1);

    const escala =
        Math.min(
            escalaX,
            escalaY
        );

    // ===== DESENHO =====


    ctx.beginPath();

    ctx.lineWidth = 2;


    pontos.forEach((ponto, indice) => {

        const posX =
            canvas.width - 50 -
            ((ponto.x - menorX) * escala);

        const posY =
            350 - ((ponto.z - menorZ) * escala);

        if (indice === 0) {

            ctx.moveTo(posX, posY);

        } else {

            ctx.lineTo(posX, posY);

        }

    });

    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.font = "12px Arial";

    pontos.forEach((ponto, indice) => {

        const posX =
            canvas.width - 50 -
            ((ponto.x - menorX) * escala);

        const posY =
            350 - ((ponto.z - menorZ) * escala);

        ctx.fillText(
            "P" + (indice + 1),
            posX + 5,
            posY - 5

        );

    });
}

//Salvar Projeto
function salvarProjeto() {

    const linhas =
        document.querySelectorAll("#corpoTabela tr");

    const dados = [];

    linhas.forEach(linha => {

        dados.push({

            x:
                linha.querySelector(".x").value,

            z:
                linha.querySelector(".z").value,

            tipo:
                linha.querySelector(".tipo").value,

            raio:
                linha.querySelector(".raio").value

        });

    });

    const projeto = {

        desenho:
            document.getElementById("desenho").value,

        peca:
            document.getElementById("peca").value,

        cliente:
            document.getElementById("cliente").value,

        pontos: dados

    };

    const nomeProjeto =
        document.getElementById("nomeProjeto").value;

    localStorage.setItem(
        nomeProjeto,
        JSON.stringify(projeto)
    );

    if (nomeProjeto === "") {

        alert("Digite um nome para o projeto");

        return;

    }


    alert(
        "Projeto salvo com sucesso!"
    );

}
// Carregar Projeto
function carregarProjeto() {
    const nomeProjeto = document.getElementById("listaProjetos").value;

    if (!nomeProjeto) {
        alert("Por favor, selecione um projeto.");
        return;
    }

    const dadoSalvo = localStorage.getItem(nomeProjeto);

    if (!dadoSalvo) {
        alert("Nenhum projeto salvo com esse nome.");
        return;
    }

    let projeto;
    try {
        projeto = JSON.parse(dadoSalvo);
    } catch (e) {
        alert("O item selecionado não é um projeto válido.");
        console.error("Erro ao converter JSON:", e);
        return;
    }

    // Verifica se é um objeto válido
    if (typeof projeto !== "object" || projeto === null) {
        alert("Formato de projeto inválido.");
        return;
    }

    // 1. Limpa o corpo da tabela
    const corpoTabela = document.getElementById("corpoTabela");
    if (corpoTabela) {
        corpoTabela.innerHTML = "";
    }

    // 2. Preenche os campos do cabeçalho
    document.getElementById("desenho").value = projeto.desenho || "";
    document.getElementById("peca").value = projeto.peca || "";
    document.getElementById("cliente").value = projeto.cliente || "";

    // 3. Preenche a tabela com a lista de pontos (usando sua função adicionarLinha)
    if (Array.isArray(projeto.pontos)) {
        projeto.pontos.forEach(item => {
            // Cria a linha HTML padrão da sua aplicação
            if (typeof adicionarLinha === "function") {
                adicionarLinha();
            }

            // Pega a linha que acabou de ser criada
            const ultimaLinha = document.querySelector("#corpoTabela tr:last-child");

            if (ultimaLinha) {
                const inputX = ultimaLinha.querySelector(".x");
                const inputZ = ultimaLinha.querySelector(".z");
                const inputTipo = ultimaLinha.querySelector(".tipo");
                const inputRaio = ultimaLinha.querySelector(".raio");

                if (inputX) inputX.value = item.x || "";
                if (inputZ) inputZ.value = item.z || "";
                if (inputTipo) inputTipo.value = item.tipo || "";
                if (inputRaio) inputRaio.value = item.raio || "";
            }
        });
    }

    alert("Projeto carregado!");
}

// Executa ao carregar a janela
window.onload = function () {
    atualizarListaProjetos();
};

// Atualizar Lista de Projetos
function atualizarListaProjetos() {
    const select = document.getElementById("listaProjetos");
    if (!select) return;

    select.innerHTML = '<option value="">Selecione um projeto...</option>';

    // Chaves que NÃO são projetos completos e devem ser ignoradas
    const chavesIgnoradas = ["peca", "cliente", "desenho"];

    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);

        // Só adiciona ao select se não for uma chave individual simples
        if (!chavesIgnoradas.includes(chave)) {
            const option = document.createElement("option");
            option.value = chave;
            option.textContent = chave;
            select.appendChild(option);
        }
    }
}