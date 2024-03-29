class Weight {
  constructor(date, weight) {
    this.date = date;
    this.weight = weight;
  }
}

class UI {
  addWeightToList(weight) {
    const list = document.querySelector('.display-weight-list');
    const ul = document.createElement('ul');
    ul.className += 'weight-list';
    ul.innerHTML = `
    <li id="show-weight">
    Weight: ${weight.weight} <a href="#" class="delete">X</a>
  </li>
  <li id="show-date">
    Date Created: ${weight.date} <a href="#" class="delete">X</a>
  </li>
    `;
    list.appendChild(ul);
  }

  addCalcToList(calculations) {
    const list = document.querySelector('.calculations-list ');
    const ul = document.createElement('ul');
    ul.innerHTML = `
    <li class="average-weight">Average Weight: ${calculations.averageWeight()}</li>
    <li class="min-weight">Lowest Weight: ${calculations.minimumWeight()} On Date: 2019-7-14</li>
    <li class="max-weight">Highest Weight: ${calculations.maximumWeight()} On Date: 2019-7-12</li>
    `;
    list.appendChild(ul);
  }

  deleteWeight(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearField() {
    document.querySelector('#weight').value = '';
  }

  showAlert(message, className) {
    const div = document.createElement('div');

    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');
    const form = document.querySelector('#weight-form');

    container.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }
}

class LocalStorage {
  static getWeights() {
    let weights;

    if (localStorage.getItem('weights') === null) {
      weights = [];
    } else {
      weights = JSON.parse(localStorage.getItem('weights'));
    }

    return weights;
  }

  static addWeight(weight) {
    const weights = LocalStorage.getWeights();

    weights.push(weight);

    localStorage.setItem('weights', JSON.stringify(weights));
  }

  static displayWeights() {
    const weights = LocalStorage.getWeights();

    weights.forEach(weight => {
      const ui = new UI();

      ui.addWeightToList(weight);
    });
  }

  static removeWeights(weight) {
    const weights = LocalStorage.getWeights();

    weights.forEach(weight => {
      if (weight.weight === weight) {
        // So you can delete the whole thing from one or the other.
        weights.splice(index, 0);
        weights.splice(index, 1);
      }
    });

    localStorage.removeItem('weights', JSON.stringify(weights));
  }
}

class WeightMath {
  averageWeight() {
    let weights = LocalStorage.getWeights(),
      total = 0,
      sum = 0,
      average;

    weights.forEach(weight => {
      total += 1;
      sum += Number(weight['weight']);
    });

    average = sum / total;

    return average;
  }

  minimumWeight() {
    let weights = LocalStorage.getWeights();

    // Found on a stack overflow, works perfectly to get the minimum weight.
    let minWeight = weights.reduce((previous, current) =>
      previous.weight > current.weight ? current : previous['weight']
    );

    return Number(minWeight);
  }

  maximumWeight() {
    let weights = LocalStorage.getWeights();

    // Reversed order of the minWeight.
    let maxWeight = weights.reduce((previous, current) =>
      previous.weight < current.weight ? previous : current['weight']
    );

    return Number(maxWeight);
  }
}

document.addEventListener('DOMContentLoaded', LocalStorage.displayWeights);

document.querySelector('#weight-form').addEventListener('submit', e => {
  const weight = document.querySelector('#weight').value;
  let today = new Date();
  let todaysDate = `${today.getFullYear()} - ${today.getMonth()} - ${today.getDate()}`;

  const weightClass = new Weight(todaysDate, weight);

  const ui = new UI();

  if (weight === '') {
    ui.showAlert('Please add a number', 'alert');
  } else {
    ui.addWeightToList(weightClass);
    LocalStorage.addWeight(weightClass);

    ui.showAlert('Adding weight was successful!', 'success');
    ui.clearField();
  }

  e.preventDefault();
});

document.querySelector('.display-weight-list').addEventListener('click', e => {
  const ui = new UI();

  ui.deleteWeight(e.target);

  LocalStorage.removeWeights(
    e.target.parentElement.previousElementSibling.textContent
  );

  ui.showAlert('Weight removed!', 'success');
});
