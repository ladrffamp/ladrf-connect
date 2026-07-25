import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tipoExportacao = document.getElementById("tipoExportacao");
const previewDados = document.getElementById("previewDados");
const btnExcel = document.getElementById("exportarExcel");
const btnPDF = document.getElementById("exportarPDF");

let dadosExportacao = [];

// ======================================
// CARREGAR DADOS
// ======================================

async function carregarDados() {

    const colecao = tipoExportacao.value;

    try {

        const snapshot = await getDocs(
            collection(db, colecao)
        );

        dadosExportacao = [];

        snapshot.forEach((doc) => {

            dadosExportacao.push({
                id: doc.id,
                ...doc.data()
            });

        });

        atualizarPreview();

    } catch (erro) {

        console.error(erro);

        previewDados.innerHTML = `
        <tr>
            <td colspan="2">
                Erro ao carregar dados.
            </td>
        </tr>
        `;

    }

}
// ======================================
// PREVIEW
// ======================================

function atualizarPreview() {

    previewDados.innerHTML = "";

    if (dadosExportacao.length === 0) {

        previewDados.innerHTML = `
        <tr>
            <td colspan="2" style="text-align:center;">
                Nenhum registro encontrado.
            </td>
        </tr>
        `;

        return;

    }

    const primeiro = dadosExportacao[0];

    Object.keys(primeiro).forEach((campo) => {

        if (campo === "id") return;

        let valor = primeiro[campo];

        if (
            valor &&
            typeof valor === "object" &&
            valor.seconds
        ) {
            valor = new Date(
                valor.seconds * 1000
            ).toLocaleString("pt-BR");
        }

        if (typeof valor === "object") {
            valor = JSON.stringify(valor);
        }

        previewDados.innerHTML += `
        <tr>
            <td><strong>${campo}</strong></td>
            <td>${valor ?? "-"}</td>
        </tr>
        `;

    });

}

// ======================================
// ALTERAR TIPO
// ======================================

tipoExportacao.addEventListener(
    "change",
    carregarDados
);

// carregar ao abrir
carregarDados();
// ======================================
// EXPORTAR EXCEL
// ======================================

btnExcel.addEventListener("click", () => {

    if (dadosExportacao.length === 0) {
        alert("Não existem dados para exportar.");
        return;
    }

    const planilha = XLSX.utils.json_to_sheet(dadosExportacao);

    const arquivo = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        arquivo,
        planilha,
        tipoExportacao.value
    );

    XLSX.writeFile(
        arquivo,
        `${tipoExportacao.value}.xlsx`
    );

});



// ======================================
// EXPORTAR PDF
// ======================================

btnPDF.addEventListener("click", () => {

    if (dadosExportacao.length === 0) {
        alert("Não existem dados para exportar.");
        return;
    }

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("LADRF Connect", 14, 18);

    pdf.setFontSize(12);
    pdf.text(
        `Exportação: ${tipoExportacao.value}`,
        14,
        28
    );

    pdf.text(
        `Data: ${new Date().toLocaleString("pt-BR")}`,
        14,
        36
    );

    let y = 50;

    dadosExportacao.forEach((item, indice) => {

        pdf.setFontSize(11);

        pdf.text(
            `Registro ${indice + 1}`,
            14,
            y
        );

        y += 8;
              Object.entries(item).forEach(([campo, valor]) => {

            if (campo === "id") return;

            if (
                valor &&
                typeof valor === "object" &&
                valor.seconds
            ) {
                valor = new Date(
                    valor.seconds * 1000
                ).toLocaleString("pt-BR");
            }

            if (typeof valor === "object") {
                valor = JSON.stringify(valor);
            }

            pdf.text(
                `${campo}: ${valor ?? "-"}`,
                18,
                y
            );

            y += 7;

            if (y > 275) {

                pdf.addPage();

                y = 20;

            }

        });

        y += 8;

    });

    pdf.save(`${tipoExportacao.value}.pdf`);

});
// ======================================
// FINALIZAÇÃO PDF
// ======================================

        // quebra de página automática
        if (y > 275) {

            pdf.addPage();

            y = 20;

        }

    });


    pdf.save(
        `${tipoExportacao.value}.pdf`
    );


});
