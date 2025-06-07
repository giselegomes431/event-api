const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// Registrar novo usuário
exports.register = async (req, res) => {
  // Log inicial para saber que a função foi chamada
  console.log("--- NOVA TENTATIVA DE REGISTRO ---");
  console.log("Timestamp:", new Date().toISOString());
  // Log do corpo da requisição para ver o que o servidor está recebendo
  console.log(
    "Corpo da requisição recebido:",
    JSON.stringify(req.body, null, 2)
  );

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("ERRO: Campos ausentes para o registro.");
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios." });
  }

  try {
    console.log(`Criptografando senha para o email: ${email}`);
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Tentando criar usuário no banco: ${email}`);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    delete user.password;
    console.log(`Usuário ${email} criado com sucesso. Enviando resposta.`);
    res.status(201).json(user);
  } catch (error) {
    console.error("--- ERRO CRÍTICO CAPTURADO NO REGISTRO ---");
    // O Prisma tem um código de erro específico para falha de constraint única (como email duplicado)
    if (error.code === "P2002") {
      console.error("DETECÇÃO: O email já existe (Código Prisma P2002).");
    }
    console.error("MENSAGEM DO ERRO:", error.message);
    console.error("STACK TRACE DO ERRO:", error.stack);
    console.error("OBJETO COMPLETO DO ERRO:", JSON.stringify(error, null, 2));

    // A resposta para o usuário continua a mesma
    res.status(400).json({ error: "Este e-mail já está em uso." });
  }
};

// Login do usuário
exports.login = async (req, res) => {
  // Log inicial para saber que a função foi chamada
  console.log("--- NOVA TENTATIVA DE LOGIN ---");
  console.log("Timestamp:", new Date().toISOString());
  // Log do corpo da requisição para ver o que o servidor está recebendo
  console.log(
    "Corpo da requisição recebido:",
    JSON.stringify(req.body, null, 2)
  );

  const { email, password } = req.body;

  // Verificação para garantir que o body foi interpretado corretamente
  if (!email || !password) {
    console.log("ERRO: Email ou senha ausente no corpo da requisição.");
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    console.log(`Buscando usuário no banco: ${email}`);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log(`Usuário ${email} não foi encontrado no banco.`);
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    console.log(`Usuário ${email} encontrado. Comparando a senha...`);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`Senha inválida para o usuário ${email}.`);
      return res.status(401).json({ error: "Senha inválida." });
    }
    console.log(`Senha para ${email} é válida. Gerando o token JWT...`);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log(
      `Token gerado com sucesso para ${email}. Enviando resposta OK.`
    );
    res.json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    // ESTE É O LOG MAIS IMPORTANTE DE TODOS
    console.error("--- ERRO CRÍTICO CAPTURADO NO LOGIN ---");
    console.error("MENSAGEM DO ERRO:", error.message);
    console.error("STACK TRACE DO ERRO:", error.stack);
    console.error("OBJETO COMPLETO DO ERRO:", JSON.stringify(error, null, 2));

    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
