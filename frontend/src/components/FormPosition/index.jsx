import axios from "axios";
import "./stylePosition.css"
import { ErrorMessage, Formik, Field, Form } from "formik";

export default function FormPosition(){

  const handleSubmit = (value) =>{
     axios.post("http://localhost:3000/api/position", value).then ((response) =>{
    })
  }

    return (
        <section className="section1">
          <header>
            <h1>Formulario Position</h1>
          </header>
          <Formik
               initialValues={ {
                nombre: "",
                descripcion: "",
                salario: "",
                estado: "",
            } }
            onSubmit={(values, {resetForm})=>{
              handleSubmit(values);
              console.log(values)
               resetForm({
                 nombre: "",
                 descripcion: "",
                 salario: "",
                 estado: "",
             });
            }}
            >
              {({isSubmitting, handleChange}) =>(
                   <Form>
                   <div className="group">
                     <div className="field">
                       <label className="label">Nombre</label>
                       <div className="control">
                         <Field
                           className="input"
                           type="text"
                           name="nombre"
                           placeholder="nombre"
                         ></Field>
                         <ErrorMessage
                           name="nombre"
                           component="p"
                           className="help is-danger"
                         ></ErrorMessage>
                       </div>
                     </div>
                     <div className="field">
                       <label className="label">Descripcion</label>
                       <div className="control">
                         <Field
                           className="input"
                           type="text"
                           name="descripcion"
                           placeholder="descripcion"
                         ></Field>
                         <ErrorMessage
                           name="descripcion"
                           component="p"
                           className="help is-danger"
                         ></ErrorMessage>
                       </div>
                     </div>
                     <div className="field">
                       <label className="label">Salario</label>
                       <div className="control">
                         <Field
                           className="input"
                           type="number"
                           name="salario"
                           placeholder="salario"
                         ></Field>
                         <ErrorMessage
                           name="salario"
                           component="p"
                           className="help is-danger"
                         ></ErrorMessage>
                       </div>
                     </div>
                     <div className="field">
                       <label className="label">Estado</label>
                       <div className="control">
                         <Field
                           className="input"
                           type="text"
                           name="estado"
                           placeholder="estado"
                         ></Field>
                         <ErrorMessage
                           name="estado"
                           component="p"
                           className="help is-danger"
                         ></ErrorMessage>
                       </div>
                     </div>
                   </div>
                  
                   <div className="field-is-grouped">
                       <div className="control">
                       {/* <button className="button-is-primary" type="submit" disabled={ isSubmitting }>  Esta es la que va*/}
                         <button className="button-is-primary" type="submit">
                           Enviar
                         </button>
                       </div>
                       <div className="control">
                         <button className="button-is-light" type="reset">
                           Cancelar
                         </button>
                       </div>
                     </div>
                 </Form>
    )}
         
          </Formik>
        </section>
      );
}