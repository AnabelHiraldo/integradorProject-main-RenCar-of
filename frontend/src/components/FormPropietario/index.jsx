import { ErrorMessage, Field, Form, Formik } from "formik";
import "./styleClients.css";
import { clientsValidation } from "../../validations/clients.js";
import { useEffect, useState } from "react";
import { companyValidation } from "../../validations/company.js";
import PersonForm from "./Person/index.jsx";
import CompanyForm from "./Company/index.jsx";
import axios from "axios";
import Swal from "sweetalert2";
import PropietarioPersonForm from "./Person/index.jsx";

export default function FormPropietario() {
  const [isClient, setIsClient] = useState(true);
  const [initialEntitiesValues, setInitialEntitiesValues] = useState([]);
  const [sexo, setSexo] = useState([]);
  const [typeDocument, setTypeDocument] = useState([]);
  const [getClient, setGetClient] = useState([]);
  const [province, setProvince] = useState([])
  const [ciudad, setCiudad] = useState([])

  const handleSubmit = (values, editing) => {
    const url = `http://localhost:3000/api/${
      !editing ? "propietario" : `propietario/${values.id_entidad}`
    }`;
    const method = !editing ? "post" : "put";

    axios[method](url, values)
      .then((response) => {
        Swal.fire({
          title: "RentEasy Alert",
          text: "Propietario Registrado",
          icon: "success"
        })
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: "RentEasy Alert",
          text: "Hubo un error al registrar el Propietario",
          icon: "error"
        })
      });

      console.log(values)
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/typeDocument").then((response) => {
      setTypeDocument(response.data);
    });

    axios.get("http://localhost:3000/api/sexo").then((response) => {
      setSexo(response.data);
    });

    axios.get("http://localhost:3000/api/entityType").then((response) => {
      setInitialEntitiesValues(response.data);
    });

    axios.get("http://localhost:3000/api/province").then((response) => {
      setProvince(response.data);
    });
    const id=1;
    axios
    .get(`http://localhost:3000/api/ciudad/${id}`)
    .then((response) => {
      response.data ? setCiudad(response.data) : "";
      // console.log(response.data);
    });
  }, []);

  return (
    <section className="section1">
      <header>
        <h1>Formulario Propietarios</h1>
      </header>
      {isClient ? (
        <PropietarioPersonForm
          handleSubmit={handleSubmit}
          setIsClient={setIsClient}
          initialEntitiesValues={initialEntitiesValues}
          typeDocument={typeDocument}
          getClient={getClient}
          sexo={sexo}
          ciudad={ciudad}
          province={province}
          idEntidad={
            initialEntitiesValues.find((entity) => entity.nombre === "Persona")
              ?.id_tipo_entidad
          }
        />
      ) : (
        <CompanyForm
          handleSubmit={handleSubmit}
          setIsClient={setIsClient}
          initialEntitiesValues={initialEntitiesValues}
          typeDocument={typeDocument}
          idEntidad={
            initialEntitiesValues.find((entity) => entity.nombre === "Empresa")
              ?.id_tipo_entidad
          }
        />
      )}
    </section>
  );
}
