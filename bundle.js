// evento de abrir/fechar modal
const Modal = {
  open(){
    // abrir modal
    document.querySelector('.modal-overlay').classList.toggle('active');

  },
  close(){
    // fechar o modal
    // ou clicar no botão cancelar
    document.querySelector('.modal-overlay').classList.toggle('active');
  }
};
// ou fechar o modal apertando esc no teclado
const body = document.querySelector('body');

body.onkeyup = (e) => {
  if (e.code === 'Escape'){
  document.querySelector('.modal-overlay').classList.remove('active');
  }
};

// Mudar cor do totalDisplay caso o valor seja negativo:
function changeColor (){
  let totalTransactions = Transactions.total();
  const totalDisplay = document.getElementById("total");
  
  if(totalTransactions < 0){
    totalDisplay.classList.add("negative");
  }
  
}


// Objeto que tem as infos da table
const transactions = [{
  id: 1,
  description: 'Luz',
  value: -500,
  date: '23/01/2022'
}, 
{
  id: 2,
  description: 'Internet',
  value: -200,
  date: '17/01/2022'
}, 
{
  id: 3,
  description: 'Website',
  value: 5000,
  date: '12/01/2022'
},
{
  id: 4,
  description: 'App',
  value: 7000,
  date: '12/01/2022'
}
];

// Calcular as entradas e saídas e somar num total
const Transactions = {
  all: transactions,
  incomes(){
    // somar entradas
    let income = 0;

    Transactions.all.forEach((transaction) => {
      if (transaction.value > 0 ){
        income += transaction.value;
      }
    });

    return income;
  },
  expanses(){
    // somar as saídas
    let expanse = 0;

    Transactions.all.forEach((transaction) => {
      if (transaction.value < 0){
        expanse += transaction.value
      };
    })
    return expanse;
  },
  total(){
    // entradas + saídas
    let total = 0;

    Transactions.all.forEach((transaction) => {
      total += transaction.value; 
    });
    
    
    return total;
  }
}

// Manipular a DOM para que possa ser adicionado a table
const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  // Adicionando o tr na table
  addTransaction(transaction, index){
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHtmlTransaction(transaction);

    DOM.transactionsContainer.appendChild(tr);

  },

  // Escrevendo uma transação com o td e com as infos do obj transactions
  innerHtmlTransaction(transaction) {
    const cssClass = transaction.value > 0 ? "income" : "expanse";

    const value = Utils.formatCurrency(transaction.value);

    const html = `
        <td class="description">${transaction.description}</td>
        <td class=${cssClass}>${value}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img src="./assets/minus.svg" alt="Remover Transação" />
        </td>`

    return html;
  },

  // Escutar as modificações e alterá-las de acordo com o código
  updateBalance(){
    document.getElementById('incomeDisplay')
    .innerHTML = Utils.formatCurrency(Transactions.incomes());

    document.getElementById('expanseDisplay')
    .innerHTML = Utils.formatCurrency(Transactions.expanses());
    
    document.getElementById('totalDisplay')
    .innerHTML = Utils.formatCurrency(Transactions.total());
    
    // mudar cor do componente caso seja negativo
    changeColor();
  }
};

// Utilitários do código
const Utils = {
  // formatar o número para a moeda br
  formatCurrency(value){
    const signal = Number(value) < 0 ? '-' : '';

    // para trocar tudo que não é número, temos que usar o D dentro da "casinha"
    value = String(value).replace(/\D/, "");

    value = Number(value);

    value = value.toLocaleString("pt-BR",{
      style: 'currency',
      currency: "BRL"
    });

    return signal + " " + value;
  }
};

transactions.forEach((transaction) => {
  DOM.addTransaction(transaction)
});

DOM.updateBalance();