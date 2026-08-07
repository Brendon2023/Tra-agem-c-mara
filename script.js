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
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const linhas = document.querySelectorAll("#corpoTabela tr");
    if (linhas.length < 2) return;

    const pontos = [];

    // 1. LEITURA DOS DADOS DA TABELA
    linhas.forEach((linha, index) => {
        const inputX = linha.querySelector(".x")?.value || "0";
        const inputZ = linha.querySelector(".z")?.value || "0";
        const inputRaio = linha.querySelector(".raio")?.value || "0";

        const x = parseFloat(inputX.toString().replace(",", "."));
        const z = parseFloat(inputZ.toString().replace(",", "."));
        const raio = parseFloat(inputRaio.toString().replace(",", ".")) || 0;

        if (!isNaN(x) && !isNaN(z)) {
            pontos.push({
                nome: "P" + (index + 1),
                x: x,
                z: z,
                raio: raio
            });
        }
    });

    if (pontos.length < 2) return;

    // 2. EXTREMOS PARA ESCALA
    const minX = Math.min(...pontos.map(p => p.x));
    const maxX = Math.max(...pontos.map(p => p.x));
    const minZ = Math.min(...pontos.map(p => p.z));
    const maxZ = Math.max(...pontos.map(p => p.z));

    const deltaX = (maxX - minX) || 1;
    const deltaZ = (maxZ - minZ) || 1;

    // Margens e área útil
    const padding = 60;
    const larguraUtil = canvas.width - (padding * 2);
    const alturaUtil = canvas.height - (padding * 2);

    // Escala uniforme para não deformar a peça
    const escala = Math.min(larguraUtil / deltaZ, alturaUtil / deltaX);

    // Centralização da figura no Canvas
    const offsetX = padding + (larguraUtil - (deltaZ * escala)) / 2;
    const offsetY = padding + (alturaUtil - (deltaX * escala)) / 2;

    // 3. MAPEAMENTO DE ORIENTAÇÃO (DEITADO)
    // Z determina a posição da esquerda para a direita (Horizontal)
    // X determina a altura (Vertical: Maior X em cima, menor X no fundo)
    function paraPixels(p) {
        return {
            x: offsetX + ((p.z - minZ) * escala),  // P1 (Z=0) na esquerda -> Z negativo/positivo avança à direita
            y: offsetY + ((maxX - p.x) * escala)    // Diâmetros maiores no topo, menores no fundo
        };
    }

    // 4. DESENHO COM CURVATURAS EXPLICITAS E SUAVES
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";

    const pInicio = paraPixels(pontos[0]);
    ctx.moveTo(pInicio.x, pInicio.y);

    for (let i = 0; i < pontos.length - 1; i++) {
        const pAtual = paraPixels(pontos[i]);
        const pProximo = paraPixels(pontos[i + 1]);
        const raioValor = pontos[i + 1].raio;

        if (raioValor > 0 && i < pontos.length - 2) {
            const pFuturo = paraPixels(pontos[i + 2]);
            
            // Multiplicador visual para dar mais curvatura e destaque aos arcos (R0.6, R2.0, R2.4, R6.6)
            const raioPixels = Math.max(raioValor * escala * 1.2, 4);

            ctx.lineTo(pAtual.x, pAtual.y);
            ctx.arcTo(pProximo.x, pProximo.y, pFuturo.x, pFuturo.y, raioPixels);
        } else {
            ctx.lineTo(pProximo.x, pProximo.y);
        }
    }

    const pFim = paraPixels(pontos[pontos.length - 1]);
    ctx.lineTo(pFim.x, pFim.y);
    ctx.stroke();

    // 5. MARCADORES E NOMES DOS PONTOS (P1..P11)
    ctx.font = "bold 12px Arial";

    pontos.forEach((p) => {
        const pos = paraPixels(p);

        // Ponto em vermelho
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3.5, 0, 2 * Math.PI);
        ctx.fill();

        // Rótulo do Ponto
        ctx.fillStyle = "red";
        ctx.fillText(p.nome, pos.x - 8, pos.y - 10);
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