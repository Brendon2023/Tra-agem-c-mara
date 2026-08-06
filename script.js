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
            50 + (ponto.x - menorX) * escala;

        const posY =
            350 - (ponto.z - menorZ) * escala;

        if (indice === 0) {

            ctx.moveTo(posX, posY);

        } else {

            ctx.lineTo(posX, posY);

        }

    });

    ctx.stroke();
}
ctx.fillStyle = "red";
ctx.font = "12px Arial";

pontos.forEach((ponto, indice) => {

    const posX =
    50 + (ponto.x - menorX) * escala;

    const posY =
    350 - (ponto.z - menorZ) * escala;

    ctx.fillText(
        "P" + (indice + 1),
        posX + 5,
        posY - 5
    );

});