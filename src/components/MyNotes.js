import React, { useEffect, useReducer, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { useFormEdit } from "../hooks/useFormEdit";
import { noteReducer } from "../reducers/noteReducer";
import swal from "sweetalert";
import "../styles/styles.css";

const initNotes = () => {
  return JSON.parse(localStorage.getItem("notes")) || [];
};

const MyNotes = () => {
  let ensolverUser = localStorage.getItem("ensolverUser");

  const [notes, dispatch] = useReducer(noteReducer, [], initNotes);

  const [categories, setCategories] = useState([]);

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

  const [{ title, content, addCategory }, handleInputChange, reset] = useForm({
    title: "",
    content: "",
    addCategory: "",
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newNote = {
      id: new Date().getTime(), //To create a Random ID
      title: title,
      content: content,
      categories: categories,
      lastEdited: new Date().toLocaleDateString(),
    };

    const action = {
      type: "add",
      payload: newNote,
    };

    dispatch(action);

    reset();

    setCategories([]);
  };

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

  const handleAddCategory = () => {
    let existCategory = categories.some(
      (categoryTitle) => categoryTitle === addCategory
    );
    !existCategory && setCategories([...categories, addCategory]);
  };

  const handleEditAddCategory = () => {
    let existCategory = editedCategories.some(
      (categoryTitle) => categoryTitle === addCategorias
    );
    !existCategory && setEditedCategories([...editedCategories, addCategorias]);
  };

  const handleArchive = (noteId) => {
    swal({
      title: "Are you sure you want to archive this note?",
      icon: "warning",
      buttons: ["No", "Yes"],
    }).then((willDelete) => {
      if (willDelete) {
        swal("Your note has been archived!", {
          icon: "success",
        });
        let actualArchivedNotes = JSON.parse(
          localStorage.getItem("archivedNotes")
        );
        const arrayToArchive = notes.filter((note) => note.id === noteId);
        const archiveNote = {
          id: arrayToArchive[0].id,
          title: arrayToArchive[0].title,
          content: arrayToArchive[0].content,
          categories: arrayToArchive[0].categories,
          lastEdited: arrayToArchive[0].lastEdited,
        };
        if (actualArchivedNotes === null) {
          localStorage.setItem("archivedNotes", JSON.stringify([archiveNote]));
        } else if (actualArchivedNotes) {
          localStorage.setItem(
            "archivedNotes",
            JSON.stringify([...actualArchivedNotes, archiveNote])
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
    let editForm = notes.filter((note) => note.id === noteId);
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

  let totalCategories = notes.map((note) => note.categories);

  const [filteredNotes, setFilteredNotes] = useState([]);

  const [selectValue, setSelectValue] = useState("All");

  const handleOptionClick = (e) => {
    if (e.target.value === "All") {
      setSelectValue("All");
      setFilteredNotes(notes);
    } else {
      setSelectValue(e.target.value);
      setFilteredNotes(
        notes.filter((note) => note.categories.includes(e.target.value))
      );
    }
  };

  useEffect(() => {
    setSelectValue("All");
    setFilteredNotes(notes);
  }, [notes]);

  //-------- TO OBTAIN AN UNIQUE CATEGORY ARRAY ----------------------

  let totalArray = [];

  totalCategories.map((categoria) =>
    categoria.map((categoryItem) => totalArray.push(categoryItem))
  );

  let categoriasUnicas = new Set(totalArray);

  let arrayCategoriasUnicas = [...categoriasUnicas];

  return (
    <>
      {!ensolverUser ? <Navigate replace to="/" /> : null}
      <div className="d-flex">
        <div className="d-flex align-items-center">
          <h1 className="col-8">My notes</h1>
          <button
            type="button"
            className="btn btn-outline-primary col-5"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-bs-whatever="@mdo"
          >
            Create note
          </button>
          <Link className="col-4" to="/archivednotes">
            Archived notes
          </Link>
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
            {filteredNotes.map((note) => (
              <li className="list-group-item" key={note.id}>
                <i className="fas fa-sticky-note"></i>
                <div className="col-2">
                  <p className="p-title p-nota text-center">{note.title}</p>
                  <p className="p-nota muted text-center">
                    Last edited: {note.lastEdited}
                  </p>
                </div>
                <button
                  onClick={() => handleArchive(note.id)}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-box"></i>
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

      <>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
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
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title-name" className="col-form-label">
                      Title:
                    </label>
                    <input
                      name="title"
                      type="text"
                      className="form-control"
                      id="title-name"
                      autoComplete="off"
                      onChange={handleInputChange}
                      value={title || ""}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content-text" className="col-form-label">
                      Content:
                    </label>
                    <textarea
                      value={content || ""}
                      name="content"
                      className="form-control"
                      id="content-text"
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="categories-text" className="col-form-label">
                      Categories:
                    </label>
                    <div className="form-control">
                      {categories.length > 0 &&
                        categories.map((category, i) => {
                          return (
                            <div key={`${i + 1000}-${category}`} className="">
                              <span>{category} </span>
                              <>
                                {" "}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCategories(
                                      categories.filter(
                                        (categoria) => categoria !== category
                                      )
                                    )
                                  }
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
                      name="addCategory"
                      value={addCategory || ""}
                      onChange={handleInputChange}
                      type="text"
                      className="col-10"
                      placeholder="new category"
                      autoComplete="off"
                    />
                    <button
                      onClick={handleAddCategory}
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

export default MyNotes;
