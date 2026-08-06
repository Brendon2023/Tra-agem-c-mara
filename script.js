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

    const classe = document.getElementById("classe").value;

    const linhas = document.querySelectorAll("#corpoTabela tr");

    let programa = "";

    programa += `; DESENHO: ${desenho}\n`;
    programa += `; PECA: ${peca}\n`;

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