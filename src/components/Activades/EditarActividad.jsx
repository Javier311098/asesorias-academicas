import { Grid, Input, MenuItem, TextField } from "@mui/material";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "../../hooks/useForm";
import {
  comenzarCrearActividad,
  comenzarEditarActividad,
  obtenerActividades,
} from "../../store/slicers/actividadesActions";
import {
  comenzarCrearMateria,
  obtenerMaterias,
} from "../../store/slicers/materiasActions";

const validaciones = {
  nombre: [
    (value) => value.length > 3,
    "El nombre debe tener al menos 4 caracteres",
  ],
  material: [(value) => value.length > 4, "Debes agregar materiales"],
  objectivo: [
    (value) => value.length > 10,
    "Debes agregar el objectivo de la actividad",
  ],
  instrucciones: [
    (value) => value.length > 10,
    "Debes agregar las instrucciones de la actividad",
  ],
  materia: [(value) => value > 0, "Debes seleccionar una materia"],
};

export const EditarActividad = ({ cerrarModales }) => {
  const { listaActividades, actividadSeleccionada } = useSelector(
    (state) => state.actividades
  );
  const { user } = useSelector((state) => state.auth);
  const listaEstatus = [
    { id_estatus: 0, nombre_estatus: "inactivo" },
    { id_estatus: 1, nombre_estatus: "activo" },
  ];
  const { id_actividad, nombre_actividad, id_materia } = actividadSeleccionada;
  const fileInputRef1 = useRef();
  const fileInputRef2 = useRef();
  const [img1, setImg1] = useState(
    actividadSeleccionada.imagen_1 ? actividadSeleccionada.imagen_1 : ""
  );
  const [img2, setImg2] = useState(
    actividadSeleccionada.imagen_2 ? actividadSeleccionada.imagen_2 : ""
  );
  const [archivo, setArchivo] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { listaMaterias } = useSelector((state) => state.materias);

  const [formLoginValues, handleLoginInputChange, validacion, isValid] =
    useForm(
      {
        nombre: nombre_actividad,
        material: actividadSeleccionada.material,
        video: actividadSeleccionada.video ? actividadSeleccionada.video : "",
        objectivo: actividadSeleccionada.objectivo,
        instrucciones: actividadSeleccionada.instrucciones,
        materia: id_materia,
        estatus: actividadSeleccionada.estatus,
      },
      validaciones
    );

  const {
    nombre,
    material,
    video,
    objectivo,
    instrucciones,
    materia,
    estatus,
  } = formLoginValues;
  const {
    nombreValid,
    materialValid,
    objectivoValid,
    instruccionesValid,
    materiaValid,
  } = validacion;
  const dispatch = useDispatch();

  const submit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (isValid) {
      const actividad = {
        nombre_actividad: nombre,
        material,
        objectivo,
        instrucciones,
        id_materia: materia,
        video: video,
        imagen_1: img1,
        imagen_2: img2,
        estatus: estatus,
      };

      dispatch(comenzarEditarActividad(actividad, id_actividad));
      cerrarModales();
    }
  };

  console.log(actividadSeleccionada);

  const cargarImagen1 = (e) => {
    if (e.target.files === 0) return;
    const file = new FileReader();
    file.readAsDataURL(e.target.files[0]);

    console.log(e.target.files[0]);
    file.onload = function () {
      setImg1(file.result);
    };
  };
  const cargarImagen2 = (e) => {
    if (e.target.files === 0) return;
    const file = new FileReader();
    file.readAsDataURL(e.target.files[0]);
    file.onload = function () {
      setImg2(file.result);
    };
    setArchivo(e.target.files[0]);
  };
  return (
    <>
      <form onSubmit={submit} className="form-container ">
        <Grid container item xs={12} sx={{ mt: 2 }}>
          <TextField
            label="Nombre de la Actividad"
            type="text"
            placeholder="pintar con las manos..."
            name="nombre"
            value={nombre}
            fullWidth
            onChange={handleLoginInputChange}
            error={!!nombreValid && formSubmitted}
            helperText={formSubmitted && nombreValid}
          />
        </Grid>

        <Grid container item xs={12} sx={{ mt: 2 }}>
          <TextField
            label="Material"
            type="text"
            placeholder="tijeras,papel,crayolas"
            name="material"
            value={material}
            fullWidth
            onChange={handleLoginInputChange}
            error={!!materialValid && formSubmitted}
            helperText={formSubmitted && materialValid}
          />
        </Grid>

        <Grid container item xs={12} sx={{ mt: 2 }}>
          <TextField
            label="Objectivo"
            type="text"
            placeholder="español"
            name="objectivo"
            value={objectivo}
            fullWidth
            onChange={handleLoginInputChange}
            error={!!objectivoValid && formSubmitted}
            helperText={formSubmitted && objectivoValid}
          />
        </Grid>

        <Grid container item xs={12} sx={{ mt: 2 }}>
          <TextField
            label="Instrucciones"
            type="text"
            placeholder="Instrucciones"
            name="instrucciones"
            value={instrucciones}
            fullWidth
            onChange={handleLoginInputChange}
            error={!!instruccionesValid && formSubmitted}
            helperText={formSubmitted && instruccionesValid}
          />
        </Grid>

        <Grid container item xs={12} sx={{ mt: 2 }}>
          <TextField
            label="Materia"
            select
            type="text"
            name="materia"
            value={materia}
            fullWidth
            onChange={handleLoginInputChange}
            error={!!materiaValid && formSubmitted}
            helperText={formSubmitted && materiaValid}
          >
            {listaMaterias.map((materia) => (
              <MenuItem key={materia.id_materia} value={materia.id_materia}>
                {materia.nombre_materia}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid container item xs={12} sx={{ mt: 2 }}>
          <TextField
            label="video"
            type="text"
            placeholder="link de un video de youtube..."
            name="video"
            value={video}
            fullWidth
            onChange={handleLoginInputChange}
          />
        </Grid>

        {user.role === 1 && (
          <Grid container item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Estatus"
              select
              type="text"
              name="estatus"
              value={estatus}
              fullWidth
              onChange={handleLoginInputChange}
            >
              {listaEstatus.map((estatus) => (
                <MenuItem key={estatus.id_estatus} value={estatus.id_estatus}>
                  {estatus.nombre_estatus}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}

        <div className="d-flex justify-content-around align-items-center mt-3 imagen-container">
          <div
            className=" me-3 imagenes text-sm-center"
            onClick={() => fileInputRef1.current.click()}
          >
            {img1.length > 0 ? (
              <img src={img1} alt="img" className="imagenes" />
            ) : (
              " Agregar imagen"
            )}
          </div>
          <div
            className="imagenes text-center"
            onClick={() => fileInputRef2.current.click()}
          >
            {img2.length > 0 ? (
              <img src={img2} alt="img" className="imagenes" />
            ) : (
              " Agregar imagen"
            )}
          </div>
        </div>

        <input
          className="mt-2 "
          type="file"
          accept="image/*"
          ref={fileInputRef1}
          name="archivo2"
          onChange={cargarImagen1}
          style={{ display: "none" }}
        />
        <input
          ref={fileInputRef2}
          onChange={cargarImagen2}
          className="mt-2"
          type="file"
          accept="image/*"
          name="archivo"
          style={{ display: "none" }}
        />

        <button className="btn btn-primary mt-3" type="submit">
          Editar
        </button>
      </form>
    </>
  );
};
