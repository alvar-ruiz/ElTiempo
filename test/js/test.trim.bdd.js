/*jslint
  devel : true browser: true */
/*global
    chai, describe, it, trim */
var expect = chai.expect;
chai.should();

describe("Probando la función devolverHora()", function () {
    it("Para '2017-12-19 10:00:00' debe devolver '10:00'", function () {
        devolverHora("2017-12-19 10:00:00").should.be.equal("10:00");
    });
    it("Para '2017-12-22 15:00:00' debe devolver '15:00'", function () {
        devolverHora("2017-12-22 15:00:00").should.be.equal("15:00");
    });
});

describe("Probando la función devolverFecha()", function () {
    it("Para '2017-12-19 10:00:00' debe devolver '19-12-2017'", function () {
        devolverFecha("2017-12-19 10:00:00").should.be.equal("19-12-2017");
    });
    it("Para '2017-12-22 15:00:00' debe devolver '22-12-2017'", function () {
        devolverFecha("2017-12-22 15:00:00").should.be.equal("22-12-2017");
    });
});

describe("Probando la función capitalizar()", function () {
    it("Para 'cielo claro' debe devolver 'Cielo Claro'", function () {
        capitalizar("cielo claro").should.be.equal("Cielo Claro");
    });
    it("Para 'lluvia ligera' debe devolver 'Lluvia Ligera'", function () {
        capitalizar("lluvia ligera").should.be.equal("Lluvia Ligera");
    });
});
