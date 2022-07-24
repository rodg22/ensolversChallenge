import React, { useEffect, useReducer, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useFormEdit } from "../hooks/useFormEdit";
import { archivedNoteReducer } from "../reducers/archivedNoteReducer";
import swal from "sweetalert";
import "../styles/styles.css";

const initarchivedNotes = () => {
  return JSON.parse(localStorage.getItem("archivedNotes")) || [];
};

const ArchivedNotes = () => {
  let ensolverUser = localStorage.getItem("ensolverUser");

  const [archivedNotes, dispatch] = useReducer(
    archivedNoteReducer,
    [],
    initarchivedNotes
  );

  const [editedCategories, setEditedCategories] = useState([]);

  const [
    { editableId, titulo, contenido, addCategorias },
    setFormValues,
    handleInputEditChange,
  ] = useFormEdit({
    editableId: "",
    titulo: "",
    contenido: "",
    categorias: [],
    addCategorias: "",
  });

  useEffect(() => {
    localStorage.setItem("archivedNotes", JSON.stringify(archivedNotes));
  }, [archivedNotes]);

  const handleDelete = (noteId) => {
    swal({
      title: "Are you sure you want to delete this note?",
      icon: "warning",
      buttons: ["No", "Yes"],
    }).then((willDelete) => {
      if (willDelete) {
        swal("Your note has been deleted!", {
          icon: "success",
        });
        const action = {
          type: "delete",
          payload: noteId,
        };

        dispatch(action);
      } else {
        return;
      }
    });
  };

  const handleEditAddCategory = () => {
    let existCategory = editedCategories.some(
      (categoryTitle) => categoryTitle === addCategorias
    );
    !existCategory && setEditedCategories([...editedCategories, addCategorias]);
  };

  const handleUnarchive = (noteId) => {
    swal({
      title: "Are you sure you want to unarchive this note?",
      icon: "warning",
      buttons: ["No", "Yes"],
    }).then((willDelete) => {
      if (willDelete) {
        swal("Your note has been unarchived!", {
          icon: "success",
        });
        let actualNotes = JSON.parse(localStorage.getItem("notes"));
        const arrayToUnarchive = archivedNotes.filter(
          (note) => note.id === noteId
        );
        const unarchiveNote = {
          id: arrayToUnarchive[0].id,
          title: arrayToUnarchive[0].title,
          content: arrayToUnarchive[0].content,
          categories: arrayToUnarchive[0].categories,
          lastEdited: arrayToUnarchive[0].lastEdited,
        };
        if (actualNotes === null) {
          localStorage.setItem("notes", JSON.stringify([unarchiveNote]));
        } else if (actualNotes) {
          localStorage.setItem(
            "notes",
            JSON.stringify([...actualNotes, unarchiveNote])
          );
        }
        const action = {
          type: "delete",
          payload: noteId,
        };

        dispatch(action);
      } else {
        return;
      }
    });
  };

  const handleEdit = (noteId) => {
    let editForm = archivedNotes.filter((note) => note.id === noteId);
    editForm.map(({ id, title, content, categories }) =>
      setFormValues({
        editableId: id,
        titulo: title,
        contenido: content,
      })
    );
    editForm.map(({ categories }) => setEditedCategories(categories));
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    const editNote = {
      id: editableId, //To bring the same ID
      title: titulo,
      content: contenido,
      categories: editedCategories,
      lastEdited: new Date().toLocaleDateString(),
    };

    const action = {
      type: "update",
      payload: editNote,
    };

    dispatch(action);
  };

  const handleDeleteCategory = (category) => {
    setEditedCategories(
      editedCategories.filter((categoria) => categoria !== category)
    );
  };

  let totalCategories = archivedNotes.map((note) => note.categories);

  const [filteredarchivedNotes, setFilteredarchivedNotes] = useState([]);

  const [selectValue, setSelectValue] = useState("All");

  const handleOptionClick = (e) => {
    if (e.target.value === "All") {
      setSelectValue("All");
      setFilteredarchivedNotes(archivedNotes);
    } else {
      setSelectValue(e.target.value);
      setFilteredarchivedNotes(
        archivedNotes.filter((note) => note.categories.includes(e.target.value))
      );
    }
  };

  useEffect(() => {
    setSelectValue("All");
    setFilteredarchivedNotes(archivedNotes);
  }, [archivedNotes]);

  //-------- TO OBTAIN AN UNIQUE CATEGORY ARRAY ----------------------

  let totalArray = [];

  totalCategories.map((categoria) =>
    categoria.map((categoryItem) => totalArray.push(categoryItem))
  );

  let categoriasUnicas = new Set(totalArray);

  let arrayCategoriasUnicas = [...categoriasUnicas];

  //------------------------------------------------------------------

  return (
    <>
      {!ensolverUser ? <Navigate replace to="/" /> : null}
      <div className="d-flex">
        <div className="d-flex align-items-center">
          <h1 className="col-8">Archived notes</h1>
          <Link
            className="col-6"
            to="/mynotes"
          >{`< Go back to unarchived notes`}</Link>
        </div>
      </div>
      <hr />

      <p>Category filter:</p>
      <select
        value={selectValue}
        onChange={handleOptionClick}
        className="form-select"
        aria-label="Default select example"
      >
        <option defaultValue="All">All</option>
        {arrayCategoriasUnicas.map((categoryItem) => (
          <option key={categoryItem}>{categoryItem}</option>
        ))}
      </select>
      <hr />

      <div className="row">
        <div className="col-7">
          <ul className="list-group list-group-flush">
            {filteredarchivedNotes.map((note) => (
              <li className="list-group-item" key={note.id}>
                <i className="fas fa-sticky-note"></i>
                <p className="p-nota text-center">{note.title}</p>
                <p className="p-nota text-center">
                  Last edited: {note.lastEdited}
                </p>
                <button
                  onClick={() => handleUnarchive(note.id)}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-upload"></i>
                </button>
                <button
                  onClick={() => handleEdit(note.id)}
                  className="btn btn-primary"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  data-bs-whatever="@mdo"
                >
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="btn btn-danger"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <>
        <div
          className="modal fade"
          id="editModal"
          tabIndex="-1"
          aria-labelledby="editModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">
                  Create / Edit note
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitEdit}>
                  <div className="mb-3">
                    <label htmlFor="titulo-name" className="col-form-label">
                      Title:
                    </label>
                    <input
                      value={titulo}
                      type="text"
                      className="form-control"
                      id="titulo-name"
                      name="titulo"
                      autoComplete="off"
                      onChange={handleInputEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contenido-text" className="col-form-label">
                      Content:
                    </label>
                    <textarea
                      value={contenido}
                      name="contenido"
                      className="form-control"
                      id="contenido-text"
                      onChange={handleInputEditChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="categorias-text" className="col-form-label">
                      Categories:
                    </label>
                    <div className="form-control">
                      {editedCategories.length > 0 &&
                        editedCategories.map((category, i) => {
                          return (
                            <div key={`${i}-${category}`} className="">
                              <span>{category} </span>
                              <>
                                {" "}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(category)}
                                  className="p-1 btn btn-secondary"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="mb-3">
                    <input
                      name="addCategorias"
                      onChange={handleInputEditChange}
                      type="text"
                      className="col-10"
                      placeholder="new category"
                      autoComplete="off"
                    />
                    <button
                      onClick={handleEditAddCategory}
                      type="button"
                      className="btn btn-primary"
                    >
                      Add
                    </button>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button
                      data-bs-dismiss="modal"
                      type="submit"
                      className="btn btn-success"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default ArchivedNotes;
