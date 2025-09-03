const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const alunos = []; // { nome: string, notas: number[] }

function pergunta(q) {
  return new Promise(resolve => {
    readline.question(q, ans => resolve(ans));
  });
}


function adicionarAluno(nome) {
  if (!nome) return console.log("Nome inválido.");
  nome = nome.trim();
  if (alunos.some(a => a.nome.toLowerCase() === nome.toLowerCase())) {
    console.log("Aluno já existe!");
    return;
  }
  alunos.push({ nome, notas: [] });
  console.log(`Aluno ${nome} adicionado.`);
}

function listarAlunos() {
  if (alunos.length === 0) {
    console.log("Nenhum aluno cadastrado.");
    return;
  }
  console.log("Lista de alunos:");
  alunos.forEach(a => console.log(`- ${a.nome} (${a.notas.length} notas)`));
}

function registrarNotas(nome, notasStr) {
  const aluno = alunos.find(a => a.nome.toLowerCase() === nome.toLowerCase());
  if (!aluno) {
    console.log("Aluno não encontrado.");
    return;
  }
  const notas = notasStr.split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  const validas = notas.filter(n => n >= 0 && n <= 10);
  if (validas.length === 0) {
    console.log("Nenhuma nota válida informada.");
    return;
  }
  aluno.notas.push(...validas);
  console.log(`Notas adicionadas para ${aluno.nome}: ${validas.join(", ")}`);
}

function calcularMedia(aluno) {
  if (!aluno.notas.length) return null;
  return aluno.notas.reduce((a, b) => a + b, 0) / aluno.notas.length;
}

function mostrarMediaAluno(nome) {
  const aluno = alunos.find(a => a.nome.toLowerCase() === nome.toLowerCase());
  if (!aluno) return console.log("Aluno não encontrado.");
  const media = calcularMedia(aluno);
  if (media === null) {
    console.log(`${aluno.nome} ainda não tem notas.`);
  } else {
    console.log(`Média de ${aluno.nome}: ${media.toFixed(2)}`);
  }
}

function mostrarAprovados() {
  const aprovados = alunos
    .map(a => ({ nome: a.nome, media: calcularMedia(a) }))
    .filter(a => a.media !== null && a.media >= 7);
  if (aprovados.length === 0) return console.log("Nenhum aluno aprovado.");
  console.log("Aprovados:");
  aprovados.forEach(a => console.log(`${a.nome} — ${a.media.toFixed(2)}`));
}

function estatisticasTurma() {
  const comNotas = alunos.filter(a => calcularMedia(a) !== null);
  if (comNotas.length === 0) return console.log("Sem dados.");
  const medias = comNotas.map(a => calcularMedia(a));
  const mediaGeral = medias.reduce((a, b) => a + b, 0) / medias.length;
  const maior = comNotas.reduce((a, b) => calcularMedia(a) > calcularMedia(b) ? a : b);
  const menor = comNotas.reduce((a, b) => calcularMedia(a) < calcularMedia(b) ? a : b);
  console.log(`Média geral: ${mediaGeral.toFixed(2)}`);
  console.log(`Maior média: ${maior.nome} (${calcularMedia(maior).toFixed(2)})`);
  console.log(`Menor média: ${menor.nome} (${calcularMedia(menor).toFixed(2)})`);
}

function ordenarPorMedia() {
  const copia = [...alunos].filter(a => calcularMedia(a) !== null);
  copia.sort((a, b) => calcularMedia(b) - calcularMedia(a));
  if (copia.length === 0) return console.log("Nenhum aluno com notas.");
  console.log("Alunos ordenados por média:");
  copia.forEach(a => console.log(`${a.nome} — ${calcularMedia(a).toFixed(2)}`));
}

function removerAluno(nome) {
  const idx = alunos.findIndex(a => a.nome.toLowerCase() === nome.toLowerCase());
  if (idx === -1) return console.log("Aluno não encontrado.");
  const removido = alunos.splice(idx, 1)[0];
  console.log(`Aluno ${removido.nome} removido.`);
}

async function main() {
  let sair = false;
  while (!sair) {
    console.log("\n——— Gerenciador de Turma ——");
    console.log("1) Adicionar aluno");
    console.log("2) Listar alunos");
    console.log("3) Registrar notas");
    console.log("4) Calcular média de aluno");
    console.log("5) Mostrar aprovados");
    console.log("6) Estatísticas da turma");
    console.log("7) Ordenar por média e listar");
    console.log("8) Remover aluno");
    console.log("9) Sair");

    const op = (await pergunta("Escolha uma opção: ")).trim();

    switch (op) {
      case '1':
        adicionarAluno(await pergunta("Nome do aluno: "));
        break;
      case '2':
        listarAlunos();
        break;
      case '3':
        registrarNotas(await pergunta("Nome do aluno: "), await pergunta("Notas separadas por vírgula: "));
        break;
      case '4':
        mostrarMediaAluno(await pergunta("Nome do aluno: "));
        break;
      case '5':
        mostrarAprovados();
        break;
      case '6':
        estatisticasTurma();
        break;
      case '7':
        ordenarPorMedia();
        break;
      case '8':
        removerAluno(await pergunta("Nome do aluno: "));
        break;
      case '9':
        sair = true;
        console.log("Encerrando...");
        break;
      default:
        console.log("Opção inválida.");
    }
  }
  readline.close();
}

main();
