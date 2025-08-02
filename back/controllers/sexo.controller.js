const { sql } = require("../dbConnection");

const sexo = {};

sexo.create = async (req, res) => {
  return res.json({ message: "Position created" });
};

sexo.update = async (req, res) => {
  return res.json({ message: "Position Updated" });
};

sexo.deleteOne = async (req, res) => {
  return res.json({ message: "Position created" });
};

sexo.getAll = async (req, res) => {
  try {
    const query = await sql.query("select * from sexo");

    return res.json(query.recordset);
  } catch (error) {
    console.error("Error getting data", error);
    res.status(500).send("Error getting data");
  }
  return res.json({ message: "Position created" });
};

sexo.getOne = async (req, res) => {
  return res.json({ message: "Position created" });
};

module.exports = sexo;
