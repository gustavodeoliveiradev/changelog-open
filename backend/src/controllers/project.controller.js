const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

// Transforma "Meu App Legal" em "meu-app-legal"
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
    .replace(/\s+/g, '-') // espaços viram hífen
    .replace(/-+/g, '-'); // remove hífens duplicados
}

async function createProject(req, res) {
  try {
    const { name, description, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'O nome do projeto é obrigatório' });
    }

    let slug = slugify(name);

    // Garante que o slug seja único, adicionando um sufixo se precisar
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        description: description || null,
        isPublic: isPublic ?? true,
        userId: req.userId, // vem do token, nunca do body
      },
    });

    return res.status(201).json(project);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar projeto' });
  }
}

async function listProjects(req, res) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(projects);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao listar projetos' });
  }
}

async function getProject(req, res) {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.userId !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para acessar este projeto' });
    }

    return res.status(200).json(project);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar projeto' });
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.userId !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para editar este projeto' });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: name ?? project.name,
        description: description ?? project.description,
        isPublic: isPublic ?? project.isPublic,
      },
    });

    return res.status(200).json(updated);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.userId !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para apagar este projeto' });
    }

    await prisma.project.delete({ where: { id } });

    return res.status(204).send();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao apagar projeto' });
  }
}

module.exports = { createProject, listProjects, getProject, updateProject, deleteProject };