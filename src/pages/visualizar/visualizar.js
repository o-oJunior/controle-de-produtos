import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/header";
import './visualizar.css'
import firebase from "../config/firebase";
import VisualizarProduto from "../components/visualizarProduto";

function Visualizar() {
    const { id } = useParams()
    const db = firebase.firestore()

    const [produto, setProduto] = useState({})

    useEffect(() => {
        buscarProdutoNoFirebase()
    }, [])

    const buscarProdutoNoFirebase = () => {
        db
            .collection("produtos")
            .get()
            .then((result) => {
                result.docs.forEach((doc) => {
                    const docData = doc.data()
                    if (id === doc.id) {
                        setProduto(docData)
                    }
                });
            });
    }

    return (
        <div className="mb-5">
            <Header />
            <div className="container visualizar">
                <div className="d-flex flex-row-reverse mb-3">
                <Link to={`/produtos/editar/${id}`}>
                    <i className="fa-regular fa-pen-to-square text-dark"></i>
                </Link>                    
                </div>

                <VisualizarProduto
                    produto={produto}
                />
            </div>
        </div>
    )
}

export default Visualizar