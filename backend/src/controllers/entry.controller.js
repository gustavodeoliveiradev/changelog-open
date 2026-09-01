const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

// Função auxiliar: confirma que o projeto existe E pertence ao usuário logado
async function findOwnedProject(projectId, userId) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    return { error: 404, message: 'Projeto não encontrado' };
  }

  if (project.userId !== userId) {
    return { error: 403, message: 'Você não tem permissão para acessar este projeto' };
  }

  return { project };
}

async function createEntry(req, res) {
  try {
    const { projectId } = req.params;
    const { version, title, items } = req.body;

    if (!version || !title) {
      return res.status(400).json({ error: 'Versão e título são obrigatórios' });
    }

    const check = await findOwnedProject(projectId, req.userId);
    if (check.error) {
      return res.status(check.error).json({ error: check.message });
    }

    const entry = await prisma.entry.create({
      data: {
        version,
        title,
        projectId,
        items: {
          create: (items || []).map((item, index) => ({
            type: item.type,
            description: item.description,
            order: index,
          })),
        },
      },
      include: { items: true }, // devolve a entry já com os itens dentro
    });

    return res.status(201).json(entry);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar entrada' });
  }
}

async function listEntries(req, res) {
  try {
    const { projectId } = req.params;

    const check = await findOwnedProject(projectId, req.userId);
    if (check.error) {
      return res.status(check.error).json({ error: check.message });
    }

    const entries = await prisma.entry.findMany({
      where: { projectId },
      include: { items: true },
      orderBy: { publishedAt: 'desc' },
    });

    return res.status(200).json(entries);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao listar entradas' });
  }
}

async function updateEntry(req, res) {
  try {
    const { projectId, entryId } = req.params;
    const { version, title } = req.body;

    const check = await findOwnedProject(projectId, req.userId);
    if (check.error) {
      return res.status(check.error).json({ error: check.message });
    }

    const entry = await prisma.entry.findUnique({ where: { id: entryId } });

    if (!entry || entry.projectId !== projectId) {
      return res.status(404).json({ error: 'Entrada não encontrada neste projeto' });
    }

    const updated = await prisma.entry.update({
      where: { id: entryId },
      data: {
        version: version ?? entry.version,
        title: title ?? entry.title,
      },
      include: { items: true },
    });

    return res.status(200).json(updated);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar entrada' });
  }
}

async function deleteEntry(req, res) {
  try {
    const { projectId, entryId } = req.params;

    const check = await findOwnedProject(projectId, req.userId);
    if (check.error) {
      return res.status(check.error).json({ error: check.message });
    }

    const entry = await prisma.entry.findUnique({ where: { id: entryId } });

    if (!entry || entry.projectId !== projectId) {
      return res.status(404).json({ error: 'Entrada não encontrada neste projeto' });
    }

    // Apaga os items primeiro (dependência), depois a entry
    await prisma.entryItem.deleteMany({ where: { entryId } });
    await prisma.entry.delete({ where: { id: entryId } });

    return res.status(204).send();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao apagar entrada' });
  }
}

module.exports = { createEntry, listEntries, updateEntry, deleteEntry };