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

// Objeto que tem as infos da table
const transactions = [{
  description: 'Luz',
  value: -50000,
  date: '23/01/2022'
}, 
{
  description: 'Internet',
  value: -20000,
  date: '17/01/2022'
}, 
{
  description: 'Website',
  value: 500000,
  date: '12/01/2022'
},
{
  description: 'App',
  value: 700000,
  date: '12/01/2022'
}
];

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  // Pegar os valores e organizar
  getValues(){
    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value
    };
  },

  // Verificar se todos os campos foram preenchidos
  validadeFields(){
    if(
      this.getValues().description === '' ||
      this.getValues().amount === '' ||
      this.getValues().date === ''
    ){
      alert(
        "Opa! Algo deu errado... Por favor, preencha os campos corretamente."
      );
    };
  },

  // Formatar os dados para salvar
  formatData(){
    let { description, amount, date } = this.getValues(); 
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    return {
      description: description,
      value: amount,
      date
    };
  },

  // Salvando a transação
  saveTransaction(transaction){
    Transactions.add(transaction);
  },

  // Limpar os dados dos campos
  clearFields(){
    this.description.value = "";
    this.amount.value = "";
    this.date.value = "";
  },

  // Enviar dados
  submit(event) {
    event.preventDefault();

    // Validando os campos
    // Form.validadeFields();

    // Formatando os campos
    const transaction = Form.formatData();
    console.log(transaction);

    // Salvando a transação
    Form.saveTransaction(transaction);

    // Limpando os campos
    Form.clearFields();

    // Fechando o modal
    Modal.close();
  }
}

// Calcular as entradas e saídas e somar num total
const Transactions = {
  all: transactions,
  add(transaction){
    Transactions.all.push(transaction);

    App.reload();
  },
  remove(index){
    Transactions.all.splice(index, 1);

    App.reload();
  },
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
    return Transactions.incomes() + Transactions.expanses();
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

    let value = Utils.formatCurrency(transaction.value);
    console.log(value);

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
    Utils.changeColor();
  },

  // Limpar o conteúdo quando ele der o reload
  clearTransactions(){
    DOM.transactionsContainer.innerHTML = '';
  }
};

// Utilitários do código
const Utils = {
  // Formatar o número para a moeda br
  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return signal + " " + value;
  },
  // Mudar cor do totalDisplay caso o valor seja negativo:
  changeColor (){
  let totalTransactions = Transactions.total();
  const totalDisplay = document.getElementById("total");
  
  if(totalTransactions < 0){
    totalDisplay.classList.add("negative");
  }
  
},
  // Formatar o valor "amount" do modal
  formatAmount(value){
    value = Number(value) * 100
    console.log(value);
    return value
  },
  // Formatar o valor "date" do modal
  formatDate (date){
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  }
};

const App = {
  init() {
    Transactions.all.forEach((transaction) => {
      DOM.addTransaction(transaction)
    });

    DOM.updateBalance();
  },
  reload() {
    // Limpando o conteúdo antigo para não duplica-los na table
    DOM.clearTransactions();

    App.init();
  }
};

App.init();
