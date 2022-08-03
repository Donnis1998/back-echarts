const express = require("express");
const app = express();
const morgan = require("morgan");
const fs = require("fs");
const bodyParser = require("body-parser");
var cors = require("cors");

//Configuraciones
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 2);

//Middleware
app.use(morgan("dev"));
/* app.use(express.urlencoded({ extended: false }));
app.use(express.json()); */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Nuestro primer WS Get
app.get("/", (req, res) => {
  try {
    const dir = "./files";
    const files = fs.readdirSync(dir);
    let data = [];

    for (const file of files) {
      let filename = file.split(".json")[0];
      //console.log(filename);
      data.push({ id: filename, label: filename });
    }

    res.json(data).status(200);
  } catch (error) {
    console.log("Error al obtener lista de archivos", error);
    res.status(500).json({ message: error });
  }
});

app.get("/:id", (req, res) => {
  try {
    let filename = req.params.id;
    let data;
    let rawdata = fs.readFileSync(`./files/${filename}.json`);
    data = JSON.parse(rawdata);
    res.json(data).status(200);
  } catch (error) {
    console.log("Error al obtener archivo con nombre " + req.params.id, error);
    res.status(500).json({ message: error });
  }
});

app.post("/register", (req, res) => {
  try {
    const { name, chart } = req.body;
    let data = JSON.stringify(chart);
    fs.writeFileSync("./files/" + name + ".json", data);
    res.status(204).json({});
  } catch (error) {
    console.log("Error al crear el archivo con nombre " + req.body.name, error);
    res.status(500).json({ message: error });
  }
});

app.delete("/delete/:id", (req, res) => {
  try {
    let filename = req.params.id;
    fs.unlinkSync(`./files/${filename}.json`);
    res.status(204).send("sucess");
  } catch (error) {
    console.log(
      "Error al eliminar el archivo con nombre " + req.params.id,
      error
    );
    res.status(500).json({ message: error });
  }
});

//Iniciando el servidor
app.listen(app.get("port"), () => {
  console.log(`Server listening on port ${app.get("port")}`);
});
