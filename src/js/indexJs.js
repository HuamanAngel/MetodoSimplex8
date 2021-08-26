const CMAX = 10;
const VMAX = 10;
class simplex {
  // Enteros
  nr;
  nv;
  rp;
  cp;
  // Boolean
  optimo;
  error;
  // Double
  t;

  constructor() {
    this.optimo = false;
    this.error = false;
    this.t = new Array(10);
    this.t.fill(0, 0, 10);
    let col = new Array(10);
    col.fill(0, 0, 10);
    for (var i = 0; i < 10; i++) {
      this.t[i] = col.slice();
    }
    this.nr = 0;
    this.nv = 0;
    this.rp = 0;
    this.cp = 0;
  }

  datos(numVar, numConstraint, functionObject, constraintOne, constraintTwo, constraintThree) {
    let i = new Number(), j = new Number();
    let tipo, ai = new Number();
    tipo = 1;
    this.nv = numVar;
    this.nr = numConstraint;

    for (j = 1; j <= this.nv; j++) {

      ai = functionObject[j - 1];
      this.t[1][parseInt(j) + parseInt(1)] = ai * tipo;
    }
    ai = 0;
    this.t[1][1] = ai * tipo;

    // Restricciones
    for (i = 1; i <= this.nr; i++) {
      for (j = 1; j <= this.nv; j++) {
        switch (i) {
          case 1:
            ai = constraintOne[j - 1];
            break;
          case 2:
            ai = constraintTwo[j - 1];
            break;
          case 3:
            ai = constraintThree[j - 1];
            break;
        }
        this.t[parseInt(i) + 1][parseInt(j) + parseInt(1)] = ai * (-1);
      }

      switch (i) {
        case 1:
          this.t[parseInt(i) + parseInt(1)][1] = constraintOne[3];
          break;
        case 2:
          this.t[parseInt(i) + parseInt(1)][1] = constraintTwo[3];
          break;
        case 3:
          this.t[parseInt(i) + parseInt(1)][1] = constraintThree[3];
          break;
      }
    }

    for (j = 1; j <= this.nv; j++) {
      this.t[0][parseInt(j) + parseInt(1)] = j;
    }
    for (i = parseInt(this.nv) + parseInt(1); i <= parseInt(this.nv) + parseInt(this.nr); i++) {
      this.t[parseInt(i) - parseInt(this.nv) + parseInt(1)][0] = i;
    }
  }

  pivotear() {
    let bamin = new Number();
    let aux = new Number();
    let xmax = new Number(0);
    let i = new Number();
    let j = new Number();

    for (j = 2; j <= parseInt(this.nv) + parseInt(1); j++) {
      if (this.t[1][j] > 0 && this.t[1][j] > xmax) {
        xmax = this.t[1][j];
        this.cp = j;
      }
    }

    bamin = 1000000;

    for (i = 2; i <= parseInt(this.nr) + parseInt(1); i++) {
      if (this.t[i][this.cp] < 0) {
        aux = Math.abs(parseFloat(this.t[i][1]) / parseFloat(this.t[i][this.cp]));

        if (aux < bamin) {
          bamin = aux;
          this.rp = i;
        }
      }
    }

    aux = this.t[0][this.cp];
    this.t[0][this.cp] = this.t[this.rp][0];
    this.t[this.rp][0] = aux;
  }
  actualizar() {
    let i = new Number();
    let j = new Number();
    for (i = 1; i <= parseInt(this.nr) + parseInt(1); i++)
      if (i != this.rp)
        for (j = 1; j <= parseInt(this.nv) + parseInt(1); j++)
          if (j != this.cp)
            this.t[i][j] -= this.t[this.rp][j] * this.t[i][this.cp] / this.t[this.rp][this.cp];
    this.t[this.rp][this.cp] = 1.0 / this.t[this.rp][this.cp];
    for (j = 1; j <= parseInt(this.nv) + parseInt(1); j++)
      if (j != this.cp)
        this.t[this.rp][j] *= Math.abs(this.t[this.rp][this.cp]);
    for (i = 1; i <= parseInt(this.nr) + parseInt(1); i++)
      if (i != this.rp)
        this.t[i][this.cp] *= this.t[this.rp][this.cp];


  }
  revisar() {
    let i = new Number();
    let j = new Number();
    this.optimo = true;
    this.error = false;
    for (i = 2; i <= parseInt(this.nr) + parseInt(1); i++)
      if (this.t[i][1] < 0)
        this.error = true;
    if (this.error == false)
      for (j = 2; j <= parseInt(this.nv) + parseInt(1); j++)
        if (this.t[1][j] > 0)
          this.optimo = false;
  }

  simplex() {
    while (this.optimo == false) {
      this.pivotear();
      this.actualizar();
      this.revisar();
    }
  }
  resultados() {
    let i = new Number();
    let j = new Number();
    if (this.error == false) {
      for (i = 1; i <= this.nv; i++) {
        for (j = 2; j <= parseInt(this.nr) + parseInt(1); j++) {
          if (this.t[j][0] == 1 * i) {
            var mandalin = $("#div_resolution").find(".solution_val_1");
            mandalin[i - 1].textContent = `X${i}=${this.t[j][1]}`;
          }
        }

      }

      $("#solution_val_total").text(`Funcion objetivo: ${this.t[1][1]}`);
    }
    else
      $("#div_resolution").html("No hay solucion");
  }

}