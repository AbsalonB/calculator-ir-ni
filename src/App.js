 import 'bootstrap/dist/css/bootstrap.min.css';
 import 'bootstrap/dist/js/bootstrap.min.js';
import { useState } from 'react';
function App() {
  const [inputSalarioBruto, setInputSalarioBruto] = useState(0);
  const [deduccionINSSMensual, setdeduccionINSSMensual] = useState(0); 
  const [salarioNetoDeducciones, setsalarioNetoDeducciones] = useState(0); 
  const [impuestoIR, setimpuestoIR] = useState(0); 
  const [totalDeducciones, settotalDeducciones] = useState(0);  
  const INNS_PORCENTAJE=0.0625;
  const PERIODO = 12;
  const TABLE_VALUES=
  [
    {
    rango_inferior:0.01,
    rango_superior:100000,
    impuesto_base:0,
    porcentaje_aplicable:0,
    sobre_exceso:0
    },
    {
      rango_inferior:100000.01,
      rango_superior:200000,
      impuesto_base:0,
      porcentaje_aplicable:0.15,
      sobre_exceso:100000
    },
    {
      rango_inferior:200000.01,
      rango_superior:300500,
      impuesto_base:15000,
      porcentaje_aplicable:0.2,
      sobre_exceso:200000
    },
    {
      rango_inferior:300500.01,
      rango_superior:500000,
      impuesto_base:45000,
      porcentaje_aplicable:0.25,
      sobre_exceso:350000
    },
    {
      rango_inferior:500000.01,
      rango_superior:1000000000,
      impuesto_base:82500,
      porcentaje_aplicable:0.3,
      sobre_exceso:500000
    },
  ];

  let onCalcular=()=>{
    let salary = parseInt(inputSalarioBruto);
    let anual_salary = getAnualSalary(salary);
    let deduccion_INSS = anual_salary * INNS_PORCENTAJE;
    let salario_anual_comparable= anual_salary-deduccion_INSS;  
    let inss_periodo = deduccion_INSS/PERIODO;  
    setdeduccionINSSMensual(inss_periodo.toFixed(2));
    let tabla_rango_valor = TABLE_VALUES.find(x=>x.rango_inferior<salario_anual_comparable && x.rango_superior>=salario_anual_comparable);
    if(tabla_rango_valor!=null && tabla_rango_valor!=undefined){
      let ir_anual = (salario_anual_comparable - tabla_rango_valor.sobre_exceso) * tabla_rango_valor.porcentaje_aplicable + tabla_rango_valor.impuesto_base;
      let ir_periodo = ir_anual/PERIODO;
      setimpuestoIR(ir_periodo.toFixed(2));
      setsalarioNetoDeducciones((salary-(ir_periodo)).toFixed(2));
      settotalDeducciones((salary-ir_periodo-inss_periodo).toFixed(2));
    }    
  }

  let getAnualSalary=(salary)=>{
    return salary * 12;
  }

  let onChangeInputSalario=(event)=>{ 
      setInputSalarioBruto(event.target.value) 
  }
  return (
    <div className="container">
      <h1>
        Cálculo de IR
      </h1>
      <main>
      <div class="mb-3">
        <label for="salariobrutoFormControlInput" className="form-label">Salario bruto mensual (córdobas):</label>
        <input type="number" min="0" max="1000000000" className="form-control" id="salariobrutoFormControlInput" placeholder="Salario bruto" value={inputSalarioBruto} onChange={onChangeInputSalario}/>
      </div>
      <div class="mb-3">
        <label for="deduccionINSSControlInput" className="form-label">Deducción INSS mensua (córdobas)l:</label>
        <input type="text" className="form-control" id="deduccionINSSControlInput" value={deduccionINSSMensual} disabled/>
      </div>
      <div class="mb-3">
        <label for="salarioNetoDeduccionesControlInput" className="form-label">Salario neto (luego de deducciones) (córdobas):</label>
        <input type="text" className="form-control" id="salarioNetoDeduccionesControlInput" value={salarioNetoDeducciones} disabled/>
      </div>
      <div class="mb-3">
        <label for="impuestoIRControlInput" className="form-label">Deducción impuesto sobre la renta (IR) (córdobas):</label>
        <input type="text" className="form-control" id="impuestoIRControlInput" value={impuestoIR} disabled/>
      </div>
      <div class="mb-3">
        <label for="totalControlInput" className="form-label">Salario total deducciones (córdobas):</label>
        <input type="text" className="form-control" id="totalControlInput" value={totalDeducciones} disabled/>
      </div>
      <button type='button' className='btn btn-primary' onClick={onCalcular}>Calcular</button>
      </main>
      <div>
        <h1>Formulas</h1>
        <label className="form-label"><span className="text-success">Deducción INSS anual</span>= (Salario bruto mensual * 12) * 0.0625 (porcentaje INSS pagado anual) </label> <br/>
        <label className="form-label"><span className="text-success">Deducción INSS mensual</span>= deducción INSS anual / 12 </label> <br/>
        <label className="form-label"><span className="text-success">Salario bruto anual comparable</span> = Salabrio bruto anual - deducción INSS anual </label> <br/>
        <label className="form-label"><span className="text-success">Valor de tabla de rango</span> = salario bruto anual comparable &gt; rango salario anual desde & salario bruto anual comparable &lt; = rango salario anual hasta </label> <br/>
        <label className="form-label"><span className="text-success">IR anual</span> = (salario bruto anual comparable - valor tabla rango_exceso) * valor tabla rango_porcentaje aplicable + valor tabla rango_impuesto base</label> <br/> 
        <label className="form-label"><span className="text-success">Salario neto</span> = Salario bruto mensual - IR mensual </label> <br/> 
        <label className="form-label"><span className="text-success">Salario total deducciones (INSS-IR)</span> = Salario bruto mensual - IR mensual - INSS mensual </label> <br/> 
      </div>
      <div>
        <h1>Tabla rango para cálculo de impuestos</h1>
        <table className='table'>
          <thead>
          <tr>
            <td>Rango salarial desde</td>
            <td>Rango salarial hasta</td>
            <td>Impuesto base</td>
            <td>Porcentaje aplicable</td>
            <td>Sobre exceso de</td>
          </tr>
          </thead> 
          {
            TABLE_VALUES.map((val,key)=>{
              return (
                <tr key={key}>
                  <td>{val.rango_inferior}</td>
                  <td>{val.rango_superior}</td>
                  <td>{val.impuesto_base}</td>
                  <td>%{val.porcentaje_aplicable*100}</td>
                  <td>{val.sobre_exceso}</td>
                </tr>
              )
            })
          }
        </table>
      </div>
    </div>
  );
}

export default App;
