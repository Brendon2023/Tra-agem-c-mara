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
// Configuração do Worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ==========================================
// FUNÇÕES ORIGINAIS DO SEU PROJETO
// ==========================================

function adicionarLinha() {
    const tabela = document.getElementById("corpoTabela");
    const numeroPonto = tabela.rows.length + 1;
    const linha = document.createElement("tr");

    linha.innerHTML = `
        <td>P${numeroPonto}</td>
        <td><input type="number" step="0.001" class="x"></td>
        <td><input type="number" step="0.001" class="z"></td>
        <td>
            <select class="tipo">
                <option value="G01">Linha</option>
                <option value="G02">G02</option>
                <option value="G03">G03</option>
            </select>
        </td>
        <td><input type="number" step="0.001" class="raio"></td>
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
            programa += `N${numeroLinha} G01 X${x} Z${z}\n`;
        } else {
            programa += `N${numeroLinha} ${tipo} X${x} Z${z} CR=${raio}\n`;
        }
        numeroLinha += 10;
    });

    document.getElementById("saida").value = programa;
    if (typeof desenharPerfil === "function") {
        desenharPerfil();
    }
}

function salvarProjeto() {
    const linhas = document.querySelectorAll("#corpoTabela tr");
    const dados = [];

    linhas.forEach(linha => {
        dados.push({
            x: linha.querySelector(".x").value,
            z: linha.querySelector(".z").value,
            tipo: linha.querySelector(".tipo").value,
            raio: linha.querySelector(".raio").value
        });
    });

    const projeto = {
        desenho: document.getElementById("desenho").value,
        peca: document.getElementById("peca").value,
        cliente: document.getElementById("cliente").value,
        pontos: dados
    };

    const nomeProjeto = document.getElementById("nomeProjeto").value;

    if (nomeProjeto === "") {
        alert("Digite um nome para o projeto");
        return;
    }

    localStorage.setItem(nomeProjeto, JSON.stringify(projeto));
    alert("Projeto salvo com sucesso!");
    atualizarListaProjetos();
}

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

    if (typeof projeto !== "object" || projeto === null) {
        alert("Formato de projeto inválido.");
        return;
    }

    const corpoTabela = document.getElementById("corpoTabela");
    if (corpoTabela) {
        corpoTabela.innerHTML = "";
    }

    document.getElementById("desenho").value = projeto.desenho || "";
    document.getElementById("peca").value = projeto.peca || "";
    document.getElementById("cliente").value = projeto.cliente || "";

    if (Array.isArray(projeto.pontos)) {
        projeto.pontos.forEach(item => {
            adicionarLinha();
            const ultimaLinha = document.querySelector("#corpoTabela tr:last-child");
            if (ultimaLinha) {
                if (item.x !== undefined) ultimaLinha.querySelector(".x").value = item.x;
                if (item.z !== undefined) ultimaLinha.querySelector(".z").value = item.z;
                if (item.tipo !== undefined) ultimaLinha.querySelector(".tipo").value = item.tipo;
                if (item.raio !== undefined) ultimaLinha.querySelector(".raio").value = item.raio;
            }
        });
    }

    alert("Projeto carregado!");
}

window.onload = function () {
    atualizarListaProjetos();
};

function atualizarListaProjetos() {
    const select = document.getElementById("listaProjetos");
    if (!select) return;

    select.innerHTML = '<option value="">Selecione um projeto...</option>';
    const chavesIgnoradas = ["peca", "cliente", "desenho"];

    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        if (!chavesIgnoradas.includes(chave)) {
            const option = document.createElement("option");
            option.value = chave;
            option.textContent = chave;
            select.appendChild(option);
        }
    }
}


// ==========================================
// LÓGICA DE IMPORTAÇÃO E OCR DE PDF/IMAGEM
// ==========================================

document.getElementById('pdfFileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById('statusOCR');
    statusEl.innerText = "Processando arquivo...";

    try {
        let imageSrc = file;

        // Se for PDF, renderiza a 1ª página em um canvas
        if (file.type === 'application/pdf') {
            statusEl.innerText = "Convertendo PDF em Imagem...";
            imageSrc = await renderPdfToImage(file);
        }

        statusEl.innerText = "Lendo texto do documento (OCR)...";
        const textResult = await processarOCR(imageSrc);

        statusEl.innerText = "Preenchendo formulário e tabela...";
        preencherDadosExtraidos(textResult);

        statusEl.innerText = "Importação concluída com sucesso!";
    } catch (error) {
        console.error(error);
        statusEl.innerText = "Erro ao processar o arquivo. Certifique-se de que é uma imagem ou PDF válido.";
    }
});

// Renderiza o PDF para Canvas e exporta a imagem
async function renderPdfToImage(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const scale = 2.0; // Aumenta resolução para melhor leitura
    const viewport = page.getViewport({ scale });

    const canvas = document.getElementById('pdfCanvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    return canvas.toDataURL('image/png');
}

// Roda o Tesseract OCR
async function processarOCR(imageSource) {
    const worker = await Tesseract.createWorker('por');
    const ret = await worker.recognize(imageSource);
    await worker.terminate();
    return ret.data.text;
}

// Lê o texto e insere diretamente nos inputs da tela
function preencherDadosExtraidos(rawText) {
    const lines = rawText.split('\n');

    // Tenta encontrar a 'Operação' para preencher o nome da Peça
    const linhaOperacao = lines.find(l => l.toUpperCase().includes('OPERAÇÃO') || l.toUpperCase().includes('OPERACAO'));
    if (linhaOperacao) {
        const nomeOperacao = linhaOperacao.split(':')[1]?.trim();
        if (nomeOperacao) {
            document.getElementById('peca').value = nomeOperacao;
        }
    }

    // Procura por sequências de X, Z e Raios (R)
    let currentX = null;
    let currentZ = null;
    let currentR = null;

    lines.forEach(line => {
        // Limpa possíveis símbolos comuns de diâmetro (Ø, ∅)
        const cleanLine = line.trim().replace(/Ø|∅/g, '0');

        // Regex para capturar valores de X, Z e R
        const matchX = cleanLine.match(/X\s*=\s*(-?\d+[.,]?\d*)/i);
        const matchZ = cleanLine.match(/Z\s*=\s*(-?\d+[.,]?\d*)/i);
        const matchR = cleanLine.match(/R\s*=?\s*(-?\d+[.,]?\d*)/i);

        if (matchX) currentX = parseFloat(matchX[1].replace(',', '.'));
        if (matchZ) currentZ = parseFloat(matchZ[1].replace(',', '.'));
        if (matchR) currentR = parseFloat(matchR[1].replace(',', '.'));

        // Quando encontra tanto um X quanto um Z na sequência de leitura, adiciona a linha
        if (currentX !== null && currentZ !== null) {
            adicionarLinha();
            const ultimaLinha = document.querySelector("#corpoTabela tr:last-child");

            if (ultimaLinha) {
                ultimaLinha.querySelector(".x").value = currentX;
                ultimaLinha.querySelector(".z").value = currentZ;

                if (currentR !== null) {
                    ultimaLinha.querySelector(".tipo").value = "G02"; // Define tipo com raio por padrão
                    ultimaLinha.querySelector(".raio").value = currentR;
                } else {
                    ultimaLinha.querySelector(".tipo").value = "G01";
                }
            }

            // Reseta para o próximo ponto
            currentX = null;
            currentZ = null;
            currentR = null;
        }
    });
}