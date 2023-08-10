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
  fetchTicketEvents().then((data)=>{
    console.log('data', data);
  });

  const eventsData = await fetchTicketEvents();

  const eventsContainer = document.querySelector('.events');

  eventsData.forEach(eventData => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');
    
    const contentMarkup = `
      <div class = "eventCard">
        <header>
          <h2 class = "event-title text-2xl font-bold">${eventData.eventName}</h2>
        </header>
        <div class = "content">
          <p class = "description text-gray-700">${eventData.eventDescription}</p>
          <p class = "description text-gray-700">Event Type: ${eventData.eventType}</p>
          <p class = "description text-gray-700">Start date: ${eventData.startDate}</p>
          <p class = "description text-gray-700">End date: ${eventData.endDate}</p>
          <p class = "description text-gray-700">Venue: ${eventData.venue}</p> 
          <button class="buybutton text-black px-4 py-2 rounded mt-4 ">Buy Tickets</button>
        </div>
      </div>
    `;

    eventCard.innerHTML = contentMarkup;
    eventsContainer.appendChild(eventCard);
  });

  const actions = document.createElement('div'); 
    const categoriesOptions = ticketCategory.map( 
      (ticketCategory) =>
       `<option value = ${ticketCategory.TicketCategoryId}> ${ticketCategory.Description} </option>`
       );
  
       const ticketTypeMarkup = `
      <h2 class = "text-lg font-bold mb-2"> Choose Ticket Type: </h2>
      <select id = "ticketCategoryId" name = "ticketCategoryId">
        <option value = "Standard">Standard</option>
        <option value = "VIP">VIP</option>
      </select>
       `
  actions.innerHTML = ticketTypeMarkup;
  eventCard.appendChild(actions);
  
  const quantity = document.createElement('div');
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
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

}
  

async function fetchTicketEvents(){
  const response = await fetch('https://localhost:7198/api/Event/GetAll');
  const data = await response.json();
  return data;
}


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
