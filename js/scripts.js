const body = document.querySelector('body');
const gallery = document.getElementById('gallery');
const search = document.querySelector('.search-container');

/***
** ---------------
   Fetch API
** ---------------
***/

function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log('Uh oh, something has gone wrong.', error));
}


fetchData('https://randomuser.me/api/?results=12&nat=us')
    .then(data => {
        changeBG();
        changeText();
        generateProfiles(data.results);
        createSearch();
        createModalEvents(data);
    });


/***
** ----------------
   Helper functions
** ----------------
***/

function checkStatus(response) {
    // checks the response from the promise
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}


/*** 
** -----------------
   Create Gallery
** -----------------
***/

function generateProfiles(data) {
    const empolyeeLists = data.map(user =>
        `<div class="card">
            <div class="card-img-container">
            <img class="card-img" src="${user.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
        </div>`).join('');
    gallery.innerHTML = empolyeeLists;
}



/*** 
** ----------------
  Create Modal HTML
** ----------------
***/

const containerDiv = document.createElement('div');

function generateModal(data, index) {
    //create user variable to store multiple users in the card
    const users = data.results[index];
    // format users birthday

    //     const date = new Date(user[i].dob.date); // create and formate the birthday date 
    //    const day = date.getDate (); // get the day
    //    const month = date.getMonth () + 1; // get the month
    //    const year = date.getFullYear (); // get the year

    const dob = users.dob.date;
    const day = users.dob.date.slice(8, 10);
    const month = users.dob.date.slice(5, 7);
    const year = users.dob.date.slice(0, 4);
    const birthday = `${month}/${day}/${year}`;

    // Create modal HTML container
    const modalHTML = `<div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src=${users.picture.large} alt="profile picture">
                    <h3 id="name" class="modal-name cap">${users.name.first} ${users.name.last}</h3>
                    <p class="modal-text">${users.email}</p>
                    <p class="modal-text cap">${users.location.city}</p>
                    <hr>
                    <p class="modal-text">${users.phone}</p>
                    <p class="modal-text">${users.location.street.number} ${users.location.street.name}, ${users.location.city}, ${users.location.state} ${users.location.postcode}</p>
                    <p class="modal-text">Birthday: ${birthday}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>`

    gallery.innerHTML += modalHTML;
    nextPrevBtn(data, index);

    //    checkDataIndex(index);

}


/*** 
** -----------------------------------------------------
  create function to the modal when the card was clicked
** -----------------------------------------------------
***/

function createModalEvents(data) {
    const card = document.querySelectorAll('.card');
    card.forEach((card, index) => {
        card.addEventListener('click', () => generateModal(data, index));
    });
}


/*** 
** ------------------------------------------------------
  Create next and prev button when the button was clicked
** ------------------------------------------------------
***/

function nextPrevBtn(data, index) {

    const modalButton = document.querySelector(".modal-close-btn");
    const modalContainer = document.querySelector('.modal-container');

    // Closing modal window
    modalButton.addEventListener('click', () => {
        modalContainer.remove();
        createModalEvents(data, index);
    });

    // create click function for prev button, when modal window is clicked 
    const prevBtn = document.querySelector('#modal-prev');
    prevBtn.addEventListener('click', () => {
        modalContainer.remove();
        generateModal(data, index - 1);
    });
    // create click function for next button, when the next card is clicked 
    const nextBtn = document.querySelector('#modal-next');
    nextBtn.addEventListener('click', () => {
        modalContainer.remove();
        generateModal(data, index + 1);
    });

    // if only one card was shown then hide both next and prev button
    if (data.results.length === 1) {
        const modalBtn = document.querySelector('.modal-btn-container');
        modalBtn.style.display = 'none';
    } else {
        //create a function for prev and next button to show or not show
        if (index === 0) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = '';
        } else if (index <= data.results.length - 2) {
            prevBtn.style.display = '';
            nextBtn.style.display = '';
        } else {
            prevBtn.style.display = '';
            nextBtn.style.display = 'none';
        }
    }

}

//const $employeesInfo = [];

//create a function when the button was hidden or show
//function checkDataIndex(index) {
//  if (index === 0) {
//    $('#modal-prev').hide();
//    $('#modal-next').show();
//  } else if (index === $employeesInfo.length - 1) {
//    $('#modal-next').hide();
//    $('#modal-prev').show();
//  } else {
//    $('#modal-next').show();
//    $('#modal-prev').show();
//  }
//}
/***
** -----------------------
   Create Search function
** -----------------------
***/

function createSearch() {
    const searchField =
        `<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
      </form>`
    search.innerHTML = searchField;

    //     add event listener to search input
    const searchInput = document.querySelector('#search-input');
    searchInput.addEventListener('keyup', (e) => {
        const searchResult = e.target.value.toLowerCase();
        filterNames(searchResult);

    });

    // add event listener to search  submit
    const submit = document.querySelector('#search-submit');
    submit.addEventListener('click', (e) => {
        e.preventDefault();
        const searchResult = e.target.firstElementChild.value.toLowerCase();
        filterNames(searchResult);

    });

}

/***
** ----------------------------------------------------------
   Create a search by name and add no search result function
** ----------------------------------------------------------
***/

// create a function to search by name
function filterNames(input) {
    const empolyeeCard = document.querySelectorAll('.card');
    const foundCardsArr = [];
    //using for loop to loop though the random empolyee cards to find the match one
    for (let i = 0; i < empolyeeCard.length; i += 1) {
        const name = empolyeeCard[i].querySelector('h3').textContent.toLowerCase();
        if (name.includes(input)) {
            empolyeeCard[i].style.display = '';
            foundCardsArr.push(empolyeeCard[i]);
        } else {
            empolyeeCard[i].style.display = 'none';
        }
    }

    //create error message when is no search result found
    if (foundCardsArr.length === 0) {
        console.log(foundCardsArr);
        let errorMessage = document.querySelector('.no-result');
        if (!errorMessage) {
            errorMessage = document.createElement('h2');
            errorMessage.className = 'no-result';
            errorMessage.innerHTML = 'No Match Found';
            errorMessage.style.color = '#E25A53';
            gallery.appendChild(errorMessage);
        }
    } else {
        const showResult = document.querySelector('.no-result');
        if (showResult) {
            gallery.removeChild(showResult);
        }
    }
}

/***
** ---------------------------------------
   change background color and text color
** ---------------------------------------
***/

function changeBG() {
    document.body.style.background = 'rgba(173, 220, 202)';
}

function changeText() {
    document.querySelector('h1').style.color = 'darkblue';

}


//click anywhere outside of the container to close modal
window.addEventListener('click', (e) => {
    const modalWindow = document.querySelector('.modal-container');

    if (e.target == modalWindow) {
        modalWindow.remove();
    }
});
