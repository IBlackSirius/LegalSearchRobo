import fs from 'fs'

const listFolder = (pathFolder) => {
  try {
    // Lê o conteúdo da pasta sincronamente
    const files = fs.readdirSync(pathFolder);
    return files;
  } catch (erro) {
    console.error('Erro ao listar files:', erro);
    return [];
  }
};

export default listFolder