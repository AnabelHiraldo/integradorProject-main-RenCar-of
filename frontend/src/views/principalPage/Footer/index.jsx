export default function Footer() {
  return (
    <footer className="footer margen-interno">
      <nav id="pie">
        <a href="#">Desarrollado por Ing. Maxsil Colón, Ing. Anabel Hiraldo.</a>
      </nav>
      <div className="piecont">
        <div className="pieReservation piediv">
          <p>
            <b className="pdddd">Reservation</b>
          </p>
          <p>Car Hire</p>
          <p>Modify Or Cancel</p>
          <p>Get A Receipt</p>
        </div>
        <div className="pieCustomerServices piediv">
          <p>
            <b className="pdddd">Help / FAQS</b>
          </p>
          <p>Press</p>
          <p>Blog</p>
          <p>ContactUs</p>
        </div>
        <div className="Company piediv">
          <p>
            <b className="pdddd">Company</b>
          </p>
          <p>About us</p>
          <p>Career</p>
          <p>Report & Governance</p>
        </div>
      </div>
    </footer>
  );
}
