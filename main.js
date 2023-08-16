// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img src="./src/assets/cluj_2560x1440.jpg" alt="summer">
      <h2 class="textbox h2-over-image" text-center >Cluj-Napoca Events</h2>
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    </div>
  `;
}
//added
window.addEventListener('scroll', function() {
  const h2 = document.querySelector('.h2-over-image');
  if (window.scrollY > 50) {
      h2.style.display = 'none';
  } else {
      h2.style.display = 'block';
  }
});

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  console.log('function', fetchTicketEvents());
  fetchTicketEvents()
    .then((data) => {
    addEventsOnPage(data);
    // console.log('data', data);
  });
}

async function fetchTicketEvents(){
  const response = await fetch('https://localhost:7198/api/Event/GetAll');
  const data = await response.json();
  return data;
}


const addEventsOnPage = (events) => {
  const eventDiv = document.querySelector('.events');
  eventDiv.innerHTML = 'No events';
  if (events.length){
    eventDiv.innerHTML = '';
    events.forEach(event => {
      eventDiv.appendChild(createEventElement(event))
    })
  }
}

const createEvent = (eventData) => {
  const title = kebabCase(eventData.eventType.eventName);
  const eventElement = createEventElement(eventData, title);
  return eventElement;
}


const createEventElement = (eventData) => {
  const {eventId, eventName, eventDescription, venue, startDate, endDate, ticketCategories} = eventData;
  const eventDiv = document.createElement('div');
  eventDiv.classList.add('eventCard');

  const contentMarkup = `
    <header>
      <h2 class = "event-title text-2xl font-bold">${eventData.eventName}</h2>
    </header>
    <div class = "content">
      <p class = "description text-gray-700">${eventData.eventDescription}</p>
      <p class = "description text-gray-700">Event Type: ${eventData.eventType}</p>
      <p class = "description text-gray-700">Start date: ${eventData.startDate}</p>
      <p class = "description text-gray-700">End date: ${eventData.endDate}</p>
      <p class = "description text-gray-700">Venue: ${eventData.venue}</p> 
      <p class = "description text-gray-700"></p>
          
    </div>
  `;

  eventDiv.innerHTML = contentMarkup;


  const actions = document.createElement('div'); 

  const categoriesOptions = `<select name="ticketCategory">` +
                              eventData.ticketCategories.map(ticket => `
                            <option value="${ticket.ticketCategoryId}">
                              ${ticket.Description} - ${ticket.price.toFixed(2)}
                            </option>`
                            ).join('') +
                            `</select>`;

                            
    actions.innerHTML = categoriesOptions;

    eventDiv.appendChild(actions);
  
  const quantity = document.createElement('div');
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.max = '10';
  input.value = '0';

  input.addEventListener('blur', () => {
    if(!input.value){
      input.value = 0;
    }
  });

  input.addEventListener('input', () =>{
    const currentQuantity = parseInt(input.value);
    const addToCart = eventCard.querySelector('.buybutton');
    if(currentQuantity >0){
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
  });

  quantity.appendChild(input);

  const quantityAction = document.createElement('div');

  const increase = document.createElement('button');
  increase.classList.add('increaseBtn');
  increase.innerText = '+';
  increase.addEventListener('click', () => {
  input.value = parseInt(input.value) + 1;
  const currentQuantity = parseInt(input.value);
  if(currentQuantity > 0){
    addToCartBtn.disabled = false;
  } else {
    addToCartBtn.disabled = true;
  }
  });

  const decrease = document.createElement('button');
    decrease.classList.add('decreaseBtn');
    decrease.innerText = '-';
    decrease.addEventListener('click', () => {
    const currentValue = parseInt(input.value);
    if(currentValue > 0){
      input.value = currentValue - 1;
    }
    const currentQuantity = parseInt(input.value);
    if(currentQuantity > 0){
      addToCartBtn.disabled = false;
    } else {
      addToCartBtn.disabled = true;
    }
  });

  quantityAction.appendChild(increase);
  quantityAction.appendChild(decrease);

  quantity.appendChild(quantityAction);
  actions.appendChild(quantity);
  eventDiv.appendChild(actions);

  const label = document.createElement('label');
  label.textContent = 'Number of tickets: ';
  label.appendChild(input);

  eventDiv.appendChild(label);

  const eventFooter = document.createElement('footer');
  const addToCartBtn = document.createElement('button');
  addToCartBtn.textContent = 'Buy Ticket';
  addToCartBtn.classList.add('add-to-cart-btn');
  addToCartBtn.addEventListener('click', () => {
    const selectedTicketCategoryRadio = document.querySelector(`input[name="ticketCategory-${eventId}"]:checked`);
    if (!selectedTicketCategoryRadio) {
      alert('Please select a ticket category');
      return;
    } else{
      handleAddToCart(eventId,input,selectedTicketCategoryRadio,addToCartBtn);
    }
  });

  eventFooter.appendChild(addToCartBtn);
  eventDiv.appendChild(eventFooter);

  return eventDiv;
}

//IMPLEMENT THIS
// handleAddToCart





function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();