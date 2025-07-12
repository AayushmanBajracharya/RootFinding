window.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // Helpers
  const fInput = document.getElementById('equationInput');
  const compareBtn = document.getElementById('compareBtn');
  const resultsTable = document.getElementById('resultsTableBody');
  const graphIds = ['bisectionGraph','secantGraph','newtonGraph'];
  const selectedMethods = ['bisection','secant','newton'];

  // Root-finding methods
  function bisection(f, a,b, tol=1e-6, maxIter=50){
    let data = [], fa=f(a), fb=f(b), mid, fm;
    for(let i=0;i<maxIter;i++){
      mid=(a+b)/2; fm=f(mid);
      data.push({x:i, y:Math.abs(fm)});
      if(Math.abs(fm)<tol) break;
      (fa*fm<0)? (b=mid, fb=fm) : (a=mid, fa=fm);
    }
    return {method:'Bisection', root:mid, iter:data.length, error:Math.abs(fm), data};
  }

  function secant(f, x0,x1, tol=1e-6, maxIter=50){
    let data=[], f0=f(x0), f1=f(x1), x2;
    for(let i=0;i<maxIter;i++){
      x2 = x1 - f1*(x1-x0)/(f1-f0);
      let f2=f(x2); data.push({x:i, y:Math.abs(f2)});
      if(Math.abs(f2)<tol) break;
      [x0,f0,x1,f1] = [x1,f1,x2,f2];
    }
    return {method:'Secant', root:x2, iter:data.length, error:Math.abs(f2), data};
  }

  function newtonRaphson(f, df, x0, tol=1e-6, maxIter=50){
    let data=[], x=x0;
    for(let i=0;i<maxIter;i++){
      let fx=f(x), dfx=df(x);
      let x1 = x - fx/dfx;
      data.push({x:i, y:Math.abs(fx)});
      if(Math.abs(fx)<tol) break;
      x = x1;
    }
    return {method:'Newton-Raphson', root:x, iter:data.length, error:Math.abs(f(x)), data};
  }

  // On Compare click
  compareBtn.addEventListener('click', ()=> {
    const expr = fInput.value;
    const f = math.compile(expr).evaluate.bind(math);
    const df = math.derivative(expr,'x').compile().evaluate.bind(math);
    const a=0, b=3, x0=1; // you can add inputs for these

    resultsTable.innerHTML='';
    // Clear graphs
    graphIds.forEach(id=>Plotly.purge(id));

    // Run and display
    [bisection, secant, ()=>newtonRaphson(f,df,x0)].forEach((fn, idx)=>{
      const res = fn===secant ? fn(f,0,3) : fn===bisection ? fn(f,0,3) : fn();
      // Table row
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${res.method}</td><td>${res.root.toFixed(6)}</td><td>${res.iter}</td><td>${res.error.toExponential(2)}</td><td>--</td>`;
      resultsTable.appendChild(tr);
      // Plot
      Plotly.newPlot(graphIds[idx], [{
        x: res.data.map(o=>o.x),
        y: res.data.map(o=>o.y),
        mode:'lines+markers'
      }], {title:res.method, xaxis:{title:'Iter'}, yaxis:{type:'log',title:'Error'}});
    });
  });
});
