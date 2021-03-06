const main = document.querySelector('main');
const categories = ['metal', 'metalloid', 'nonmetal', 'noble', 'alkali', 'alkaline', 'transition', 'lanthanide', 'actinide'];
let activeElement = null;
var granimInstance = new Granim({
  element: '#canvas-basic',
  direction: 'left-right',
  isPausedWhenNotInView: true,
  states: {
    "default-state": {
      gradients: [
      ['#010014', '#000025'],
      ['#142136', '#21274E'],
      ['#130f40', '#000000']] } } });




loadElements().then(outputElements);

// Load the elements of the periodic table
// JSON data is provided by the Periodic Table JSON GitHub Repo
// https://github.com/Bowserinator/Periodic-Table-JSON
function loadElements() {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    let url = './periodictable.json';
    req.open('GET', url);
    req.onload = function () {
      
      resolve(JSON.parse(req.response).elements);
    };
    req.send();
  });
}

// Output one <abbr> per element
function outputElements(elements) {
  let abbreviations = [];

  elements.forEach(elem => {
    let abbr = document.createElement('abbr');
    abbr.innerHTML = "<span style='font-size:60%;'>" + elem.number + "</span><b>" + elem.symbol + "</b><span style='font-size:50%;'>" + elem.name + "</span><br>" + "<span style='font-size:50%; padding:0 ; margin:0; transform:translateY(-1.1rem)'>" + elem.atomic_mass.toFixed(2) + "</span><br>";

    abbr.style.gridColumn = elem.xpos;
    abbr.style.gridRow = elem.ypos;

    abbr.classList.add(elem.category.
    split(/[ ,]/).
    filter(c => {
      let ind = categories.indexOf(c);
      return ind >= 0;
    })[0]);

    abbr.addEventListener('click', () => {
      if (activeElement) activeElement.classList.remove('focus');
      abbr.classList.add('focus');
      activeElement = abbr;
      showInfo(elem);
    });
    main.appendChild(abbr);
    abbreviations.push(abbr);
  });

  let i = Math.floor(Math.random() * abbreviations.length);
  abbreviations[i].click();
}

const elName = document.getElementById('name');
const elSummary = document.getElementById('summary');
const elDiscoveredBy = document.getElementById('discovered-by');
const elCateg = document.getElementById('categ');
const elAtomicMass = document.getElementById('atomic-mass');
const elDensity = document.getElementById('density');
const elConfig = document.getElementById('config');
const elBoil = document.getElementById('boil');
const elMelt = document.getElementById('melt');

// Show detailed information regarding one element
function showInfo(element) {
  elName.textContent = element.number + '.  ' + element.name;
  elName.href = element.source;

  elSummary.textContent = element.summary;
  elDiscoveredBy.textContent = u(element.discovered_by);
  elCateg.textContent = u(element.category);
  elAtomicMass.textContent = u(element.atomic_mass) + ' u';
  elDensity.textContent = u(element.density) + ' g/L';
  elConfig.textContent = u(element.electron_configuration_semantic);
  elBoil.textContent = u(element.boil) + ' K';
  elMelt.textContent = u(element.melt) + ' K';

  // Replace null by "Unknown"
  function u(s) {
    return s ? s : 'Unknown';
  }
}