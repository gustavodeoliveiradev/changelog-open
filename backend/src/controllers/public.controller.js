const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function getPublicChangelog(req, res) {
  try {
    const { slug } = req.params;

    const project = await prisma.project.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isPublic: true,
        entries: {
          orderBy: { publishedAt: 'desc' },
          select: {
            id: true,
            version: true,
            title: true,
            publishedAt: true,
            items: {
              select: {
                id: true,
                type: true,
                description: true,
                order: true,
              },
            },
          },
        },
      },
    });

    if (!project || !project.isPublic) {
      return res.status(404).json({ error: 'Changelog não encontrado' });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar changelog' });
  }
}

module.exports = { getPublicChangelog };