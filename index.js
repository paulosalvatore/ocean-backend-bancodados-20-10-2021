const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

(async () => {
    // Conectar com o banco de dados
    // Pegar a minha collection

    const url = "mongodb://localhost:27017";
    const dbName = "ocean_bancodados_20_10_2021";

    console.info("Conectando ao banco de dados MongoDB...");

    const client = await MongoClient.connect(url);

    console.info("MongoDB conectado com sucesso.");

    const db = client.db(dbName);

    const collection = db.collection("herois");

    app.use(express.json());

    // Endpoints de 'Hello'

    app.get("/", function (req, res) {
        res.send("Hello, World!");
    });

    app.get("/oi", function (req, res) {
        res.send("Olá, mundo!");
    });

    // Lista de heróis

    const lista = [
        {
            id: 1,
            nome: "Mulher Maravilha",
        },
        {
            id: 2,
            nome: "Capitã Marvel",
        },
        {
            id: 3,
            nome: "Homem de Ferro",
        },
    ];

    // Função de findById

    async function findById(id) {
        const item = await collection.findOne({ _id: ObjectId(id) });

        return item;
    }

    // Endpoint de Read All

    app.get("/herois", async function (req, res) {
        const resultado = await collection.find().toArray();

        res.send(resultado);
    });

    // Endpoint de Read Single (by Id)

    app.get("/herois/:id", async function (req, res) {
        const id = req.params.id;

        const item = await findById(id);

        if (!item) {
            res.status(404).send("Item não encontrado.");

            // Return encerra a função
            return;
        }

        res.send(item);
    });

    // Endpoint de Create

    app.post("/herois", function (req, res) {
        const item = req.body;

        if (!item || !item.nome) {
            res.status(400).send(
                "Corpo da requisição não encontrado ou está faltando a chave 'nome'."
            );

            return;
        }

        item.id = lista.length + 1;

        lista.push(item);

        res.status(201).send(item);
    });

    // Endpoint de Update

    app.put("/herois/:id", function (req, res) {
        const id = +req.params.id;

        const itemAtual = findById(id);

        if (!itemAtual) {
            res.status(404).send("Item não encontrado.");

            // Return encerra a função
            return;
        }

        const item = req.body;

        if (!item || !item.nome) {
            res.status(400).send(
                "Corpo da requisição não encontrado ou está faltando a chave 'nome'."
            );

            return;
        }

        const indice = lista.indexOf(itemAtual);

        item.id = itemAtual.id;

        lista[indice] = item;

        res.send(item);
    });

    // Endpoint de Delete

    app.delete("/herois/:id", function (req, res) {
        const id = +req.params.id;

        const item = findById(id);

        if (!item) {
            res.status(404).send("Item não encontrado.");

            // Return encerra a função
            return;
        }

        const indice = lista.indexOf(item);

        delete lista[indice];

        res.send("Item removido com sucesso.");
    });

    app.listen(3000);
})();
