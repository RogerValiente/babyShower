import React, { useEffect, useState } from "react";
import { Container, Row, Col, Tab } from "react-bootstrap";
import { ProductCard } from "./ProductCard";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import ProductForm from './ProductForm';
import { db } from "../firebaseConfig/firebase-config";
import Swal from 'sweetalert2';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const productsCollections = collection(db, "products");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getProducts = async () => {
    const data = await getDocs(productsCollections);
    let productsData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setOriginalProducts(productsData);

    productsData.sort((a, b) => {
      if (a.state === "Disponible" && b.state !== "Disponible") {
        return -1;
      } else if (a.state !== "Disponible" && b.state === "Disponible") {
        return 1;
      } else {
        return 0;
      }
    });

    setProducts(productsData);
    setIsLoading(false);
  }

  const createProduct = async (newProductData) => {
    try {
      const docRef = await addDoc(productsCollections, newProductData);

      setProducts((prevProducts) => [...prevProducts, { id: docRef.id, ...newProductData }]);
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getUpdateProducts = async (id) => {
    Swal.fire({
      title: 'Confirmar Reserva',
      html: `
        <p>¿Está seguro de que desea reservar este producto?</p>
        <input type="text" id="username" class="swal2-input" placeholder="Ingrese un alias">
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {
        const username = Swal.getPopup().querySelector('#username').value;
        if (!username) {
          Swal.showValidationMessage('Por favor, ingrese un alias o nombre');
        } else {
          const productRef = await doc(productsCollections, id);
          await updateDoc(productRef, { state: `Reservado por: ${username}` });
          await getProducts();
          Swal.fire('Reservado', `El producto ha sido reservado por ${username} con éxito`, 'success');
        }
      },
    });
  };

  const handleSortChange = (e) => {
    setIsLoading(true);
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    let sortedProducts = [...originalProducts];

    if (newSortOption === "default") {
      sortedProducts.sort((a, b) => {
        if (a.state === "Disponible" && b.state !== "Disponible") {
          return -1;
        } else if (a.state !== "Disponible" && b.state === "Disponible") {
          return 1;
        } else {
          return 0;
        }
      });

      setProducts(sortedProducts);
    } else {
      if (newSortOption === "alphabetical") {
        sortedProducts.sort((a, b) => {
          const nameA = a.title.toLowerCase();
          const nameB = b.title.toLowerCase();
          return nameA.localeCompare(nameB);
        });
      } else if (newSortOption === "priceMenor") {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (newSortOption === "priceMayor") {
        sortedProducts.sort((a, b) => b.price - a.price);
      }
      setProducts(sortedProducts);
    }
    setIsLoading(false);
  }

  const handleShowFormClick = () => {
    Swal.fire({
      title: 'Ingrese la contraseña',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      preConfirm: async (password) => {
        const enteredPasswordBase64 = btoa(unescape(encodeURIComponent(password)));
        console.log(enteredPasswordBase64)
        if (enteredPasswordBase64 === 'U2FtdWVsMjAyMw==') {
          setShowForm(true);
        } else {
          Swal.showValidationMessage('Contraseña incorrecta');
        }
      }
    });
  };

  return (
    <section className="project" id="projects">
      <Container>
        {isLoading ? <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div> :
          <Row>
            <Col size={12}>
              <TrackVisibility>
                {({ isVisible }) =>
                  <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                    <h2 style={{ marginTop: '-60px' }}>Lista De Regalos</h2>
                    <Tab.Container id="projects-tabs" defaultActiveKey="first">
                      <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                        <Tab.Pane eventKey="first" style={{ marginTop: '20px' }}>
                          {showForm ? (
                            <ProductForm onCreateProduct={createProduct} />
                          ) : (
                            <div>
                              <button onClick={handleShowFormClick} className="btn btn-sm-light">
                                Mostrar formulario
                              </button>
                            </div>
                          )}
                          <Container>
                            <div className="d-flex  justify-content-end mb-5">
                              <select className="form-select w-100 mt-3 w-auto" value={sortOption} onChange={handleSortChange}>
                                <option value="default">Ordenar por...</option>
                                <option value="alphabetical">A-Z</option>
                                <option value="priceMenor">Precio (Menor a Mayor)</option>
                                <option value="priceMayor">Precio (Mayor a Menor)</option>
                              </select>
                            </div>
                            <Row>
                              {
                                products.map((item) => {
                                  return (
                                    <ProductCard
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
        }
      </Container >
    </section >
  )
}
