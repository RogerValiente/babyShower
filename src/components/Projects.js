import React, { useEffect, useState } from "react";
import { Container, Row, Col, Tab } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase-config";
import Swal from 'sweetalert2';

export const Projects = () => {
  const [products, SetProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const productsCollections = collection(db, "products");

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productsCollections);
      const productsData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      if (sortOption === ("alphabetical" || "default")) {
        productsData.sort((a, b) => {
          const nameA = a.title.toLowerCase();
          const nameB = b.title.toLowerCase();
          return nameA.localeCompare(nameB);
        });
      } else if (sortOption === "priceMenor") {
        productsData.sort((a, b) => a.price - b.price);
      } else if (sortOption === "priceMayor") {
        productsData.sort((a, b) => b.price - a.price);
      }

      SetProducts(productsData);
    }
    getProducts();
  }, [sortOption, products]);

  const getUpdateProducts = async (id) => {
    Swal.fire({
      title: 'Confirmar Reserva',
      text: '¿Está seguro de que desea reservar este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await productsCollections.doc(id).update({
          state: 'Reservado'
        });
        Swal.fire('Reservado', 'El producto ha sido reservado con éxito', 'success');
      }
    });
  }

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <h2 style={{ marginTop: '-60px' }}>Lista De Regalos</h2>
                  <Tab.Container id="projects-tabs" defaultActiveKey="first">
                    <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                      <Tab.Pane eventKey="first" style={{ marginTop: '20px' }}>
                        <Container>
                          <div className="d-flex  justify-content-end mb-5">
                            <select style={{ maxWidth: '26%' }} className="form-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                              <option value="default">Filtrar por ...</option>
                              <option value="alphabetical">Ordenar Alfabéticamente</option>
                              <option value="priceMenor">Ordenar por Precio (Menor a Mayor)</option>
                              <option value="priceMayor">Ordenar por Precio (Mayor a Menor)</option>
                            </select>
                          </div>
                          <Row>
                            {
                              products.map((item) => {
                                console.log(item);
                                return (
                                  <ProjectCard
                                    key={item.id}
                                    {...item}
                                    onReserve={() => getUpdateProducts(item.id)}
                                  />
                                )
                              })
                            }
                          </Row>
                        </Container>
                      </Tab.Pane>
                      <Tab.Pane eventKey="section">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                      </Tab.Pane>
                      <Tab.Pane eventKey="third">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container >
    </section >
  )
}
