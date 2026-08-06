function adicionarLinha() {

    const tabela = document.getElementById("corpoTabela");

    const linha = document.createElement("tr");

    linha.innerHTML = `
        <td><input type="number" step="0.001" class="x"></td>

        <td><input type="number" step="0.001" class="z"></td>

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

function gerarPrograma() {

    const linhas = document.querySelectorAll("#corpoTabela tr");

    let programa = "";

    let numeroLinha = 100;

    linhas.forEach(linha => {

        const x = linha.querySelector(".x").value;
        const z = linha.querySelector(".z").value;
        const tipo = linha.querySelector(".tipo").value;
        const raio = linha.querySelector(".raio").value;

        if(tipo === "G01"){

            programa +=
            `N${numeroLinha} G01 X${x} Z${z}\n`;

        }else{

            programa +=
            `N${numeroLinha} ${tipo} X${x} Z${z} CR=${raio}\n`;

        }

        numeroLinha += 10;

    });

    document.getElementById("saida").value = programa;
}