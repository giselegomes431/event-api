const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Criar um novo evento
exports.createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  const creatorId = req.userId; // Vindo do middleware de autenticação

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        creatorId,
      },
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: "Não foi possível criar o evento." });
  }
};

// Listar todos os eventos
exports.getAllEvents = async (req, res) => {
  const events = await prisma.event.findMany({
    include: { creator: { select: { name: true } } }, // Inclui o nome do criador
  });
  res.json(events);
};

// Obter um evento específico
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { creator: { select: { name: true, email: true } } },
  });
  if (!event) {
    return res.status(404).json({ error: "Evento não encontrado." });
  }
  res.json(event);
};

// Atualizar um evento (somente o criador pode atualizar)
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    if (event.creatorId !== userId) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para editar este evento." });
    }

    // Cria um objeto apenas com os dados que foram enviados na requisição
    const dataToUpdate = {};
    const { title, description, date, location } = req.body;

    if (title) dataToUpdate.title = title;
    if (description) dataToUpdate.description = description;
    if (location) dataToUpdate.location = location;
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        // Verifica se a data enviada é válida
        return res.status(400).json({ error: "Formato de data inválido." });
      }
      dataToUpdate.date = parsedDate;
    }

    // Verifica se há algo para atualizar
    if (Object.keys(dataToUpdate).length === 0) {
      return res
        .status(400)
        .json({ error: "Nenhum dado fornecido para atualização." });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: dataToUpdate, // Usa o objeto dinâmico
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error("ERRO DETALHADO:", error); // Log aprimorado
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao atualizar o evento." });
  }
};

// Deletar um evento (somente o criador pode deletar)
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const event = await prisma.event.findUnique({ where: { id } });

    if (event.creatorId !== userId) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para deletar este evento." });
    }

    await prisma.event.delete({ where: { id } });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res
      .status(404)
      .json({ error: "Evento não encontrado ou erro ao deletar." });
  }
};

exports.registerForEvent = async (req, res) => {
  // O ID do evento vem da URL (ex: /events/ID_DO_EVENTO/register)
  const eventId = req.params.id;
  // O ID do usuário vem do token JWT que o middleware de autenticação validou
  const userId = req.userId;

  try {
    // Para garantir que o usuário não está se inscrevendo em um evento que não existe
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    // Tenta criar a nova inscrição na tabela 'Registration'
    const registration = await prisma.registration.create({
      data: {
        userId: userId,
        eventId: eventId,
      },
    });

    res
      .status(201)
      .json({ message: "Inscrição realizada com sucesso!", registration });
  } catch (error) {
    // O Prisma retorna o código 'P2002' quando uma constraint única falha.
    // No nosso schema, '@@unique([eventId, userId])' causa isso.
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Você já está inscrito neste evento." }); // 409 Conflict
    }

    // Para qualquer outro tipo de erro inesperado
    console.error("Erro ao registrar no evento:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao tentar se inscrever." });
  }
};
