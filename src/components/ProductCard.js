import { Col, Card, Button } from "react-bootstrap";

const imageStyle = {
  maxWidth: "100%",
  maxHeight: "200px",
};

export const ProductCard = ({ title, description, imgUrl, url, price, state, onReserve }) => {
  return (
    <Col xs={12} sm={6} md={6} lg={4} xl={3} className="mb-4">
      <Card>
        <Card.Img variant="top" src={imgUrl} style={imageStyle} />
        <Card.Body>
          <Card.Title className="text-black">{title}</Card.Title>
          <span className="text-black-50 mb-2">{description}</span>
          <br />
          <span className="text-dark mb-2 fw-bold">Precio:</span>
          <span className="text-black-50 mb-2 fw-bold"> $ {price.toLocaleString()}</span>
          <div className="d-flex justify-content-center mt-2">
            {state !== "Disponible" ? (
              <Button className="m-1 btn-info" disabled>{state}</Button>
            ) : (
              <>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <Button className="m-1 btn btn-warning">Ir al comercio</Button>
                </a>
                <Button className="m-1 btn btn-primary" onClick={onReserve}>Reservar</Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}
